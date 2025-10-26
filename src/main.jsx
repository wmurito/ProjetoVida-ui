import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";

import { Amplify } from 'aws-amplify';
import { setupCSP } from './services/securityConfig';
import { toast } from 'react-toastify';
import { securityLogger } from './services/securityLogger';

// Configurar Content Security Policy para proteção contra XSS
setupCSP();

// Configurar toast global para notificações de segurança
window.showToast = (message, type = 'info') => {
  toast[type](message);
};

// Expor logger de segurança globalmente
window.securityLogger = securityLogger;

// Forçar HTTPS em produção
if (import.meta.env.PROD && window.location.protocol !== 'https:') {
  window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
}

// Configurar Amplify com variáveis de ambiente
const awsConfig = {
  Auth: {
    Cognito: {
      region: import.meta.env.VITE_AWS_REGION || 'us-east-1',
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID,
      loginWith: {
        email: true
      }
    }
  }
};

// Validar variáveis obrigatórias
if (!awsConfig.Auth.Cognito.userPoolId || !awsConfig.Auth.Cognito.userPoolClientId) {
  console.error('ERRO: Variáveis de ambiente AWS não configuradas');
}

// Configurar Amplify com opções de segurança aprimoradas
Amplify.configure({
  ...awsConfig,
  Auth: {
    ...awsConfig.Auth,
    cookieStorage: import.meta.env.PROD ? {
      domain: window.location.hostname,
      secure: true,
      path: '/',
      expires: 1,
      sameSite: 'strict'
    } : undefined
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
);