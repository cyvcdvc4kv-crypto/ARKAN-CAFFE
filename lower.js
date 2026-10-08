const fs=require('fs'),esb=require('esbuild');
const f='www/index.html',src=fs.readFileSync(f,'utf8'),m=src.match(/<script>([\s\S]*)<\/script>/);
if(!m)throw new Error('script not found');
const out=esb.transformSync(m[1],{target:'chrome58'}).code;
fs.writeFileSync(f,src.replace(m[1],()=>out));
console.log('lowered JS for old WebView:',m[1].length,'->',out.length);
