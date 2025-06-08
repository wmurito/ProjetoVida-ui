import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false // Geralmente false para APIs baseadas em token Bearer
});

// Função para obter o token atual com logs detalhados
export const getAuthToken = async () => {
  try {
    // console.log('[getAuthToken] Tentando obter sessão...'); // Pode ser muito verboso, comente se necessário
    const session = await fetchAuthSession({ forceRefresh: false }); // forceRefresh: false é bom para performance
    // console.log('[getAuthToken] Sessão obtida:', session);

    if (session?.tokens?.accessToken) {
      // console.log('[getAuthToken] Access Token JWT (toString):', session.tokens.accessToken.toString());
      return session.tokens.accessToken.toString();
    } else {
      console.warn('[getAuthToken] Access Token não encontrado na sessão.');
      return null;
    }
  } catch (error) {
    // Erro comum aqui é 'UserNotAuthenticatedException' se não houver sessão
    // console.error('[getAuthToken] Erro ao obter sessão ou tokens:', error.name, error.message);
    if (error.name !== 'UserNotAuthenticatedException') { // Loga apenas erros inesperados
        console.error('[getAuthToken] Erro inesperado ao obter sessão ou tokens:', error);
    }
    return null;
  }
};

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    // Não logar a URL para todas as requisições em produção para não poluir os logs
    // console.log('[Interceptor Request] Configuração original:', config.url);
    
    // Verifica se a URL é para os endpoints de dashboard que podem ser públicos
    const publicDashboardPaths = ['/dashboard/graficos', '/dashboard/kpis'];
    const isPublicDashboardRequest = publicDashboardPaths.some(path => config.url.endsWith(path));

    if (isPublicDashboardRequest) {
      // Para os endpoints de dashboard (se forem públicos no backend),
      // podemos decidir não enviar o token.
      // Se eles forem protegidos no backend, o interceptor abaixo cuidará disso.
      // Se eles são públicos, mas o usuário ESTÁ logado, o token será enviado de qualquer forma
      // pela lógica abaixo, o que não é um problema, mas se quiser evitar:
      // console.log('[Interceptor Request] Endpoint público de dashboard, não adicionando token:', config.url);
      // return config; // Se quiser explicitamente não enviar token para endpoints públicos
    }
    
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('[Interceptor Request] Token adicionado ao cabeçalho Authorization para:', config.url);
    } else {
      // console.warn('[Interceptor Request] Token não disponível. Requisição seguirá sem Authorization header para:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('[Interceptor Request] Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor de resposta (opcional, mas útil para lidar com erros 401/403 globalmente)
api.interceptors.response.use(
  (response) => response, // Simplesmente retorna a resposta se for bem-sucedida
  (error) => {
    console.error('[Interceptor Response] Erro na resposta da API:', error.response?.status, error.response?.data || error.message);
    if (error.response) {
      // O servidor respondeu com um status de erro (4xx ou 5xx)
      if (error.response.status === 401) {
        // Ex: Token inválido ou expirado. Poderia redirecionar para login ou tentar refresh.
        console.warn('[Interceptor Response] Erro 401 - Não autorizado. O token pode ter expirado.');
        // window.location.href = '/login'; // Exemplo de redirecionamento
      } else if (error.response.status === 403) {
        // Ex: Usuário autenticado, mas não tem permissão para o recurso.
        console.warn('[Interceptor Response] Erro 403 - Proibido. O usuário não tem permissão.');
      }
    } else if (error.request) {
      // A requisição foi feita, mas nenhuma resposta foi recebida (ex: problema de rede)
      console.error('[Interceptor Response] Nenhuma resposta recebida:', error.request);
    } else {
      // Algo aconteceu ao configurar a requisição que acionou um erro
      console.error('[Interceptor Response] Erro na configuração da requisição:', error.message);
    }
    return Promise.reject(error); // Importante rejeitar o erro para que os catch() nos componentes funcionem
  }
);


// --- Funções de API ---

// Endpoints de Pacientes
export const getPacientes = (skip = 0, limit = 100) => {
  console.log('[API] getPacientes chamado.');
  return api.get(`/pacientes/?skip=${skip}&limit=${limit}`);
};

// Adicione outras funções CRUD para pacientes aqui (createPaciente, getPacienteById, updatePaciente, deletePaciente)
// Exemplo:
// export const getPacienteById = (pacienteId) => api.get(`/pacientes/${pacienteId}`);
// export const createPaciente = (pacienteData) => api.post('/pacientes/', pacienteData);
// export const updatePaciente = (pacienteId, pacienteData) => api.put(`/pacientes/${pacienteId}`, pacienteData);
// export const deletePaciente = (pacienteId) => api.delete(`/pacientes/${pacienteId}`);


// Endpoints do Dashboard
export const getDashboardGraficos = () => { // Renomeado de getDashboardData para clareza
  console.log('[API] getDashboardGraficos chamado.');
  return api.get(`/dashboard/graficos`); // Caminho ajustado para o endpoint de gráficos
};

export const getDashboardKpis = () => { // ✨ FUNÇÃO ADICIONADA ✨
  console.log('[API] getDashboardKpis chamado.');
  return api.get(`/dashboard/kpis`);
};

export default api;