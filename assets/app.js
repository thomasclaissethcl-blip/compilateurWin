(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  let project = null;
  let filename = '';
  let active = 'contenu';
  let dirty = false;
  let lastValidated = false;
  function text(id, value) { $(id).textContent = value; }
  function showAlert(message, kind='info') {
    const box = $('message'); box.textContent = message; box.dataset.kind = kind; box.hidden = false;
  }
  function clearAlert() { $('message').hidden = true; }
  function loading(enabled) { $('importBtn').disabled = enabled; $('saveBtn').disabled = enabled || !project; $('staticBtn').disabled = enabled || !project; $('viewBtn').disabled = enabled || !project; }
  function markDirty() { dirty = true; lastValidated=false; text('changeStatus','Modifications non exportées'); $('changeStatus').className = 'dirty'; }
  function librariesTable(libs) {
    const tbody = $('librariesTable'); tbody.replaceChildren();
    if (!libs.length) { const tr=document.createElement('tr'); const td=document.createElement('td'); td.colSpan=4; td.textContent='Aucune bibliothèque intégrée'; tr.append(td); tbody.append(tr); return; }
    for (const lib of libs.sort((a,b)=>a.machineName.localeCompare(b.machineName))) {
      const tr = document.createElement('tr');
      const cells = [lib.machineName, `${lib.majorVersion}.${lib.minorVersion}.${lib.patchVersion ?? 0}`,
        lib.coreApi ? `${lib.coreApi.majorVersion}.${lib.coreApi.minorVersion}` : 'Non indiquée', lib._folder];
      for (const c of cells) { const td=document.createElement('td'); td.textContent=c; tr.append(td); }
      tbody.append(tr);
    }
  }
  function setTab(tab) {
    active=tab;
    document.querySelectorAll('[data-tab]').forEach(el => el.classList.toggle('selected', el.dataset.tab===tab));
    document.querySelectorAll('[data-panel]').forEach(el => el.hidden=el.dataset.panel!==tab);
  }
  function updateReport() {
    if (!project) return;
    const warnings=project.warnings;
    const lines=[
      `Fichier : ${filename}`,
      `Titre : ${project.metadata.title}`,
      `Type principal : ${project.metadata.mainLibrary}`,
      `Langue : ${project.metadata.language}`,
      `Dépendances déclarées : ${Array.isArray(project.metadata.preloadedDependencies) ? project.metadata.preloadedDependencies.length : "non fournies sous forme de liste"}`,
      `Dépendances reconnues : ${project.dependencyStats.recognized} ; rejetées : ${project.dependencyStats.rejected}`,
      `Déclarations avec versions en chaînes numériques (tolérées) : ${project.dependencyStats.toleratedStringEntries}`,
      `État de la vérification : ${project.dependencyStatus === 'complet' ? 'COMPLET (contrôle statique uniquement)' : project.dependencyStatus === 'partiel' ? 'PARTIEL' : 'INDÉTERMINÉ'}`,
      `Entrées dans le ZIP : ${project.scan.entryCount}`,
      `Bibliothèques présentes : ${project.libraries.length}`,
      `Dépendances manquantes ou non embarquées : ${project.dependencyStatus === 'complet' ? String(project.missing.length) : 'INDÉTERMINÉ ('+project.missing.length+' manquante(s) parmi les dépendances analysables)'}`,
      '',
      'AVERTISSEMENTS (sur le fichier importé) :',
      ...(warnings.length ? warnings.map(w=>' • '+w) : [' Aucun avertissement structurel détecté.']),
      '',
      'IMPORTANT : les versions textuelles sont tolérées pour l’analyse, sans validation formelle de leur conformité H5P.',
      'Le diagnostic vérifie la structure et les dépendances.',
      'Il ne garantit pas la compatibilité avec une version du cœur H5P.',
      'Aucun script du fichier importé n’est exécuté ici.'
    ];
    text('reportText',lines.join('\n'));
  }
  function updateValidation() {
    if (!project) return;
    try {
      const {metadata,warnings}=H5PArchive.validateEditing($('metadataJson').value,$('contentJson').value);
      text('editedTitle',metadata.title || '(sans titre)');
      if (warnings.length) showAlert('JSON valides, mais '+warnings.length+' anomalie(s) de structure dans h5p.json : '+warnings.join(' '), 'warning');
      else showAlert('JSON valides, principaux champs h5p.json cohérents. La conformité H5P complète n’est pas vérifiée.', 'success');
      lastValidated=true;
    } catch(e) { lastValidated=false; showAlert(e.message,'error'); }
  }
  async function importFile(file) {
    if (!file) return;
    if (!/\.h5p$/i.test(file.name)) return showAlert('Veuillez sélectionner une archive portant l’extension .h5p.', 'error');
    loading(true); clearAlert(); text('appStatus','Lecture et analyse en cours…');
    try {
      const bytes = await file.arrayBuffer();
      const obj = await H5PArchive.openArchive(bytes,window.JSZip);
      project=obj; filename=file.name;
      $('metadataJson').value=JSON.stringify(obj.metadata,null,2);
      $('contentJson').value=JSON.stringify(obj.content,null,2);
      text('currentFilename',file.name);
      text('editedTitle',obj.metadata.title);
      text('mainLibrary',obj.metadata.mainLibrary);
      text('libraryCount',String(obj.libraries.length));
      text('warningCount',String(obj.warnings.length));
      text('currentSize',(file.size/1024/1024).toFixed(2)+' Mo');
      text('appStatus', 'Archive ouverte. Édition JSON disponible.');
      $('workspace').hidden=false; $('emptyState').hidden=true; $('previewTab').disabled=false; $('shortcutStatic').disabled=false;
      librariesTable(obj.libraries); updateReport(); setTab('contenu');
      dirty=false; lastValidated=false;
      text('changeStatus','Aucune modification exportée'); $('changeStatus').className='';
      if (obj.warnings.length) showAlert(`${obj.warnings.length} avertissement(s) détecté(s). Consultez l’onglet Diagnostic.`, 'warning');
      else showAlert('Archive lue correctement. Les fichiers non modifiés seront conservés lors de l’export.', 'success');
    } catch (err) { text('appStatus','Échec de lecture'); showAlert(err.message || String(err), 'error'); }
    finally { loading(false); $('fileInput').value=''; }
  }
  function saveBlob(blob, name) {
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=name; document.body.append(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),120000);
  }
  async function exportH5P() {
    if (!project) return;
    loading(true); text('appStatus','Création du fichier H5P…');
    try {
      const edited=H5PArchive.validateEditing($('metadataJson').value,$('contentJson').value);
      const blob=await H5PArchive.saveArchive(project,$('metadataJson').value,$('contentJson').value,
        progress => text('appStatus',`Création du fichier H5P : ${progress} %`));
      const output=H5PArchive.exportName(edited.metadata.title);
      saveBlob(blob,output);
      text('appStatus','Export terminé : '+output);
      dirty=false; lastValidated=true;
      text('changeStatus','Export effectué : '+output); $('changeStatus').className='';
      if (edited.warnings.length) showAlert('Archive exportée avec '+edited.warnings.length+' anomalie(s) H5P signalée(s). Métadonnées préservées sans correction automatique. Vérifiez l’archive dans un éditeur H5P.', 'warning');
      else showAlert('Archive H5P générée. Vérifiez son ouverture dans Lumi ou Logiquiz avant toute publication.', 'success');
    } catch(e) {text('appStatus','Échec de l’export'); showAlert(e.message||String(e),'error');}
    finally {loading(false);}
  }

  function canPreview() {
    if (!project) return false;
    if (project.dependencyStatus !== 'complet' || project.missing.length) {
      setTab('report');
      showAlert('Lecture impossible : dépendances incomplètes ou manquantes. Consultez le diagnostic.', 'error');
      return false;
    }
    if (!window.studioDesktop?.isDesktop) {
      showAlert('La prévisualisation intégrée et l’export autonome nécessitent la version Electron de H5P Studio.', 'error');
      return false;
    }
    return true;
  }
  async function siteBytes() {
    const metadata=$('metadataJson').value, content=$('contentJson').value;
    const zip=await H5PStaticBuilder.build(project,metadata,content,window.JSZip,
      p=>text('previewStatus','Préparation des ressources : '+p+' %'));
    return new Uint8Array(await zip.arrayBuffer());
  }
  async function doPreview() {
    if (!canPreview()) return;
    loading(true);clearAlert();setTab('preview');
    text('previewStatus','Préparation du lecteur et de l’activité…');
    $('previewContainer').hidden=true;
    $('readerFallback').hidden=true;
    try {
      const result=await window.studioDesktop.preview(await siteBytes());
      const frame=$('previewFrame'); frame.src=result.url;
      $('previewContainer').hidden=false;
      text('previewStatus','Lecture intégrée initialisée. '+result.reader+'. Vérifiez les interactions.');
    } catch(e) {
      text('previewStatus','Prévisualisation impossible.');
      const reason=e.message||String(e);
      $('readerFallback').hidden=!/(?:lecteur|npm|téléchargement|réseau|network|fetch|incomplet)/i.test(reason);
      showAlert('Erreur du moteur de prévisualisation : '+reason, 'error');
    }finally{loading(false);}
  }
  async function exportStaticPreview() {
    if (!canPreview())return;
    loading(true);clearAlert();setTab('preview');
    $('readerFallback').hidden=true;
    text('previewStatus','Création du site HTML autonome avec lecteur embarqué…');
    try {
      const meta=H5PArchive.validateEditing($('metadataJson').value,$('contentJson').value);
      const result=await window.studioDesktop.export(await siteBytes(),meta.metadata.title);
      if(result.cancelled){text('previewStatus','Export annulé.');return;}
      text('previewStatus','ZIP enregistré : '+result.path);
      $('revealExportBtn').hidden=false;
      showAlert('ZIP HTML autonome enregistré : '+result.path+'  Cliquez sur « Afficher le ZIP » pour le retrouver.', 'success');
    }catch(e){
      const reason=e.message||String(e);
      text('previewStatus','Échec de génération');showAlert(reason,'error');
      $('readerFallback').hidden=!/(?:lecteur|npm|téléchargement|réseau|network|fetch|incomplet)/i.test(reason);
    }
    finally{loading(false);}
  }
  async function doReset() {
    if (!project) return;
    if (dirty && !confirm('Revenir aux données JSON d’origine et perdre les modifications ?')) return;
    $('metadataJson').value=JSON.stringify(project.metadata,null,2);
    $('contentJson').value=JSON.stringify(project.content,null,2);
    dirty=false; text('changeStatus','Modifications réinitialisées'); $('changeStatus').className='';
    clearAlert();
  }
  $('importBtn').addEventListener('click',()=> $('fileInput').click());
  $('fileInput').addEventListener('change',e=>importFile(e.target.files[0]));
  $('saveBtn').addEventListener('click',exportH5P);
  $('staticBtn').addEventListener('click',exportStaticPreview);
  $('revealExportBtn').addEventListener('click',async()=>{
    try{const result=await window.studioDesktop.revealExport();if(!result?.ok)showAlert('Aucun ZIP exporté à afficher.','warning');}
    catch(e){showAlert(e.message||String(e),'error');}
  });
  $('viewBtn').addEventListener('click',doPreview);
  $('importReaderBtn').addEventListener('click',async()=>{
    if(!window.studioDesktop)return;
    try {const x=await window.studioDesktop.importPlayer();if(x?.ok){$('readerFallback').hidden=true;showAlert('Lecteur local enregistré. Vous pouvez relancer la prévisualisation.', 'success');}}
    catch(e){showAlert(e.message||String(e),'error');}
  });
  $('shortcutStatic').addEventListener('click',()=>setTab('preview'));
  $('resetBtn').addEventListener('click',doReset);
  $('validateBtn').addEventListener('click',updateValidation);
  $('metadataJson').addEventListener('input',markDirty);
  $('contentJson').addEventListener('input',markDirty);
  document.querySelectorAll('[data-tab]').forEach(el=>el.addEventListener('click',()=>setTab(el.dataset.tab)));
  const drop=$('dropZone');
  ['dragenter','dragover'].forEach(event=>drop.addEventListener(event,e=>{e.preventDefault();drop.classList.add('over');}));
  ['dragleave','drop'].forEach(event=>drop.addEventListener(event,e=>{e.preventDefault();drop.classList.remove('over');}));
  drop.addEventListener('drop',e=>importFile(e.dataTransfer.files[0]));
  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault(); e.returnValue='';}});
  text('runtimeVersion','Standalone '+H5PStaticBuilder.PLAYER_VERSION+' (lecteur géré par Electron ; compatibilité à valider)');
  $('desktopFallback').hidden=Boolean(window.studioDesktop?.isDesktop);
  if(!window.studioDesktop?.isDesktop){$('viewBtn').disabled=true;$('staticBtn').disabled=true;}
  else window.studioDesktop.info().catch(()=>{});
})();
