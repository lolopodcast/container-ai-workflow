// Service worker: stale-while-revalidate.
//
// Strategy: on every GET request, respond from cache immediately if a cached
// copy exists (fast, and works with no network at all), while *also*
// fetching from the network in the background to refresh the cache for next
// time. If there's no cached copy yet, fall through to the network.
//
// EDIT BEFORE EVERY DEPLOY THAT CHANGES A PRECACHED FILE:
//   Bump CACHE_NAME's version suffix (v1 -> v2 -> v3 ...). See the big
//   comment at the bottom for why this is not optional.

const CACHE_NAME = 'caiw-shell-v1';
const APP_SHELL = [
  './',
  './index.html',
  './CONTAINER_AI_WORKFLOW_SPA.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && (res.status === 200 || res.type === 'opaque')) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

// -----------------------------------------------------------------------
// WHY THE VERSION SUFFIX ON CACHE_NAME MATTERS
// -----------------------------------------------------------------------
// stale-while-revalidate always answers from the cache *first*. Nothing in
// the fetch handler ever invalidates a cached file just because its content
// on the server changed -- the only thing that clears out old cached files
// is the `activate` handler above deleting caches whose *name* no longer
// matches CACHE_NAME. So every future deploy that edits index.html,
// CONTAINER_AI_WORKFLOW_SPA.html, manifest.json, or any icon MUST bump the
// version suffix here (v1 -> v2), or returning visitors keep seeing the old
// cached version indefinitely with nothing in the console to explain why.
