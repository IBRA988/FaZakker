const CACHE_NAME = 'fazakker-v3.0.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './prayers.html',
  './quran.html',
  './azkar.html',
  './assets/css/main.css',
  './assets/css/prayers.css',
  './assets/css/quran.css',
  './assets/css/azkar.css',
  './assets/js/common.js',
  './assets/js/prayers.js',
  './assets/js/quran.js',
  './assets/js/azkar.js',
  './assets/images/favicon/favicon.ico',
  './assets/images/favicon/android-chrome-192x192.png',
  './assets/images/favicon/android-chrome-512x512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Network-first strategy for dynamic asset updates
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
