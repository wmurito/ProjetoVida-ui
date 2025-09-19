const CACHE_NAME = 'projeto-vida-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Lista de domínios permitidos
const ALLOWED_ORIGINS = [
  self.location.origin,
  'https://your-api-domain.com'
];

// Função para validar URLs
const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Bloquear IPs privados e localhost em produção
    const hostname = urlObj.hostname;
    const privateIpRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|169\.254\.|::1|localhost)$/;
    
    if (privateIpRegex.test(hostname) && self.location.hostname !== 'localhost') {
      return false;
    }
    
    // Verificar se o origin está na lista permitida
    return ALLOWED_ORIGINS.includes(urlObj.origin) || urlObj.origin === self.location.origin;
  } catch (e) {
    return false;
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Apenas cachear requests GET
  if (event.request.method !== 'GET') return;
  
  // Não cachear requests para API
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retornar do cache se disponível
        if (response) {
          return response;
        }
        
        // Validar URL antes do fetch
        if (!isValidUrl(event.request.url)) {
          return new Response('Forbidden', { status: 403 });
        }
        
        // Fazer fetch e cachear a resposta
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
  );
});