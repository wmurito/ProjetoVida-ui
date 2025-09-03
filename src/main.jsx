import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";

import { Amplify } from 'aws-amplify';
import awsConfig from './aws-exports';
import { setupCSP } from './services/securityConfig';

// Configurar Content Security Policy para proteção contra XSS
setupCSP();

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
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);