const CACHE_NAME = "shapewear-v3";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/js/app.js",
  "/data/products.js",
  "/images/favicon-32.png",
  "/images/theshapewear-favicon.png",
  "/images/theshapewear.png",
];

// Install - pre-cache static assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch - cache-first for images/fonts, network-first for HTML/JS
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Cache-first for CDN images (Shopify, Google Fonts, BLS)
  if (
    url.hostname.includes("cdn.shopify.com") ||
    url.hostname.includes("bls.uk.com") ||
    url.hostname.includes("fonts.gstatic.com") ||
    url.hostname.includes("fonts.googleapis.com")
  ) {
    e.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(e.request).then(
          (cached) =>
            cached ||
            fetch(e.request).then((res) => {
              if (res.ok) cache.put(e.request, res.clone());
              return res;
            })
        )
      )
    );
    return;
  }

  // Stale-while-revalidate for local assets
  if (url.origin === location.origin) {
    e.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(e.request).then((cached) => {
          const fetched = fetch(e.request).then((res) => {
            if (res.ok) cache.put(e.request, res.clone());
            return res;
          });
          return cached || fetched;
        })
      )
    );
    return;
  }
});
