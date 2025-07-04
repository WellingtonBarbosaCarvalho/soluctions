/**
 * Service Worker para Soluctions S.A
 * Cache inteligente para melhor performance
 */

const CACHE_NAME = "soluctions-v1.2";
const CRITICAL_RESOURCES = [
  "/",
  "/index.html",
  "/css/main.css",
  "/css/mobile.css",
  "/js/main.js",
  "/js/combined.min.js",
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;800&family=Rajdhani:wght@400;600&display=swap",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
];

// Install event - cache recursos críticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(CRITICAL_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

// Activate event - limpar caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch event - estratégia cache-first para recursos estáticos
self.addEventListener("fetch", (event) => {
  if (event.request.destination === "image") {
    // Cache-first para imagens
    event.respondWith(
      caches.match(event.request).then(
        (response) =>
          response ||
          fetch(event.request).then((fetchResponse) => {
            const responseClone = fetchResponse.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseClone));
            return fetchResponse;
          })
      )
    );
  } else if (
    CRITICAL_RESOURCES.some((resource) => event.request.url.includes(resource))
  ) {
    // Cache-first para recursos críticos
    event.respondWith(
      caches
        .match(event.request)
        .then((response) => response || fetch(event.request))
    );
  } else {
    // Network-first para outros recursos
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
});
