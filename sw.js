// Service Worker — Foro 7 · barbara-brittany
const IMAGE_CACHE = 'foro7-barbara-images-v1';
const APP_CACHE   = 'foro7-barbara-app-v1';

// Cache-first para imágenes: sirve desde caché, descarga si no está
async function cacheFirstImage(request) {
    const cache  = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
}

// Network-first para HTML/JS/CSS: siempre intenta red, cae a caché si falla
async function networkFirst(request) {
    const cache = await caches.open(APP_CACHE);
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch {
        const cached = await cache.match(request);
        return cached || new Response('Sin conexión', { status: 503 });
    }
}

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Solo manejar requests del mismo origen
    if (url.origin !== self.location.origin) return;

    const path = url.pathname;

    if (path.includes('/images/') || path.includes('/fotos/')) {
        event.respondWith(cacheFirstImage(event.request));
    } else {
        event.respondWith(networkFirst(event.request));
    }
});

// Al activar: limpiar cachés viejos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(k => k !== IMAGE_CACHE && k !== APP_CACHE)
                    .map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});
