/**
 * Utilitários para sanitização de dados antes de logs
 */

/**
 * Sanitiza entrada para logs prevenindo log injection
 * @param {any} input - Entrada a ser sanitizada
 * @returns {string} - String sanitizada
 */
export const sanitizeForLog = (input) => {
  if (input === null || input === undefined) {
    return 'null';
  }
  
  if (typeof input === 'object') {
    try {
      return JSON.stringify(input).replace(/[\r\n\t]/g, ' ');
    } catch {
      return '[Object]';
    }
  }
  
  return String(input)
    .replace(/[\r\n\t]/g, ' ')
    .replace(/[<>]/g, '')
    .substring(0, 1000); // Limita tamanho
};

/**
 * Sanitiza erro para logs
 * @param {Error|any} error - Erro a ser sanitizado
 * @returns {string} - Erro sanitizado
 */
export const sanitizeError = (error) => {
  if (error instanceof Error) {
    return sanitizeForLog(error.message);
  }
  return sanitizeForLog(error);
};