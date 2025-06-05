import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
});

// Função para obter o token atual com logs detalhados
export const getAuthToken = async () => {
  try {
    console.log('[getAuthToken] Tentando obter sessão...');
    const session = await fetchAuthSession({ forceRefresh: false });
    console.log('[getAuthToken] Sessão obtida:', session);

    if (session?.tokens) {
      console.log('[getAuthToken] Detalhes dos Tokens na sessão:', JSON.stringify(session.tokens, null, 2));

      const accessTokenString = session.tokens.accessToken?.toString();
      const idTokenString = session.tokens.idToken?.toString();

      console.log('[getAuthToken] Access Token JWT (toString):', accessTokenString);
      console.log('[getAuthToken] ID Token JWT (toString):', idTokenString);

      if (accessTokenString) {
        try {
          const accessTokenPayload = JSON.parse(atob(accessTokenString.split('.')[1]));
          console.log('[getAuthToken] Access Token Payload (decodificado):', accessTokenPayload);
          if (accessTokenPayload.token_use !== 'access') {
            console.warn('[getAuthToken] ALERTA: Access Token Payload não tem token_use="access". Valor encontrado:', accessTokenPayload.token_use);
          }
        } catch (e) {
          console.error("[getAuthToken] Erro ao decodificar Access Token JWT:", e);
        }
      } else {
        console.warn('[getAuthToken] Access Token (toString) é nulo ou indefinido.');
      }

      if (idTokenString) {
        try {
          const idTokenPayload = JSON.parse(atob(idTokenString.split('.')[1]));
          console.log('[getAuthToken] ID Token Payload (decodificado):', idTokenPayload);
        } catch (e) {
          console.error("[getAuthToken] Erro ao decodificar ID Token JWT:", e);
        }
      }

      // A lógica original para retornar o access token
      if (session.tokens.accessToken) {
        console.log('[getAuthToken] Retornando Access Token.');
        return session.tokens.accessToken.toString();
      } else {
        console.warn("[getAuthToken] Access Token não encontrado no objeto session.tokens, apesar de session.tokens existir.");
        return null;
      }

    } else {
      console.warn('[getAuthToken] Nenhum token encontrado na sessão (session.tokens é nulo ou indefinido).');
      return null;
    }
  } catch (error) {
    console.error('[getAuthToken] Erro ao obter sessão ou tokens:', error);
    return null;
  }
};

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    console.log('[Interceptor Request] Configuração original:', config.url);
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[Interceptor Request] Token adicionado ao cabeçalho Authorization para:', config.url);
    } else {
      console.warn('[Interceptor Request] Token não disponível. Requisição seguirá sem Authorization header para:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('[Interceptor Request] Erro no interceptor:', error);
    return Promise.reject(error);
  }
);

// Função para testar a autenticação diretamente
export const testAuth = async () => {
  try {
    console.log('[testAuth] Iniciando teste de autenticação...');
    // A instância 'api' já terá o token através do interceptor
    const testResponse = await api.get(`/auth/test`);
    console.log('[testAuth] Resposta de /auth/test:', testResponse.data);
    return { status: 'ok', authenticated: true, data: testResponse.data };
  } catch (e) {
    console.error('[testAuth] Erro no teste auth:', e.response?.data || e.message);
    return { status: 'error', authenticated: false, error: e.response?.data || e.message };
  }
};

// Função para buscar pacientes (exemplo de chamada que estava falhando)
export const getPacientes = (skip = 0, limit = 100) => {
  console.log('[getPacientes] Buscando pacientes...');
  // A instância 'api' já terá o token através do interceptor
  return api.get(`/pacientes/?skip=${skip}&limit=${limit}`);
};


// Função para validar o token diretamente com o backend
export const validateToken = async () => {
  console.log('[validateToken] Iniciando validação de token com backend...');
  try {
    const token = await getAuthToken(); // Pega o token que o frontend acha que é o correto
    if (!token) {
      console.warn('[validateToken] Token não disponível para validação.');
      return { valid: false, error: 'Token não disponível no frontend' };
    }
    
    // Nota: esta chamada NÃO usa a instância 'api' com interceptor,
    // pois queremos enviar o token no corpo para o endpoint /auth/validate-token
    const response = await axios.post(`${API_URL}/auth/validate-token`, { token }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('[validateToken] Resposta de /auth/validate-token:', response.data);
    return response.data;
  } catch (error) {
    console.error('[validateToken] Erro na validação de token com backend:', error.response?.data || error.message);
    return { 
      valid: false, 
      error: error.response?.data || (error.response ? `Erro ${error.response.status}` : 'Erro de rede')
    };
  }
};

// Função para verificar se o usuário está autenticado (opcional se testAuth já faz isso)
export const checkAuth = async () => {
  console.log('[checkAuth] Verificando autenticação com /auth/test...');
  try {
    // Usa a instância 'api' com interceptor
    const response = await api.get('/auth/test');
    console.log('[checkAuth] Resposta de /auth/test:', response.data);
    return response.data;
  } catch (error) {
    console.error('[checkAuth] Erro ao verificar autenticação:', error.response?.data || error.message);
    return { error: error.response?.data || error.message };
  }
};

export default api;