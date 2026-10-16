const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const photos={
 'kungpao.jpg':'https://cdn3.didevelop.com/public/product_images/5815/533_e8c2d091e79463193e4d50938d2c1f62.jpg',
 'tomato.jpg':'https://cook.zhouhao.cn/images/%E8%A5%BF%E7%BA%A2%E6%9F%BF%E7%82%92%E9%B8%A1%E8%9B%8B%E7%9B%96%E9%A5%AD.jpeg',
 'salad.jpg':'https://www.wugusala.com/uploads/allimg/211008/091S03I0-0.jpg',
 'noodles.jpg':'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=85',
 'pepper.jpg':'https://tb-static.uber.com/prod/image-proc/processed_images/e4e8733db1abcfc557a60575be4e6fd3/f47cec1eac1d3b43eccf2318d065819a.jpeg',
 'minibowls.jpg':'https://tb-static.uber.com/prod/image-proc/processed_images/148b36fc57cd08bdddab621d36f6a7e7/70aa2a4db7f990373ca9c376323e3dea.jpeg',
 'braised.jpg':'https://yehheardithere.com/wp-content/uploads/2021/11/b633ae76-f2b4-47d2-bb3b-b7acbd863eb8.jpg?w=1024'
};
fs.mkdirSync(path.join(root,'assets','icons'),{recursive:true});
for(const name of ['style.css','Phosphor.woff2'])fs.copyFileSync(path.join(root,'node_modules','@phosphor-icons','web','src','regular',name),path.join(root,'assets','icons',name));
fs.copyFileSync(path.join(root,'node_modules','@phosphor-icons','web','LICENSE'),path.join(root,'assets','icons','LICENSE'));
const {execFile}=require('node:child_process');
Promise.allSettled(Object.entries(photos).map(([name,url])=>new Promise((resolve,reject)=>{const output=path.join(root,'assets',name);execFile('curl.exe',['-f','-L','--silent','--show-error','--connect-timeout','12','--max-time','35','--retry','1',url,'-o',output],(e)=>{if(e)return reject(e);console.log(`${name}: ${fs.statSync(output).size} bytes`);resolve();});}))).then(results=>{results.forEach((r,i)=>{if(r.status==='rejected'){console.error(Object.keys(photos)[i],r.reason.message);process.exitCode=1;}})});
