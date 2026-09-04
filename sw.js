const CACHE_NAME = 'fazakker-v2.1.0';
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
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
