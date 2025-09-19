// Constantes da aplicação
export const API_ENDPOINTS = {
  PATIENTS: '/api/patients',
  AUTH: '/api/auth',
  DASHBOARD: '/api/dashboard'
};

export const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 15,
  ADDRESS_MAX_LENGTH: 500,
  CPF_LENGTH: 11
};

export const UI_CONSTANTS = {
  INACTIVITY_TIMEOUT: 15 * 60 * 1000, // 15 minutos
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300
};

export const SECURITY_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/,
  PHONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$|^\d{10,11}$/,
  NAME: /^[a-zA-ZÀ-ÿ\s]+$/
};