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

// Função para validar URLs de forma mais rigorosa
const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Bloquear protocolos perigosos
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Bloquear IPs privados e localhost em produção
    const hostname = urlObj.hostname;
    const privateIpRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|169\.254\.|::1|localhost|0\.0\.0\.0)$/;
    
    if (privateIpRegex.test(hostname) && self.location.hostname !== 'localhost') {
      return false;
    }
    
    // Bloquear portas perigosas
    const dangerousPorts = ['22', '23', '25', '53', '80', '110', '143', '993', '995'];
    if (urlObj.port && dangerousPorts.includes(urlObj.port)) {
      return false;
    }
    
    // Verificar se o origin está na lista permitida
    const isAllowedOrigin = ALLOWED_ORIGINS.some(origin => {
      try {
        const allowedUrl = new URL(origin);
        return allowedUrl.origin === urlObj.origin;
      } catch {
        return false;
      }
    });
    
    return isAllowedOrigin || urlObj.origin === self.location.origin;
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
  
  // Validar URL ANTES de qualquer processamento
  if (!isValidUrl(event.request.url)) {
    event.respondWith(new Response('Forbidden', { status: 403 }));
    return;
  }
  
  // Não cachear requests para API
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retornar do cache se disponível
        if (response) {
          return response;
        }
        
        // Criar request seguro com headers limitados
        const safeRequest = new Request(event.request.url, {
          method: 'GET',
          headers: {
            'Accept': event.request.headers.get('Accept') || '*/*',
            'Accept-Language': event.request.headers.get('Accept-Language') || 'en-US,en;q=0.9'
          },
          mode: 'cors',
          credentials: 'same-origin',
          cache: 'default'
        });
        
        // Fazer fetch com request seguro
        return fetch(safeRequest).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(safeRequest, responseToCache);
            });
          
          return response;
        }).catch(() => {
          return new Response('Network Error', { status: 503 });
        });
      })
  );
});