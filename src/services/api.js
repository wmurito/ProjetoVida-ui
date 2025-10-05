import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';
import { validateJwtFormat, sanitizeInput } from './securityConfig';
import { addCSRFToken, initCSRFProtection } from './csrf';
import { toast } from 'react-toastify';

// Controle de toast para evitar spam
let lastErrorToast = null;
let lastErrorTime = 0;
const ERROR_TOAST_COOLDOWN = 5000; // 5 segundos

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
    console.error('Erro de autorização:', sanitizeInput(error.message));
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
    if (!import.meta.env.PROD && error.name !== 'UserNotAuthenticatedException') {
      console.error('[Auth] Erro de autenticação');
    }
    return null;
  }
};

// Interceptor para adicionar token de autenticação e CSRF
api.interceptors.request.use(
  async (config) => {
    // Verificar autorização antes de fazer a requisição
    const isAuthorized = await checkAuthorization();
    if (!isAuthorized) {
      throw new Error('Não autorizado');
    }

    // Adicionar token de autenticação
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Adicionar token CSRF para métodos não seguros
    if (['post', 'put', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
      config.headers = addCSRFToken(config.headers);
    }
    
    // Sanitizar parâmetros de consulta
    if (config.params) {
      Object.keys(config.params).forEach(key => {
        if (typeof config.params[key] === 'string') {
          config.params[key] = sanitizeInput(config.params[key]);
        }
      });
    }
    
    // Sanitizar dados de requisição
    if (config.data && typeof config.data === 'object') {
      Object.keys(config.data).forEach(key => {
        if (typeof config.data[key] === 'string') {
          config.data[key] = sanitizeInput(config.data[key]);
        }
      });
    }
    
    return config;
  },
  (error) => {
    if (!import.meta.env.PROD) {
      console.error('[API] Erro na requisição:', sanitizeInput(error.message));
    }
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
      
      // Log seguro do erro
      console.error('[API Error]', {
        status: error.response.status,
        url: sanitizeInput(error.config?.url || ''),
        method: error.config?.method?.toUpperCase()
      });
    } else {
      showErrorToast('Erro de conexão. Verifique sua internet.');
    }
    return Promise.reject(error);
  }
);

// Endpoints de Pacientes com verificação de autorização
export const getPacientes = async (skip = 0, limit = 100) => {
  try {
    const isAuthorized = await checkAuthorization();
    if (!isAuthorized) {
      throw new Error('Não autorizado para acessar dados de pacientes');
    }
    return api.get(`/pacientes/?skip=${skip}&limit=${limit}`);
  } catch (error) {
    console.error('Erro ao buscar pacientes:', sanitizeInput(error.message));
    throw error;
  }
};

// Endpoints do Dashboard com verificação de autorização
export const getDashboardGraficos = async () => {
  try {
    const isAuthorized = await checkAuthorization();
    if (!isAuthorized) {
      throw new Error('Não autorizado para acessar dashboard');
    }
    return api.get(`/dashboard/graficos`);
  } catch (error) {
    console.error('Erro ao buscar gráficos:', sanitizeInput(error.message));
    throw error;
  }
};

export const getDashboardKpis = async () => {
  try {
    const isAuthorized = await checkAuthorization();
    if (!isAuthorized) {
      throw new Error('Não autorizado para acessar KPIs');
    }
    return api.get(`/dashboard/kpis`);
  } catch (error) {
    console.error('Erro ao buscar KPIs:', sanitizeInput(error.message));
    throw error;
  }
};

export default api;