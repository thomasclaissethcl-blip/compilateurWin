'use strict';
const {app,BrowserWindow,ipcMain,dialog,session}=require('electron');
const fs=require('node:fs');const fsp=fs.promises;const path=require('node:path');const os=require('node:os');const crypto=require('node:crypto');
const {ensureRuntime,adoptLocalPlayer,PLAYER_VERSION}=require('../runtime/player-manager.cjs');
const {extractPreview,exportStaticZip,startPreviewServer}=require('../runtime/studio-site.cjs');
const APP_VERSION='0.3.0';
const portableRoot=process.env.PORTABLE_EXECUTABLE_DIR || path.resolve(__dirname,'..');
const profilePath=path.join(portableRoot,'data','electron-profile');
try{fs.mkdirSync(profilePath,{recursive:true});app.setPath('userData',profilePath)}
catch(e){console.error('Profil portable indisponible : '+e.message)}
app.setAppUserModelId('local.h5pstudio.portable');
let mainWindow=null, preview=null, workdir=null, playerPromise=null;
const cacheDir=path.join(portableRoot,'data','runtime','standalone',PLAYER_VERSION);
const bundledDir=app.isPackaged?path.join(process.resourcesPath,'reader',PLAYER_VERSION):path.join(portableRoot,'runtime-bundled',PLAYER_VERSION);
const exportsDir=path.join(portableRoot,'exports');
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
 const runtime=await player();
 await fsp.mkdir(exportsDir,{recursive:true});
 const filename='h5p-site-'+safeTitle(title)+'-'+Date.now()+'.zip';
 const result=await exportStaticZip(input,runtime.dir,path.join(exportsDir,filename));
 return {...result,name:filename,reader:runtime.source};
});
function createWindow(){
 mainWindow=new BrowserWindow({
  title:'H5P Studio Portable 0.3.0',width:1400,height:930,minWidth:920,minHeight:650,
  backgroundColor:'#f5f7fa',show:false,
  webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,
   preload:path.join(__dirname,'preload.cjs')}
 });
 mainWindow.removeMenu();
 mainWindow.loadFile(path.join(__dirname,'..','index.html'));
 mainWindow.once('ready-to-show',()=>mainWindow.show());
 mainWindow.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 mainWindow.webContents.on('will-navigate',e=>e.preventDefault());
 mainWindow.webContents.on('will-attach-webview',e=>e.preventDefault());
}
app.whenReady().then(async()=>{
 await fsp.mkdir(exportsDir,{recursive:true});
 session.defaultSession.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
 session.defaultSession.setPermissionCheckHandler(()=>false);
 session.defaultSession.on('will-download',(event,item)=>{
  if(!/\.h5p$/i.test(item.getFilename())){event.preventDefault();return;}
  const name=path.basename(item.getFilename()).replace(/[^a-zA-Z0-9_.-]/g,'_').slice(0,130);
  item.setSavePath(path.join(exportsDir,Date.now()+'-'+name));
 });
 createWindow();
 app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});
});
app.on('before-quit',()=>{if(preview)preview.server.close();if(workdir)fsp.rm(workdir,{recursive:true,force:true}).catch(()=>{});});
app.on('window-all-closed',()=>app.quit());
