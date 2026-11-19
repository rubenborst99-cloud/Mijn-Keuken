const V="keuken-v2";
self.addEventListener("install",e=>{self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET")return;const u=new URL(q.url);
 const ok=u.origin===location.origin||u.hostname==="cdn.jsdelivr.net";if(!ok)return;
 // eerst netwerk (altijd de nieuwste versie), zonder bereik de bewaarde kopie
 e.respondWith(fetch(q).then(r=>{if(r&&r.status===200){const c=r.clone();caches.open(V).then(x=>x.put(q,c))}return r}).catch(()=>caches.match(q,{ignoreSearch:true}).then(m=>m||(q.mode==="navigate"?caches.match("./"):undefined))))});
// pushmeldingen
self.addEventListener("push",e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data?e.data.text():""}}
 e.waitUntil(self.registration.showNotification(d.title||"KookBuddy",{body:d.body||"",icon:"icon-192.png",badge:"icon-192.png",tag:d.tag||undefined,data:{url:d.url||"./"}}))});
self.addEventListener("notificationclick",e=>{e.notification.close();const url=new URL((e.notification.data&&e.notification.data.url)||"./",self.registration.scope).href;
 e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(cs=>{for(const c of cs){if(c.url.startsWith(self.registration.scope)&&"focus" in c){return c.focus().then(w=>(w||c).navigate?(w||c).navigate(url):null)}}return self.clients.openWindow(url)}))});
