import { securityLogger } from './securityLogger';

// Rate Limiter para prevenir ataques de força bruta
class RateLimiter {
  constructor() {
    this.attempts = new Map();
    this.blockedIPs = new Set();
  }

  // Verificar se IP está bloqueado
  isBlocked(identifier = 'default') {
    const safeIdentifier = this.sanitizeIdentifier(identifier);
    return this.blockedIPs.has(safeIdentifier);
  }

  // Registrar tentativa
  recordAttempt(identifier = 'default', maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    // Sanitizar identifier para prevenir code injection
    const safeIdentifier = this.sanitizeIdentifier(identifier);
    
    if (this.isBlocked(safeIdentifier)) {
      return false;
    }

    const now = Date.now();
    const attempts = this.attempts.get(safeIdentifier) || [];
    
    // Remover tentativas antigas
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    // Adicionar nova tentativa
    validAttempts.push(now);
    this.attempts.set(safeIdentifier, validAttempts);

    // Verificar se excedeu o limite
    if (validAttempts.length >= maxAttempts) {
      this.blockedIPs.add(safeIdentifier);
      
      // Log do bloqueio
      securityLogger.logRateLimitBlock(safeIdentifier, validAttempts.length);
      
      // Usar WeakRef para evitar code injection
      const cleanupRef = new WeakRef(this);
      setTimeout(() => {
        const limiter = cleanupRef.deref();
        if (limiter) {
          limiter.blockedIPs.delete(safeIdentifier);
          limiter.attempts.delete(safeIdentifier);
        }
      }, 60 * 60 * 1000);
      
      return false;
    }

    return true;
  }

  // Sanitizar identifier para prevenir ataques
  sanitizeIdentifier(identifier) {
    if (typeof identifier !== 'string') {
      return 'invalid';
    }
    
    // Permitir apenas caracteres alfanuméricos, hífens e underscores
    return identifier.replace(/[^a-zA-Z0-9\-_]/g, '').substring(0, 50) || 'default';
  }

  // Limpar tentativas bem-sucedidas
  clearAttempts(identifier = 'default') {
    const safeIdentifier = this.sanitizeIdentifier(identifier);
    this.attempts.delete(safeIdentifier);
  }
}

export const rateLimiter = new RateLimiter();