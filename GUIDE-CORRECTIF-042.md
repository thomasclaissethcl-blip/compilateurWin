# H5P Studio Portable 0.4.2 : correctif pour Windows 11

Ce correctif part du dépôt **0.4.1**. Il ne nécessite **aucune installation de Node.js sur votre ordinateur** : GitHub Actions effectue la compilation.

## Ce qui a été corrigé

1. **Rapport invisible / bouton d'analyse grisé.** Les éléments `registryImportReport`, `registryResolveBtn`, `registryResolveReport` et `coreEvidenceStatus` figuraient deux fois dans `index.html`. Le script utilisait ceux d'un onglet masqué. Ils n'existent maintenant qu'une fois, dans **Registre multiversion**.
2. **Import partiel avec `EPERM` sous Windows.** Une installation rejoue plusieurs fois le déplacement de dossier si Windows renvoie `EPERM`, `EACCES` ou `EBUSY`. Si le déplacement demeure impossible, le contenu est copié dans la destination, puis la métadonnée de fin d'installation est écrite en dernier. L'import reste additif et ne remplace jamais une variante existante. Un dossier de destination incomplet fait l'objet d'une erreur explicite et n'est pas écrasé.
3. **Rapport conservé.** Le dernier bilan d'importation est enregistré dans `data/libraries/last-import-report.json` et relu au prochain démarrage. Il est disponible depuis **Registre multiversion**.
4. **Prévisualisation.** Le contrôle interne `canPreview()` renvoie maintenant explicitement `true` si ses vérifications sont satisfaites.

L'origine exacte des deux `EPERM` de votre précédente compilation n'est pas démontrée. Ce correctif améliore la tolérance aux verrouillages Windows ; il ne contourne pas une politique de sécurité institutionnelle ou une interdiction d'accès au dossier.

## Application dans GitHub

1. Fermez H5P Studio. **Sauvegardez intégralement le dossier `data/` de la distribution 0.4.1.** Ne le supprimez pas.
2. Décompressez `Correctif-H5P-Studio-0.4.2-GitHub.zip` sur votre ordinateur.
3. À la racine du dépôt GitHub existant, remplacez ces fichiers en respectant leurs dossiers :
   - `index.html`
   - `assets/app.js`
   - `runtime/library-registry.cjs`
   - `electron/main.cjs`
   - `electron/preload.cjs`
   - `package.json`
4. Ajoutez `tests/registry-042.test.cjs`.
5. Dans l'éditeur GitHub, remplacez également le contenu de `.github/workflows/windows-portable.yml` par le fichier fourni. Le workflow conserve **uniquement** la distribution DOSSIER.
6. Validez les changements (`Commit changes`), puis ouvrez **Actions → Compiler H5P Studio Windows DOSSIER**. Si nécessaire, utilisez **Run workflow**.
7. Après réussite, téléchargez `H5P-Studio-Portable-0.4.2-Windows-DOSSIER` dans **Artifacts**, puis décompressez l'archive.
8. Application fermée, recopiez votre dossier `data/` sauvegardé dans la nouvelle distribution. Vérifiez qu'aucun dossier `data` ne se trouve dans `resources/app.asar`.

## Test avec RIS503-Mission3.h5p

1. Ouvrez le `.h5p` dans 0.4.2.
2. Dans **Registre multiversion**, vérifiez que les **70 variantes déjà installées** sont toujours visibles (ou davantage si vous avez procédé à d'autres installations). Le nombre peut varier si les données de la version précédente n'ont pas été recopiées.
3. Cliquez sur **Enregistrer les bibliothèques du H5P ouvert**. Les bibliothèques déjà installées doivent être déclarées **DÉJÀ PRÉSENTES** ; les variantes auparavant refusées peuvent être installées. Aucune suppression n'est nécessaire.
4. Ouvrez **Dernier rapport d'importation** dans l'onglet **Registre multiversion**. Vérifiez le nombre de `library.json` trouvés, les installations, les doublons et les éventuels rejets. Le rapport reste lisible après redémarrage.
5. Cliquez sur **Analyser les dépendances de l'activité ouverte**. Le bouton doit maintenant être cliquable. Transmettez tout conflit, manque ou variante ambiguë.
6. Vérifiez si nécessaire la prévisualisation intégrée, le plein écran et l'export HTML.

Le contrôle des dépendances reste **statique** et l'API du cœur Standalone demeure **non certifiée**. La sélection d'une version ne remplace pas les bibliothèques dans une activité et n'effectue pas de migration.

## En cas d'EPERM persistant

Copiez dans votre retour la ou les nouvelles lignes `REJETÉE`, avec leur message complet, ainsi que le chemin de `data/`. Les explications possibles incluent un répertoire de destination préexistant mais incomplet, un verrouillage de fichiers, des droits d'accès insuffisants ou un logiciel de sécurité. N'ajoutez pas d'exclusion antivirus avant d'avoir identifié la cause.
