import { securityLogger } from './securityLogger';

// CSRF Protection
class CSRFProtection {
  constructor() {
    this.token = null;
    this.tokenName = import.meta.env.VITE_CSRF_TOKEN_NAME || 'X-CSRF-Token';
  }

  // Gerar token CSRF
  generateToken() {
    const array = new Uint8Array(32);
    // amazonq-ignore-next-line
    crypto.getRandomValues(array);
    this.token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Armazenar no sessionStorage
    sessionStorage.setItem('csrf_token', this.token);
    return this.token;
  }

  // Obter token atual
  getToken() {
    if (!this.token) {
      this.token = sessionStorage.getItem('csrf_token') || this.generateToken();
    }
    return this.token;
  }

  // Validar token com comparação time-safe
  validateToken(receivedToken) {
    const currentToken = this.getToken();
    
    if (!currentToken || !receivedToken) {
      securityLogger.logCSRFValidation(false, !!receivedToken);
      return false;
    }
    
    // Usar comparação time-safe para prevenir timing attacks
    const isValid = this.timingSafeEqual(currentToken, receivedToken);
    securityLogger.logCSRFValidation(isValid, true);
    
    return isValid;
  }
  
  // Comparação time-safe para strings
  timingSafeEqual(a, b) {
    // amazonq-ignore-next-line
    if (a.length !== b.length) {
      return false;
    }
    
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }

  // Adicionar token aos headers
  addTokenToHeaders(headers = {}) {
    return {
      ...headers,
      [this.tokenName]: this.getToken()
    };
  }

  // Limpar token
  clearToken() {
    this.token = null;
    sessionStorage.removeItem('csrf_token');
  }
}

export const csrfProtection = new CSRFProtection();