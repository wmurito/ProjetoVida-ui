// Implementação de proteção CSRF para o frontend

// Gera um token CSRF aleatório
export const generateCSRFToken = () => {
  try {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('Erro ao gerar token CSRF:', error.message);
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
};

// Armazena o token CSRF em sessionStorage
export const storeCSRFToken = (token) => {
  try {
    sessionStorage.setItem('csrf_token', token);
  } catch (error) {
    console.error('Erro ao armazenar token CSRF:', error.message);
  }
};

// Obtém o token CSRF armazenado
export const getCSRFToken = () => {
  return sessionStorage.getItem('csrf_token');
};

// Inicializa o token CSRF se não existir
export const initCSRFProtection = () => {
  if (!getCSRFToken()) {
    const token = generateCSRFToken();
    storeCSRFToken(token);
  }
  return getCSRFToken();
};

// Adiciona o token CSRF aos cabeçalhos de uma requisição
export const addCSRFToken = (headers = {}) => {
  const token = getCSRFToken();
  if (token) {
    return {
      ...headers,
      'X-CSRF-Token': token
    };
  }
  return headers;
};