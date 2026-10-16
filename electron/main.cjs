'use strict';
const {app,BrowserWindow,ipcMain,dialog,session,shell}=require('electron');
const fs=require('node:fs');const fsp=fs.promises;const path=require('node:path');const os=require('node:os');const crypto=require('node:crypto');
const {ensureRuntime,adoptLocalPlayer,PLAYER_VERSION}=require('../runtime/player-manager.cjs');
const {extractPreview,exportStaticZip,startPreviewServer}=require('../runtime/studio-site.cjs');
const {portableRoot:resolvePortableRoot}=require('../runtime/portable-path.cjs');
const {fullscreenAllowed}=require('../runtime/fullscreen-permission.cjs');
const APP_VERSION='0.3.4';
// On packaged folder builds, __dirname belongs to resources/app.asar (read only).
// Data must live next to the real executable, never inside app.asar.
const portableRoot=resolvePortableRoot({portableDir:process.env.PORTABLE_EXECUTABLE_DIR,
  packaged:app.isPackaged,exePath:process.execPath,sourceDir:__dirname});
const requestedProfile=path.join(portableRoot,'data','electron-profile');
let dataRoot=portableRoot;
try{
 fs.mkdirSync(requestedProfile,{recursive:true});
 fs.accessSync(requestedProfile,fs.constants.W_OK);
 app.setPath('userData',requestedProfile);
}catch(e){
 // Read-only removable media or Windows directory: preserve a functioning application.
 // Explicitly identify the fallback, so users do not assume their data is portable.
 dataRoot=path.join(app.getPath('userData'),'H5P-Studio-Data');
 fs.mkdirSync(dataRoot,{recursive:true});
 console.warn('Données portables indisponibles ; repli dans le profil utilisateur : '+e.message);
}
app.setAppUserModelId('local.h5pstudio.portable');
let mainWindow=null, preview=null, workdir=null, playerPromise=null, lastExport=null;
const cacheDir=path.join(dataRoot,'data','runtime','standalone',PLAYER_VERSION);
const bundledDir=app.isPackaged?path.join(process.resourcesPath,'reader',PLAYER_VERSION):path.join(portableRoot,'runtime-bundled',PLAYER_VERSION);
const exportsDir=path.join(dataRoot,'exports');
function player(){
 if(!playerPromise){playerPromise=ensureRuntime({cacheDir,bundledDir}).catch(e=>{playerPromise=null;throw e;});}
 return playerPromise;
}
function checkCaller(e){
 if(!mainWindow||e.sender!==mainWindow.webContents||e.senderFrame!==mainWindow.webContents.mainFrame)throw Error('Origine non autorisée.');
}
function safeTitle(s){return String(s||'activite').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9-]/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,65)||'activite';}
async function prepareBytes(bytes){
 if(!bytes||!Number.isInteger(bytes.length)||bytes.length<100||bytes.length>300*1024*1024)throw Error('Archive de site invalide ou trop volumineuse.');
 return Buffer.from(bytes);
}
async function closePreview(){
 if(preview){await new Promise(done=>preview.server.close(done));preview=null;}
 if(workdir){await fsp.rm(workdir,{recursive:true,force:true}).catch(()=>{});workdir=null;}
}
ipcMain.handle('desktop:status',async e=>{checkCaller(e);return {version:APP_VERSION,playerVersion:PLAYER_VERSION,portableRoot};});
ipcMain.handle('desktop:import-player',async e=>{
 checkCaller(e);const selected=await dialog.showOpenDialog(mainWindow,{title:'Sélectionner le dossier player du lecteur H5P',properties:['openDirectory']});
 if(selected.canceled||!selected.filePaths.length)return {cancelled:true};
 const result=await adoptLocalPlayer(selected.filePaths[0],cacheDir);playerPromise=Promise.resolve(result);
 return {ok:true,source:result.source};
});
ipcMain.handle('desktop:preview',async(e,bytes)=>{
 checkCaller(e);
 const input=await prepareBytes(bytes);
 const runtime=await player();
 await closePreview();
 workdir=await fsp.mkdtemp(path.join(os.tmpdir(),'h5p-studio-preview-'));
 try {
  const site=await extractPreview(input,runtime.dir,workdir);
  preview=await startPreviewServer(site);
  return {url:preview.url,reader:runtime.source};
 }catch(error){await closePreview();throw error;}
});
ipcMain.handle('desktop:export',async(e,bytes,title)=>{
 checkCaller(e);
 const input=await prepareBytes(bytes);
 const filename='h5p-site-'+safeTitle(title)+'-'+Date.now()+'.zip';
 await fsp.mkdir(exportsDir,{recursive:true});
 const save=await dialog.showSaveDialog(mainWindow,{
   title:'Enregistrer le site H5P autonome',
   defaultPath:path.join(exportsDir,filename),
   buttonLabel:'Enregistrer le ZIP',
   filters:[{name:'Archives ZIP',extensions:['zip']}],
   properties:['showOverwriteConfirmation']
 });
 if(save.canceled||!save.filePath)return {cancelled:true};
 const runtime=await player();
 const result=await exportStaticZip(input,runtime.dir,save.filePath);
 lastExport=result.path;
 return {...result,name:path.basename(result.path),reader:runtime.source};
});
ipcMain.handle('desktop:reveal-export',async(e)=>{
 checkCaller(e);
 if(!lastExport||!fs.existsSync(lastExport))return {ok:false};
 shell.showItemInFolder(lastExport);
 return {ok:true};
});
function createWindow(){
 mainWindow=new BrowserWindow({
  title:'H5P Studio Portable 0.3.4',width:1400,height:930,minWidth:920,minHeight:650,
  backgroundColor:'#f5f7fa',show:true,
  webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,
   preload:path.join(__dirname,'preload.cjs')}
 });
 mainWindow.removeMenu();
 mainWindow.loadFile(path.join(__dirname,'..','index.html')).catch(err=>{
  console.error('Impossible de charger l’interface',err);
  dialog.showErrorBox('H5P Studio : interface non chargée',String(err.message||err));
 });
 mainWindow.webContents.on('render-process-gone',(_event,details)=>{
  console.error('Processus de rendu interrompu :',details.reason);
 });
 mainWindow.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 mainWindow.webContents.on('will-navigate',e=>e.preventDefault());
 mainWindow.webContents.on('will-attach-webview',e=>e.preventDefault());
}
app.whenReady().then(async()=>{
 await fsp.mkdir(exportsDir,{recursive:true});
 // Fullscreen is the only permission permitted, and only for our active local preview.
 // All other web permissions remain denied (camera, microphone, geolocation, etc.).
 session.defaultSession.setPermissionRequestHandler((contents,permission,callback,details)=>{
  callback(fullscreenAllowed({permission,previewUrl:preview?.url,
   isAppWindow:!!mainWindow && contents===mainWindow.webContents,
   requestingUrl:details?.requestingUrl||''}));
 });
 session.defaultSession.setPermissionCheckHandler((contents,permission,requestingOrigin,details)=>
  fullscreenAllowed({permission,previewUrl:preview?.url,
   isAppWindow:!!mainWindow && contents===mainWindow.webContents,
   requestingUrl:details?.requestingUrl||requestingOrigin||''}));
 session.defaultSession.on('will-download',(event,item)=>{
  if(!/\.h5p$/i.test(item.getFilename())){event.preventDefault();return;}
  const name=path.basename(item.getFilename()).replace(/[^a-zA-Z0-9_.-]/g,'_').slice(0,130);
  item.setSavePath(path.join(exportsDir,Date.now()+'-'+name));
 });
 createWindow();
 app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
}).catch(e=>{console.error('Démarrage impossible',e);dialog.showErrorBox('H5P Studio : démarrage impossible',String(e.message||e));app.quit();});
app.on('before-quit',()=>{if(preview)preview.server.close();if(workdir)fsp.rm(workdir,{recursive:true,force:true}).catch(()=>{});});
app.on('window-all-closed',()=>app.quit());
