/**
 * Tratamento centralizado de erros
 * Evita exposição de informações sensíveis
 */

// Mensagens de erro genéricas
const ERROR_MESSAGES = {
  400: 'Requisição inválida',
  401: 'Não autorizado',
  403: 'Acesso negado',
  404: 'Recurso não encontrado',
  422: 'Dados inválidos',
  429: 'Muitas requisições. Tente novamente mais tarde',
  500: 'Erro interno do servidor',
  503: 'Serviço temporariamente indisponível'
};

// Sanitizar mensagem de erro
export const sanitizeError = (error) => {
  // Não expor stack traces ou detalhes internos
  if (error.response) {
    const status = error.response.status;
    return {
      message: ERROR_MESSAGES[status] || 'Erro na requisição',
      status,
      timestamp: new Date().toISOString()
    };
  }
  
  if (error.request) {
    return {
      message: 'Erro de conexão com o servidor',
      status: 0,
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    message: 'Erro inesperado',
    status: 0,
    timestamp: new Date().toISOString()
  };
};

// Log de erro seguro (apenas em desenvolvimento)
export const logError = (error, context = {}) => {
  if (import.meta.env.DEV) {
    console.error('Error:', {
      message: error.message,
      context,
      timestamp: new Date().toISOString()
    });
  }
  
  // Em produção, enviar para serviço de monitoramento
  if (import.meta.env.PROD) {
    // TODO: Integrar com CloudWatch ou similar
    // sendToMonitoring(sanitizeError(error), context);
  }
};

// Handler global de erros não capturados
export const setupGlobalErrorHandler = () => {
  window.addEventListener('error', (event) => {
    event.preventDefault();
    logError(event.error, { type: 'uncaught' });
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    logError(event.reason, { type: 'unhandled-promise' });
  });
};
