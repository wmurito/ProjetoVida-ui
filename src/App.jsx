import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { testAuth, validateToken, getPacientes } from './services/api'; // Adicionado getPacientes

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Registro from './pages/Registros'; // Renomeado para seguir padrão
import Cadastro from './pages/Cadastro';
import Relatorio from './pages/Relatorios'; // Renomeado para seguir padrão

import Layout from './components/Layout'; // Certifique-se que o caminho está correto

const App = () => {
  const { logged, loading, currentUser } = useAuth();

  React.useEffect(() => {
    if (logged && currentUser) { // Adicionado currentUser para garantir que temos dados do usuário
      console.log("[App.jsx] Usuário logado:", currentUser.username);
      console.log("[App.jsx] Executando testes de API...");

      // Teste 1: /auth/test (usa o interceptor)
      testAuth().then(result => {
        console.log("[App.jsx] Resultado de testAuth():", result);
      });

      // Teste 2: /auth/validate-token (envia token no corpo)
      validateToken().then(result => {
        console.log("[App.jsx] Resultado de validateToken():", result);
      });

      // Teste 3: Chamada para /pacientes/ (exemplo que estava falhando)
      getPacientes()
        .then(response => {
          console.log("[App.jsx] Resultado de getPacientes():", response.data);
        })
        .catch(error => {
          console.error("[App.jsx] Erro em getPacientes():", error.response?.data || error.message);
        });

    } else if (!loading && !logged) {
      console.log("[App.jsx] Usuário não está logado.");
    }
  }, [logged, loading, currentUser]); // Adicionado currentUser à dependência

  if (loading) {
    return <div>Carregando autenticação...</div>;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!logged ? <Login /> : <Navigate to="/dashboard" replace />}
      />
      <Route
        path="/"
        element={logged ? <Layout /> : <Navigate to="/login" replace />}
      >
        {/* Redireciona de "/" para "/dashboard" se logado e na raiz */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="registros" element={<Registro />} />
        <Route path="novocadastro" element={<Cadastro />} />
        <Route path="relatorios" element={<Relatorio />} />
        {/* Adicione outras rotas privadas aqui dentro do Layout */}
      </Route>
      {/* Rota de fallback para qualquer caminho não correspondido */}
      <Route path="*" element={<Navigate to={logged ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default App;