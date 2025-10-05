import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { getPacientes } from './services/api';
import { sanitizeInput } from './services/securityConfig';
import { toast } from 'react-toastify';

// Layout é importado diretamente, pois é necessário em todas as rotas protegidas.
import Layout from './components/Layout';

// --- Melhoria: Importação dinâmica (Lazy Loading) das páginas ---
// Cada página será carregada em um "chunk" separado apenas quando for necessária.
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Registro = lazy(() => import('./pages/Registros'));
const Cadastro = lazy(() => import('./pages/Cadastro'));
const Relatorio = lazy(() => import('./pages/Relatorios'));
const UploadMobile = lazy(() => import('./pages/UploadMobile'));

// Componente simples para o estado de carregamento do Suspense
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '18px'
  }}>
    Carregando página...
  </div>
);

const App = () => {
  const { logged, loading, currentUser } = useAuth();

  React.useEffect(() => {
    if (logged && currentUser && !import.meta.env.PROD) {
      getPacientes()
        .catch(error => {
          console.error('Erro ao carregar dados iniciais:', {
            message: sanitizeInput(error.message || 'Erro desconhecido'),
            timestamp: new Date().toISOString(),
            user: sanitizeInput(currentUser.username || 'unknown')
          });
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
    // --- Melhoria: Adicionado <Suspense> em volta das rotas ---
    // O `fallback` será exibido enquanto o código da página está sendo carregado.
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route
          path="/login"
          element={!logged ? <Login /> : <Navigate to="/dashboard" replace />}
        />
        <Route path="/upload-mobile/:sessionId" element={<UploadMobile />} />
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
    </Suspense>
  );
};

export default App;