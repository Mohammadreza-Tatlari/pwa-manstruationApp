
//it is convinient to update version for better work flow can other devs
const VERSION = "v1";

const CACHE_NAME = `period-tracker${VERSION}`;

//static resources
const APP_STATIC_RESOURCES = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/cycletrack.json",
  "/icons/wheel.svg",
];

//on install, cahce the static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

// delete old caches on activation
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
      await clients.claim();
    })(),
  );
});

//on fetch, intercept server request
// and respond with cached response instead of going to network
self.addEventListener("fetch" , (event) => {
    //when seeking for a Page
    if(event.request.mode === "navigate") {
        //return to the index.html
        event.respondWith(caches.match("/"));
        return;
    }

    //for every other request
    event.respondWith(
        ( async () => {
            const cache = await caches.open(CACHE_NAME)
            const cachedResponse = await cache.match(event.request.url);
            if(cachedResponse) {
                //return the cached response if it's available 
                return cachedResponse;
            }
            //response with 404
            else{
              console.log("navigator function failed");
            return new Response(null , {status: 404})
          }
          })(),
    );
});


