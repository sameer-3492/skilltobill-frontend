// Service Worker for PWA
const CACHE_NAME = 'skilltobill-v1';
const urlsToCache = [
  '/',
  '/home.html',
  '/signup-login.html',
  '/css/style.css',
  '/css/home.css',
  '/js/main.js',
  '/js/home.js',
  '/js/signup.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// ------------------------
// Fetch Handler
// ------------------------
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Backend requests (force HTTPS + CORS)
  if (url.origin === 'http://skilltobill-backend.onrender.com' || url.origin === 'https://skilltobill-backend.onrender.com') {
    const newRequest = new Request(
      event.request.url.replace('http://skilltobill-backend.onrender.com:5000', 'https://skilltobill-backend.onrender.com'),
      {
        method: event.request.method,
        headers: event.request.headers,
        body: event.request.body,
        mode: 'cors',
        credentials: 'include'
      }
    );

    event.respondWith(
      fetch(newRequest).catch(err => {
        console.error('Backend fetch failed:', err);
        return new Response('Service Unavailable', { status: 503 });
      })
    );
    return;
  }

  // Static asset caching
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
