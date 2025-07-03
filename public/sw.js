// A basic service worker for PWA functionality

self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
});

self.addEventListener('fetch', (event) => {
  // We are not implementing any caching strategy here for now.
  // This is just to make the app installable.
  event.respondWith(fetch(event.request));
});
