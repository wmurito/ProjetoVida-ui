/**
 * Configurações de Segurança Centralizadas
 */

// Content Security Policy
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.amplify.aws'],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", import.meta.env.VITE_API_BASE_URL],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"]
};

// Security Headers
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
};

// Rate Limiting
export const RATE_LIMIT_CONFIG = {
  maxRequests: 100,
  windowMs: 60000, // 1 minuto
  blockDuration: 300000 // 5 minutos
};

// Input Validation
export const VALIDATION_PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s\-()]{10,}$/,
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  name: /^[a-zA-ZÀ-ÿ\s]{2,100}$/,
  alphanumeric: /^[a-zA-Z0-9]+$/
};

// Sanitização
export const DANGEROUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /eval\(/gi,
  /expression\(/gi
];

// Timeout de sessão (15 minutos)
export const SESSION_TIMEOUT = 15 * 60 * 1000;

// Máximo de tentativas de login
export const MAX_LOGIN_ATTEMPTS = 5;

// Domínios permitidos para CORS
export const ALLOWED_ORIGINS = [
  'https://master.d1yi28nqqe44f2.amplifyapp.com',
  import.meta.env.VITE_API_BASE_URL
].filter(Boolean);
