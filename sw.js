const CACHE_NAME = 'ibrasoft-erp-v1';
// قائمة الملفات التي سيتم حفظها في ذاكرة الهاتف لتعمل بدون إنترنت
const ASSETS_TO_CACHE = [
  './',
  './IBraSoft_ERP.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. تثبيت الـ Service Worker وحفظ الملفات
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('IbraSoft ERP: تم حفظ ملفات النظام في الكاش بنجاح');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. تفعيل الـ Service Worker وتحديث الكاش القديم إن وجد
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('IbraSoft ERP: جاري تنظيف الكاش القديم');
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. جلب الملفات من الكاش عند انقطاع الإنترنت
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // إذا وجد الملف في الكاش، افتحه مباشرة، وإلا اجلبه من الإنترنت
        return response || fetch(event.request);
      }).catch(() => {
        // حل احتياطي في حال فشل كل شيء وكان المستخدم أوفلاين تماماً
        if (event.request.mode === 'navigate') {
          return caches.match('./IBraSoft_ERP.html');
        }
      })
  );
});
