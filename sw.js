const images = Array.from(new Array(12), (val, idx) => `images/${idx}.png`);
const fundamentals = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/index.js',
  '/sw.js'
];

const offlineFundamentals = fundamentals.concat(images);
const CACHE_NAME = 'canvasQuestion';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(offlineFundamentals))
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [`${CACHE_NAME}_v2`];
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => cacheWhitelist.indexOf(key) === -1)
        .map((key) => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((matchResp) => {
        if (matchResp) {
          return matchResp;
        }

        const fetchRequest = event.request.clone();
        return fetch(fetchRequest).then((resp) => {
          if (!resp || resp.status !== 200 || resp.type !== 'basic') {
            return resp;
          }

          const responseToCache = resp.clone();
          caches.open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache));
          return resp;
        });
      })
  );
});
