/**
 * Validação e sanitização de inputs
 * Previne XSS, SQL Injection e outros ataques
 */

import { VALIDATION_PATTERNS, DANGEROUS_PATTERNS } from '../config/security';

// Sanitizar string removendo caracteres perigosos
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  
  let sanitized = input.trim();
  
  // Remover padrões perigosos
  DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  // Escapar HTML
  const div = document.createElement('div');
  div.textContent = sanitized;
  return div.innerHTML;
};

// Validar email
export const validateEmail = (email) => {
  return VALIDATION_PATTERNS.email.test(email);
};

// Validar CPF
export const validateCPF = (cpf) => {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleaned)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(9))) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned.charAt(10))) return false;
  
  return true;
};

// Validar telefone
export const validatePhone = (phone) => {
  return VALIDATION_PATTERNS.phone.test(phone);
};

// Validar nome
export const validateName = (name) => {
  return VALIDATION_PATTERNS.name.test(name);
};

// Detectar tentativa de ataque
export const detectAttack = (input) => {
  if (typeof input !== 'string') return false;
  
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(input));
};

// Validar URL
export const validateURL = (url, allowedDomains = []) => {
  try {
    const urlObj = new URL(url);
    
    // Apenas HTTPS
    if (urlObj.protocol !== 'https:') return false;
    
    // Verificar domínios permitidos
    if (allowedDomains.length > 0) {
      return allowedDomains.some(domain => 
        urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
      );
    }
    
    return true;
  } catch {
    return false;
  }
};

// Limitar tamanho de input
export const limitInputSize = (input, maxSize = 1000) => {
  if (typeof input !== 'string') return '';
  return input.slice(0, maxSize);
};
