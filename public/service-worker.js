self.addEventListener('install', function (e) {
  console.log('Service Worker: Installed');
});

self.addEventListener('activate', function (e) {
  console.log('Service Worker: Activated');
  e.waitUntil(
    caches.open('static').then(function (cache) {
      return cache.addAll([
        '/',
      ]);
    })
  );
});

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (response) {
      return response || fetch(e.request);
    })
  );
});
