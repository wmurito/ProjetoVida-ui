// Configurações de segurança para a aplicação

// Configuração de Content Security Policy (CSP)
export const setupCSP = () => {
  // Implementar CSP para produção
  if (import.meta.env.PROD) {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self';
      script-src 'self' https://cdn.amplify.aws;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      img-src 'self' data: https://*.amazonaws.com;
      connect-src 'self' ${import.meta.env.VITE_API_URL} https://*.amazonaws.com;
    `;
    document.head.appendChild(meta);
  }
};

// Função para sanitizar dados de entrada
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

// Função para limpar dados sensíveis
export const clearSensitiveData = () => {
  sessionStorage.removeItem('userId');
  localStorage.removeItem('username');
  localStorage.removeItem('lsRememberMe');
};

// Configurações de segurança para requisições HTTP
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};