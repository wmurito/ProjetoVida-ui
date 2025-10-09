// Configuração da API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://84i83ihklg.execute-api.us-east-1.amazonaws.com',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Função para criar uma instância de fetch sem interceptors
export const createApiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...API_CONFIG.HEADERS,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 404) {
      throw new Error('404');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
};
