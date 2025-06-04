import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { testAuth, checkAuth } from './services/api';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Registro from './pages/Registros';
import Cadastro from './pages/Cadastro';
import Relatorio from './pages/Relatorios';

import Layout from './components/Layout';

const App = () => {
  const { logged, loading } = useAuth();

  // Testar autenticação ao carregar o app
  React.useEffect(() => {
    if (logged) {
      console.log("Testando autenticação...");
      
      // Adicionar função de teste ao objeto window para acesso via console
      window.runAuthTest = async () => {
        const result = await testAuth();
        console.log("Resultado do teste de autenticação:", result);
        return result;
      };
      
      // Executar teste automaticamente
      window.runAuthTest();
      
      // Validar token diretamente com o backend
      import('./services/api').then(({ validateToken }) => {
        validateToken().then(result => {
          console.log("Validação de token:", result);
        });
      });
    }
  }, [logged]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Routes>
      {/* Rota pública */}
      <Route
        path="/login"
        element={!logged ? <Login /> : <Navigate to="/dashboard" />}
      />

      {/* Rotas privadas */}
      <Route
        path="/"
        element={logged ? <Layout /> : <Navigate to="/login" />}
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="registros" element={<Registro />} />
        <Route path="novocadastro" element={<Cadastro />} />
        <Route path="relatorios" element={<Relatorio />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default App;
