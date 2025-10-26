// Configurações de segurança para produção
export const PRODUCTION_SECURITY_CONFIG = {
  // Headers de segurança obrigatórios
  REQUIRED_HEADERS: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
  },

  // CSP mais restritiva para produção com nonces
  CSP_POLICY: `
    default-src 'self';
    script-src 'self' 'nonce-${typeof window !== 'undefined' && window.__CSP_NONCE__ || 'fallback'}' https://cdn.amplify.aws;
    style-src 'self' 'nonce-${typeof window !== 'undefined' && window.__CSP_NONCE__ || 'fallback'}' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https://*.amazonaws.com;
    connect-src 'self' https://pteq15e8a6.execute-api.us-east-1.amazonaws.com https://*.amazonaws.com wss://*.amazonaws.com;
    frame-ancestors 'none';
    form-action 'self';
    upgrade-insecure-requests;
    block-all-mixed-content;
  `.replace(/\s+/g, ' ').trim(),

  // Rate limits mais restritivos
  RATE_LIMITS: {
    LOGIN_ATTEMPTS: 3,
    API_REQUESTS_PER_MINUTE: 60,
    FORM_SUBMISSIONS_PER_HOUR: 10
  },

  // Timeouts de segurança
  TIMEOUTS: {
    SESSION: 10 * 60 * 1000, // 10 minutos
    CSRF_TOKEN: 30 * 60 * 1000, // 30 minutos
    INACTIVITY: 8 * 60 * 1000 // 8 minutos
  }
};