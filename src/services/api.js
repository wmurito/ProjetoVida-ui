import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import { validateJwtFormat, sanitizeInput } from './securityConfig';
import { addCSRFToken, initCSRFProtection } from './csrf';
import { toast } from 'react-toastify';

// Controle de toast para evitar spam
let lastErrorToast = null;
let lastErrorTime = 0;
const ERROR_TOAST_COOLDOWN = 5000; // 5 segundos

const API_URL = import.meta.env.VITE_API_URL || 'https://84i83ihklg.execute-api.us-east-1.amazonaws.com';

// API URL configurada para produção

// Inicializar proteção CSRF
initCSRFProtection();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  },
  withCredentials: true
});

// Função para verificar autorização
const checkAuthorization = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Token não disponível');
    }
    
    // Verificar se o token é válido e não expirou
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp < currentTime) {
      throw new Error('Token expirado');
    }
    
    return true;
  } catch (error) {
    // Log de erro de autorização sanitizado
    return false;
  }
};

// Função para obter o token atual
export const getAuthToken = async () => {
  try {
    const session = await fetchAuthSession({ forceRefresh: false });

    if (session?.tokens?.accessToken) {
      const token = session.tokens.accessToken.toString();
      if (validateJwtFormat(token)) {
        return token;
      }
    }
    
    return null;
  } catch (error) {
    // Log de erro de autenticação sanitizado
    return null;
  }
};

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    // Adicionar token de autenticação
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função auxiliar para mostrar toast com cooldown
const showErrorToast = (message, type = 'error') => {
  const now = Date.now();
  
  // Se já existe um toast ativo com a mesma mensagem, não mostrar outro
  if (lastErrorToast === message && (now - lastErrorTime) < ERROR_TOAST_COOLDOWN) {
    return;
  }
  
  lastErrorToast = message;
  lastErrorTime = now;
  toast[type](message);
};

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Redirecionar para login em caso de erro de autenticação
      if (error.response.status === 401) {
        showErrorToast('Sessão expirada. Redirecionando para login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.response.status === 403) {
        showErrorToast('Acesso negado. Você não tem permissão para esta operação.');
      } else {
        showErrorToast('Erro na operação. Tente novamente.');
      }
      
      // Log de erro sanitizado para produção
    } else {
      showErrorToast('Erro de conexão. Verifique sua internet.');
    }
    return Promise.reject(error);
  }
);

// Endpoints de Pacientes
export const getPacientes = async (skip = 0, limit = 100) => {
  return api.get(`/pacientes/?skip=${skip}&limit=${limit}`);
};

// Endpoints do Dashboard
export const getDashboardEstadiamento = async () => {
  return api.get(`/dashboard/estadiamento`);
};

export const getDashboardSobrevida = async () => {
  return api.get(`/dashboard/sobrevida`);
};

export const getDashboardRecidiva = async () => {
  return api.get(`/dashboard/recidiva`);
};

export const getDashboardDeltaT = async () => {
  return api.get(`/dashboard/delta_t`);
};

export const getDashboardEstatisticasTemporais = async () => {
  return api.get(`/dashboard/estatisticas_temporais`);
};

export default api;