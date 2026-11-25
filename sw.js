// Offline cache for fcknggn. Bump VERSION when files change.
const VERSION="fcknggn-v11";
const ASSETS=["./", "index.html","img/sex.gif","img/ovulation.gif","img/rooster.webp","img/egg.webp", "privacy.html", "manifest.webmanifest", "img/apathy.webp", "img/daisy.webp", "img/feathers.webp", "img/fur-orig.webp", "img/fur.webp", "img/happy.webp", "img/hen-poster.jpg", "img/hen.webp", "img/hills.webp", "img/hyst.webp", "img/i-daisy.png", "img/i-hen.png", "img/joy.webp", "img/lime.webp", "img/logo.png", "img/sad.webp", "img/tears.webp", "img/tired.webp", "img/vamp.webp", "icons/apple-touch-icon-v2.png", "icons/favicon-v2.png", "icons/icon-192-v2.png", "icons/icon-512-v2.png", "icons/icon-maskable-512-v2.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION&&k!=="fcknggn-fonts").map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.pathname.endsWith(".mp4"))return; // video streams straight from the network
  if(url.hostname==="fonts.googleapis.com"||url.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open("fcknggn-fonts").then(c=>c.match(req).then(hit=>hit||fetch(req).then(r=>{c.put(req,r.clone());return r;}))));return;
  }
  if(url.origin!==location.origin)return;
  if(req.mode==="navigate"){
    e.respondWith(fetch(req.url,{cache:"no-cache",credentials:"same-origin"}).then(r=>{if(r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp));}return r;}).catch(()=>caches.match(req,{ignoreSearch:true}).then(h=>h||caches.match("index.html"))));return;
  }
  e.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp));}return r;})));
});
