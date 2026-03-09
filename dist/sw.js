const CACHE_NAME = 'projeto-vida-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Lista de domínios permitidos - configurar via variáveis de ambiente
const ALLOWED_ORIGINS = [
  self.location.origin
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
        
        // Validação adicional de URL antes do fetch
        const requestUrl = new URL(event.request.url);
        if (!ALLOWED_ORIGINS.some(origin => requestUrl.origin === origin)) {
          return new Response('Forbidden Origin', { status: 403 });
        }
        
        // Criar request seguro com headers limitados
        const requestHeaders = new Headers();
        const acceptHeader = event.request.headers.get('Accept');
        const acceptLangHeader = event.request.headers.get('Accept-Language');
        
        if (acceptHeader) requestHeaders.set('Accept', acceptHeader);
        if (acceptLangHeader) requestHeaders.set('Accept-Language', acceptLangHeader);
        
        const getRequestConfig = () => ({
          method: 'GET',
          headers: requestHeaders,
          mode: self.FETCH_MODE || 'cors',
          credentials: self.FETCH_CREDENTIALS || 'same-origin',
          cache: self.FETCH_CACHE || 'default'
        });
        
        const requestConfig = getRequestConfig();
        
        // Validação final antes do fetch
        if (!isValidUrl(event.request.url)) {
          return new Response('Invalid URL', { status: 403 });
        }
        
        const safeRequest = new Request(event.request.url, requestConfig);
        
        // Fazer fetch com request seguro e timeout
        const fetchWithTimeout = (request, timeout = 5000) => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);
          
          return fetch(request, { signal: controller.signal })
            .finally(() => clearTimeout(timeoutId));
        };
        
        return fetchWithTimeout(safeRequest).then((response) => {
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