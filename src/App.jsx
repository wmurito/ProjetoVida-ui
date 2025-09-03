import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { getPacientes } from './services/api';
import { sanitizeInput } from './services/securityConfig';
import { toast } from 'react-toastify';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Registro from './pages/Registros';
import Cadastro from './pages/Cadastro';
import Relatorio from './pages/Relatorios';

import Layout from './components/Layout';

const App = () => {
  const { logged, loading, currentUser } = useAuth();

  React.useEffect(() => {
    // Remover logs de informações sensíveis em produção
    if (logged && currentUser && !import.meta.env.PROD) {
      // Logs apenas em ambiente de desenvolvimento com sanitização
      getPacientes()
        .catch(error => {
          // Log seguro com sanitização
          console.error('Erro ao carregar dados iniciais:', {
            message: sanitizeInput(error.message || 'Erro desconhecido'),
            timestamp: new Date().toISOString(),
            user: sanitizeInput(currentUser.username || 'unknown')
          });
          
          // Notificação amigável ao usuário
          toast.error('Erro ao carregar dados iniciais. Alguns recursos podem não funcionar corretamente.');
        });
    }
  }, [logged, loading, currentUser]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Carregando autenticação...
      </div>
    );
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
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="registros" element={<Registro />} />
        <Route path="novocadastro" element={<Cadastro />} />
        <Route path="relatorios" element={<Relatorio />} />
      </Route>
      <Route path="*" element={<Navigate to={logged ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
};

export default App;