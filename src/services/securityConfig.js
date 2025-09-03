// Configurações de segurança para a aplicação

// Configuração de Content Security Policy (CSP)
export const setupCSP = () => {
  // Implementar CSP mais restritiva
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.amplify.aws;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https://*.amazonaws.com;
    connect-src 'self' ${import.meta.env.VITE_API_URL || 'http://localhost:8000'} https://*.amazonaws.com wss://*.amazonaws.com;
    frame-ancestors 'none';
    form-action 'self';
    upgrade-insecure-requests;
    block-all-mixed-content;
  `;
  document.head.appendChild(meta);
  
  // Adicionar cabeçalhos de segurança adicionais
  addSecurityHeaders();
  
  // Configurar detecção de inatividade
  setupInactivityTimeout();
};

// Adicionar cabeçalhos de segurança via meta tags
const addSecurityHeaders = () => {
  const headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
  };
  
  Object.entries(headers).forEach(([header, value]) => {
    const meta = document.createElement('meta');
    meta.httpEquiv = header;
    meta.content = value;
    document.head.appendChild(meta);
  });
};

// Configurar timeout por inatividade (15 minutos)
export const setupInactivityTimeout = () => {
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; // 15 minutos
  let inactivityTimer;

  const resetTimer = () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      // Verificar se o usuário está logado antes de deslogar
      if (sessionStorage.getItem('isLoggedIn') === 'true') {
        clearSensitiveData();
        alert('Sua sessão expirou por inatividade. Por favor, faça login novamente.');
        window.location.href = '/login';
      }
    }, INACTIVITY_TIMEOUT);
  };

  // Eventos para resetar o timer
  ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });

  // Iniciar o timer
  resetTimer();
};

// Função aprimorada para sanitizar dados de entrada
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\\/g, '&#092;')
    .replace(/`/g, '&#096;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')
    .replace(/\[/g, '&#91;')
    .replace(/\]/g, '&#93;')
    .replace(/\(/g, '&#40;')
    .replace(/\)/g, '&#41;')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
    .replace(/\t/g, ' ')
    .trim()
    .substring(0, 1000); // Limitar tamanho
};

// Função para sanitizar logs especificamente
export const sanitizeLog = (input) => {
  if (typeof input !== 'string') return String(input);
  
  return input
    .replace(/[\r\n\t]/g, ' ') // Remover quebras de linha
    .replace(/[<>\"'`]/g, '_') // Substituir caracteres perigosos
    .replace(/\{.*\}/g, '[OBJECT]') // Remover objetos JSON
    .replace(/\[.*\]/g, '[ARRAY]') // Remover arrays
    .trim()
    .substring(0, 500); // Limitar tamanho do log
};

// Função para validar tokens JWT
export const validateJwtFormat = (token) => {
  if (!token) return false;
  
  // Verificar formato básico do JWT (três partes separadas por pontos)
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Verificar se cada parte é um base64 válido
  try {
    parts.forEach(part => {
      // Adicionar padding se necessário
      const paddedPart = part.padEnd(part.length + (4 - (part.length % 4)) % 4, '=');
      atob(paddedPart.replace(/-/g, '+').replace(/_/g, '/'));
    });
    return true;
  } catch (e) {
    return false;
  }
};

// Função para validar entrada de dados
export const validateInput = (input, type = 'text', maxLength = 255) => {
  if (!input || typeof input !== 'string') return false;
  
  // Verificar tamanho
  if (input.length > maxLength) return false;
  
  // Validações específicas por tipo
  switch (type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(input);
    
    case 'cpf':
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
      return cpfRegex.test(input);
    
    case 'phone':
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/;
      return phoneRegex.test(input);
    
    case 'name':
      const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
      return nameRegex.test(input) && input.length >= 2;
    
    default:
      // Verificar caracteres perigosos
      const dangerousChars = /<script|javascript:|data:|vbscript:|on\w+=/i;
      return !dangerousChars.test(input);
  }
};

// Função para limpar dados sensíveis
export const clearSensitiveData = () => {
  // Usar sessionStorage para dados sensíveis
  sessionStorage.removeItem('userId');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('rememberMe');
  sessionStorage.removeItem('csrf_token');
  sessionStorage.removeItem('isLoggedIn');
  
  // Limpar localStorage também por segurança
  localStorage.removeItem('username');
  localStorage.removeItem('lsRememberMe');
  
  // Limpar cookies relacionados à autenticação
  document.cookie.split(';').forEach(cookie => {
    const [name] = cookie.trim().split('=');
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=strict`;
  });
};

// Função para detectar tentativas de ataque
export const detectAttack = (input) => {
  if (typeof input !== 'string') return false;
  
  const attackPatterns = [
    /<script/i,
    /javascript:/i,
    /data:text\/html/i,
    /vbscript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /url\s*\(/i,
    /import\s*\(/i,
    /@import/i,
    /\bUNION\b.*\bSELECT\b/i,
    /\bSELECT\b.*\bFROM\b/i,
    /\bINSERT\b.*\bINTO\b/i,
    /\bDELETE\b.*\bFROM\b/i,
    /\bUPDATE\b.*\bSET\b/i,
    /\bDROP\b.*\bTABLE\b/i
  ];
  
  return attackPatterns.some(pattern => pattern.test(input));
};

// Configurações de segurança para requisições HTTP
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};