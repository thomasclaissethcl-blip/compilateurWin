'use strict';
const {contextBridge,ipcRenderer}=require('electron');
if(process.isMainFrame){
 contextBridge.exposeInMainWorld('studioDesktop',Object.freeze({
  isDesktop:true,
  info:()=>ipcRenderer.invoke('desktop:status'),
  preview:bytes=>ipcRenderer.invoke('desktop:preview',bytes),
  export:(bytes,title)=>ipcRenderer.invoke('desktop:export',bytes,title),
  importPlayer:()=>ipcRenderer.invoke('desktop:import-player'),
  revealExport:()=>ipcRenderer.invoke('desktop:reveal-export')
 }));
}
