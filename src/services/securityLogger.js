import { sanitizeLog } from './securityConfig';

// Logger de segurança para monitoramento
class SecurityLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  // Log de tentativa de ataque
  logAttackAttempt(type, details, severity = 'medium') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'ATTACK_ATTEMPT',
      attackType: sanitizeLog(type),
      details: sanitizeLog(JSON.stringify(details)),
      severity,
      userAgent: sanitizeLog(navigator.userAgent),
      url: sanitizeLog(window.location.href)
    };

    this.addLog(logEntry);
    
    // Log crítico no console
    if (severity === 'critical') {
      console.error('SECURITY ALERT:', logEntry);
    }
  }

  // Log de bloqueio por rate limiting
  logRateLimitBlock(identifier, attempts) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'RATE_LIMIT_BLOCK',
      identifier: sanitizeLog(identifier),
      attempts: Number(attempts),
      severity: 'high'
    };

    this.addLog(logEntry);
    console.warn('Rate limit exceeded:', logEntry);
  }

  // Log de validação CSRF
  logCSRFValidation(success, token) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'CSRF_VALIDATION',
      success: Boolean(success),
      tokenPresent: Boolean(token),
      severity: success ? 'low' : 'high'
    };

    this.addLog(logEntry);
    
    if (!success) {
      console.warn('CSRF validation failed:', logEntry);
    }
  }

  // Adicionar log à lista
  addLog(logEntry) {
    this.logs.push(logEntry);
    
    // Manter apenas os últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  // Obter logs por tipo
  getLogsByType(type) {
    return this.logs.filter(log => log.type === type);
  }

  // Obter logs por severidade
  getLogsBySeverity(severity) {
    return this.logs.filter(log => log.severity === severity);
  }

  // Exportar logs para análise
  exportLogs() {
    return {
      timestamp: new Date().toISOString(),
      totalLogs: this.logs.length,
      logs: this.logs
    };
  }

  // Limpar logs antigos
  clearOldLogs(hoursOld = 24) {
    const cutoffTime = new Date(Date.now() - (hoursOld * 60 * 60 * 1000));
    this.logs = this.logs.filter(log => new Date(log.timestamp) > cutoffTime);
  }
}

export const securityLogger = new SecurityLogger();