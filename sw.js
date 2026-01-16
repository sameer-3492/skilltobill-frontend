// Service Worker for PWA
const CACHE_NAME = 'skilltobill-v1';
const urlsToCache = [
  '/',
  '/home.html',
  '/css/style.css',
  '/css/home.css',
  '/js/main.js',
  '/js/home.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});