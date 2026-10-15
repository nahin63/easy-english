const C="easy-english-v24",F=["index.html","manifest.json","icon-192.png","icon-512.png"];
const clean=async res=>{if(!res||!res.ok||!res.redirected)return res;const b=await res.clone().blob();return new Response(b,{status:200,statusText:"OK",headers:res.headers})};
const putShell=async(c,res)=>{const r=await clean(res);await c.put("index.html",r.clone());await c.put("./",r.clone())};
self.addEventListener("install",e=>{e.waitUntil((async()=>{const c=await caches.open(C);
 try{const r=await fetch(new Request("index.html",{cache:"reload"}));if(r&&r.ok)await putShell(c,r)}catch(_){try{const r=await fetch(new Request("./",{cache:"reload"}));if(r&&r.ok)await putShell(c,r)}catch(__){}}
 await Promise.all(F.slice(1).map(async u=>{try{const r=await fetch(new Request(u,{cache:"reload"}));if(r&&r.ok)await c.put(u,await clean(r))}catch(_){}}));
 self.skipWaiting()})())});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);if(u.origin!==location.origin)return;
 e.respondWith((async()=>{const c=await caches.open(C);
  if(r.mode==="navigate"){
   const shell=(await c.match("index.html"))||(await c.match("./"));
   const net=fetch(r).then(async res=>{if(res&&res.ok)await putShell(c,res.clone());return res}).catch(()=>null);
   if(shell){e.waitUntil(net);return shell}
   const res=await net;if(res)return res;
   return new Response("<meta name=viewport content='width=device-width'><body style='font-family:sans-serif;padding:24px'><h3>Easy English</h3><p>প্রথমবার একবার ইন্টারনেট দিয়ে অ্যাপটি খুলুন, তারপর থেকে ইন্টারনেট ছাড়াই চলবে।</p>",{headers:{"Content-Type":"text/html;charset=utf-8"}})}
  const m=await c.match(r,{ignoreSearch:true});
  const net=fetch(r).then(async res=>{if(res&&res.ok)await c.put(r,(await clean(res.clone())).clone());return res}).catch(()=>null);
  if(m){e.waitUntil(net);return m}
  return (await net)||new Response("",{status:504})})())});
