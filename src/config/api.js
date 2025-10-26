// Configuração da API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://pteq15e8a6.execute-api.us-east-1.amazonaws.com',
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// Whitelist de domínios permitidos
const ALLOWED_DOMAINS = [
  'execute-api.us-east-1.amazonaws.com',
  'amazonaws.com'
];

// Função para validar URL contra SSRF
const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Apenas HTTPS permitido
    if (urlObj.protocol !== 'https:') {
      return false;
    }
    
    // Verificar se o domínio está na whitelist
    const isAllowed = ALLOWED_DOMAINS.some(domain => 
      urlObj.hostname.endsWith(domain)
    );
    
    if (!isAllowed) {
      return false;
    }
    
    // Bloquear IPs privados
    const privateIpRegex = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|169\.254\.|::1|localhost)/;
    if (privateIpRegex.test(urlObj.hostname)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

// Função para criar uma instância de fetch sem interceptors
export const createApiRequest = async (endpoint, options = {}) => {
  // Validar endpoint para prevenir SSRF
  if (!endpoint || typeof endpoint !== 'string' || !endpoint.startsWith('/')) {
    console.error('Endpoint inválido fornecido');
    throw new Error('Endpoint inválido');
  }
  
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  // Validar URL completa contra SSRF
  if (!isValidUrl(url)) {
    console.error('URL não autorizada');
    throw new Error('URL não autorizada');
  }
  const config = {
    ...options,
    headers: {
      ...API_CONFIG.HEADERS,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, {
      ...config,
      redirect: 'manual' // Prevenir redirecionamentos automáticos
    });
    
    // Verificar se houve redirecionamento
    if (response.type === 'opaqueredirect' || response.status >= 300 && response.status < 400) {
      throw new Error('Redirecionamento não permitido');
    }
    
    // Validar URL final após possíveis redirecionamentos
    if (response.url && !isValidUrl(response.url)) {
      throw new Error('URL de resposta não autorizada');
    }
    
    if (response.status === 404) {
      throw new Error('Recurso não encontrado');
    }
    
    if (!response.ok) {
      const errorMessage = response.status >= 500 
        ? 'Erro no servidor' 
        : 'Erro na requisição';
      throw new Error(errorMessage);
    }
    
    return await response.json();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('API Request Error:', { endpoint, error: error.message });
    }
    throw new Error(error.message || 'Erro na comunicação com o servidor');
  }
};
