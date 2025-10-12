import axios from 'axios';
import { csrfProtection } from './csrfProtection';
import { rateLimiter } from './rateLimiter';
import { API_BASE_URL } from '../constants';
import { sanitizeLog } from './securityConfig';

// Criar instância do axios com configurações seguras
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Interceptor de request
httpClient.interceptors.request.use(
  (config) => {
    // Verificar rate limiting
    const identifier = sessionStorage.getItem('userId') || 'anonymous';
    if (!rateLimiter.recordAttempt(identifier, 100, 60000)) { // 100 requests por minuto
      throw new Error('Rate limit exceeded. Try again later.');
    }

    // Adicionar CSRF token
    config.headers = csrfProtection.addTokenToHeaders(config.headers);

    // Validar URL de destino
    if (config.url && !isValidApiUrl(config.url)) {
      throw new Error('Invalid API endpoint');
    }

    // Forçar HTTPS em produção
    if (import.meta.env.PROD && config.baseURL && !config.baseURL.startsWith('https://')) {
      throw new Error('HTTPS required in production');
    }

    return config;
  },
  (error) => {
    console.error('Request error:', sanitizeLog(error.message));
    return Promise.reject(error);
  }
);

// Interceptor de response
httpClient.interceptors.response.use(
  (response) => {
    // Limpar rate limit em caso de sucesso
    const identifier = sessionStorage.getItem('userId') || 'anonymous';
    if (response.status < 400) {
      rateLimiter.clearAttempts(identifier);
    }

    return response;
  },
  (error) => {
    // Log sanitizado do erro
    console.error('Response error:', sanitizeLog(error.message));

    // Tratar erros específicos
    if (error.response?.status === 401) {
      // Token expirado - limpar dados e redirecionar
      csrfProtection.clearToken();
      sessionStorage.clear();
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // CSRF token inválido
      csrfProtection.generateToken();
    } else if (error.response?.status === 429) {
      // Rate limit excedido
      throw new Error('Too many requests. Please wait before trying again.');
    }

    return Promise.reject(error);
  }
);

// Validar URLs da API de forma mais rigorosa
const isValidApiUrl = (url) => {
  try {
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
    const urlObj = new URL(fullUrl);
    
    // Verificar protocolo
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Verificar se é um endpoint válido (lista restritiva)
    const validPaths = [
      '/api/patients', '/api/auth', '/api/dashboard',
      '/dashboard/', '/pacientes/', '/auth/', '/upload-'
    ];
    const isValidPath = validPaths.some(path => {
      const pathRegex = new RegExp(`^${path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/.*)?$`);
      return pathRegex.test(urlObj.pathname);
    });
    
    if (!isValidPath) {
      return false;
    }
    
    // Verificar se o host é permitido
    const apiBaseUrl = new URL(API_BASE_URL);
    return urlObj.hostname === apiBaseUrl.hostname;
    
  } catch (e) {
    return false;
  }
};

export default httpClient;