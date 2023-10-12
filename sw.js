const VERSION = "v1";

const CACHE_NAME = `period-tracker${VERSION}`

self.addEventListener("install" , (event) => {
    event.waitUntill(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll(APP_STATIC_RESOURCES)
        })(),
    );
});

const APP_STATIC_RESOURCES = [
    "/",
    "/index.html",
    "/style.css",
    "/app.js",
    "/cycletrack.json",
    "/icons/wheel.svg"
]