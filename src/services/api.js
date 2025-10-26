import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import { validateJwtFormat, sanitizeInput } from './securityConfig';
import { addCSRFToken, initCSRFProtection } from './csrf';
import { toast } from 'react-toastify';

// Controle de toast para evitar spam
let lastErrorToast = null;
let lastErrorTime = 0;
const ERROR_TOAST_COOLDOWN = 5000; // 5 segundos

const API_URL = import.meta.env.VITE_API_URL || 'https://pteq15e8a6.execute-api.us-east-1.amazonaws.com';

// API URL configurada via variável de ambiente

// Inicializar proteção CSRF
initCSRFProtection();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true,
  timeout: 30000
});

// Função para verificar autorização
const checkAuthorization = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      if (import.meta.env.DEV) {
        console.warn('Token não disponível');
      }
      return false;
    }
    
    // Verificar se o token é válido e não expirou
    const parts = token.split('.');
    if (parts.length !== 3) {
      if (import.meta.env.DEV) {
        console.error('Formato de token inválido');
      }
      return false;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (payload.exp < currentTime) {
      if (import.meta.env.DEV) {
        console.warn('Token expirado');
      }
      return false;
    }
    
    return true;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Erro ao verificar autorização:', error.message);
    }
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

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = [
  '/create-upload-session',
  '/upload-mobile/',
  '/upload-status/'
];

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    // Verificar se é uma rota pública
    const isPublicRoute = PUBLIC_ROUTES.some(route => config.url?.includes(route));
    
    // Não adicionar Authorization para requisições OPTIONS (preflight) ou rotas públicas
    if (config.method?.toUpperCase() !== 'OPTIONS' && !isPublicRoute) {
      const token = await getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
    // Verificar se é uma rota pública
    const isPublicRoute = PUBLIC_ROUTES.some(route => error.config?.url?.includes(route));
    
    if (error.response) {
      // Não mostrar toasts para rotas públicas (deixar o componente tratar)
      if (!isPublicRoute) {
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
      }
      
      // Log de erro sanitizado para produção
    } else if (!isPublicRoute) {
      showErrorToast('Erro de conexão. Verifique sua internet.');
    }
    return Promise.reject(error);
  }
);

// Endpoints de Pacientes
export const getPacientes = async (skip = 0, limit = 100) => {
  try {
    console.log(`Fazendo requisição para: /pacientes/?skip=${skip}&limit=${limit}`);
    const response = await api.get(`/pacientes/?skip=${skip}&limit=${limit}`);
    console.log(`Resposta recebida: ${response.data?.length || 0} pacientes`);
    return response;
  } catch (error) {
    console.error('Erro na requisição getPacientes:', error);
    throw error;
  }
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