import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth"; // Verifique o caminho correto

import { Amplify } from 'aws-amplify';
import awsConfig from './aws-exports'; // Verifique se este arquivo existe e está correto
// import { setupCSP } from './services/securityConfig'; // Descomente se estiver usando

// Configurar Content Security Policy (opcional, mas bom para segurança)
// setupCSP();

// Configurar Amplify (removido cookieStorage, voltando para o padrão localStorage)
Amplify.configure({
  ...awsConfig
  // Se awsConfig já tem uma seção Auth, ela será usada.
  // Se precisar sobrescrever algo específico do Auth, pode fazer aqui:
  // Auth: {
  //   ...awsConfig.Auth, // Mantém configurações existentes de aws-exports
  //   // algumaConfiguracaoEspecifica: "valor"
  // }
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