const CACHE='dcp-v2';
self.addEventListener('install',e=>{ self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html'])).catch(()=>{})); });
self.addEventListener('activate',e=>{ e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.map(k=>k===CACHE?null:caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  if(r.mode==='navigate'){
    e.respondWith(
      fetch(r).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put('./index.html',cp)); return res; })
              .catch(()=> caches.match('./index.html').then(x=> x || caches.match('./'))) );
    return;
  }
  e.respondWith( caches.match(r).then(hit=> hit || fetch(r)) );
});
