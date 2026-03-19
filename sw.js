// Service Worker для принудительной инвалидации кеша iOS
const CACHE_NAME = 'ktk-cache-v1-' + new Date().getTime(); 

// Установка: пропускаем ожидание, чтобы скрипт сразу взял контроль
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Активация: УДАЛЯЕМ ВСЕ старые кеши в телефоне
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('[SW] Удаляю старый кеш:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Запросы: всегда идем в сеть, запрещаем сохранять в кеш
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(() => {
      // Если сети нет, просто падаем, но не отдаем старье
      return new Response("Нет подключения к интернету.");
    })
  );
});
