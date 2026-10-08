const {app,BrowserWindow,Menu,ipcMain}=require('electron');
const path=require('path'),net=require('net');
let win;
function create(){
  Menu.setApplicationMenu(null);
  win=new BrowserWindow({width:1280,height:800,autoHideMenuBar:true,icon:path.join(__dirname,'../build/icon.ico'),
    webPreferences:{preload:path.join(__dirname,'preload.js'),contextIsolation:true}});
  win.maximize();
  win.loadFile(path.join(__dirname,'../www/index.html'));
}
ipcMain.handle('printers',()=>win.webContents.getPrintersAsync());
ipcMain.handle('print',(e,o)=>new Promise((res,rej)=>{
  const pw=new BrowserWindow({show:false});
  pw.loadURL('data:text/html;charset=utf-8,'+encodeURIComponent(o.html));
  pw.webContents.on('did-finish-load',()=>{
    pw.webContents.print({silent:!!o.name,deviceName:o.name||undefined,printBackground:true,margins:{marginType:'none'}},(ok,err)=>{pw.close();ok?res(true):rej(new Error(err||'print failed'))});
  });
}));
ipcMain.handle('lan',(e,o)=>new Promise((res,rej)=>{
  const s=net.connect({host:o.ip,port:o.port||9100},()=>{s.write(Buffer.from(o.bytes),()=>{s.end();res(true)})});
  s.setTimeout(6000,()=>{s.destroy();rej(new Error('انتهت مهلة الاتصال بالطابعة'))});
  s.on('error',rej);
}));
app.whenReady().then(create);
app.on('window-all-closed',()=>app.quit());
