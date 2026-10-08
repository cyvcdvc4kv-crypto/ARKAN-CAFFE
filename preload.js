const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('omc',{
  getPrinters:()=>ipcRenderer.invoke('printers'),
  print:o=>ipcRenderer.invoke('print',o),
  lan:o=>ipcRenderer.invoke('lan',o)
});
