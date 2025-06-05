import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

// No Vite, as variáveis de ambiente são acessadas com import.meta.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Criar instância do axios com configurações básicas
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // Desabilitar envio de cookies
});

// Função para testar a autenticação diretamente
export const testAuth = async () => {
  try {
    const token = await getAuthToken();
    if (token) {
      // Evitar expor tokens em logs
      
      // Teste usando Axios em vez de XMLHttpRequest síncrono
      try {
        const testResponse = await axios.get(`${API_URL}/auth/test`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Evitar logar dados sensíveis
        return { status: 'ok', authenticated: true };
      } catch (e) {
        console.error('Erro no teste auth:', e.message);
      }
      
      // Teste para a rota de pacientes com Axios
      try {
        const pacientesResponse = await axios.get(`${API_URL}/pacientes/?skip=0&limit=100`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        // Evitar logar dados sensíveis
        return { status: 'ok', authenticated: true };
      } catch (e) {
        console.error('Erro no teste pacientes:', e.message);
      }
      
      return { status: 'ok', authenticated: true };
    }
    return { error: 'Token não disponível' };
  } catch (error) {
    console.error('Erro no teste de autenticação:', error.message);
    return { error: error.message };
  }
};

// Função para obter o token atual
export const getAuthToken = async () => {
  try {
    const session = await fetchAuthSession({ forceRefresh: false });
    
    if (session?.tokens?.accessToken) {
      return session.tokens.accessToken.toString();
    }
    
    console.warn("Access Token não encontrado na sessão.");
    return null;
  } catch (error) {
    console.error('Erro ao obter sessão ou access token:', error);
    return null;
  }
};

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAuthToken();
      if (token) {
        // Definir o cabeçalho de autorização diretamente
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('Token não disponível para requisição');
      }
      return config;
    } catch (error) {
      console.error('Erro ao obter token:', error.message);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Função para verificar se o usuário está autenticado
export const checkAuth = async () => {
  try {
    const response = await api.get('/auth/test');
    return response.data;
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    return { error: error.message };
  }
};

// Função para validar o token diretamente com o backend
export const validateToken = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { valid: false, error: 'Token não disponível' };
    }
    
    // Usar Axios em vez de XMLHttpRequest
    try {
      const response = await axios.post(`${API_URL}/auth/validate-token`, { token }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Evitar logar dados sensíveis
      return response.data;
    } catch (error) {
      console.error('Erro na validação de token:', error.response?.status);
      return { 
        valid: false, 
        error: error.response ? `Erro ${error.response.status}` : 'Erro de rede' 
      };
    }
  } catch (error) {
    console.error('Erro ao validar token:', error.message);
    return { valid: false, error: error.message };
  }
};

export default api;