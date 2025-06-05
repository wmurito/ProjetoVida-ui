import {
  signIn,
  signOut,
  fetchAuthSession,
  confirmSignIn,
  getCurrentUser // Adicionado para logar o usuário atual
} from 'aws-amplify/auth';
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingChallenge, setPendingChallenge] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // Para armazenar dados do usuário

  const login = async (username, password, newPassword = null) => {
    console.log('[AuthProvider] Tentativa de login para usuário:', username);
    try {
      if (pendingChallenge && newPassword) {
        console.log('[AuthProvider] Confirmando login com nova senha...');
        await confirmSignIn({ challengeResponse: newPassword });
        setPendingChallenge(null);
        console.log('[AuthProvider] Nova senha confirmada.');
        await checkUser(true); // Força a atualização do estado após confirmação
        return { success: true };
      }

      const { nextStep } = await signIn({ username, password });
      console.log('[AuthProvider] Resultado do signIn:', nextStep);

      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        console.log('[AuthProvider] Nova senha requerida.');
        setPendingChallenge(true);
        return { newPasswordRequired: true };
      }

      if (nextStep.signInStep === 'DONE') {
        console.log('[AuthProvider] Login bem-sucedido (DONE).');
        await checkUser(true); // Força a atualização do estado e busca de tokens
        return { success: true };
      }

      console.warn('[AuthProvider] Passo de autenticação não suportado:', nextStep.signInStep);
      return { error: 'Passo de autenticação não suportado' };
    } catch (error) {
      console.error("[AuthProvider] Erro no login:", error);
      // Não relance o erro aqui se quiser tratar no componente de Login
      // throw error;
      return { error: error.message || "Erro desconhecido no login" };
    }
  };

  const logout = async () => {
    console.log('[AuthProvider] Tentativa de logout...');
    try {
      await signOut({ global: true }); // global: true invalida tokens em todos os dispositivos
      setLogged(false);
      setCurrentUser(null);
      sessionStorage.removeItem('userId'); // Limpar se estiver usando
      console.log('[AuthProvider] Logout bem-sucedido.');
    } catch (error) {
      console.error("[AuthProvider] Erro no logout:", error);
      throw error; // Pode relançar para tratamento no UI se necessário
    }
  };

  // Adicionado parâmetro 'isAfterLoginOrConfirmation' para log mais específico
  const checkUser = async (isAfterLoginOrConfirmation = false) => {
    if (!isAfterLoginOrConfirmation) setLoading(true); // Só mostra loading se não for chamado após login
    console.log('[AuthProvider] Verificando sessão do usuário...');
    try {
      // fetchAuthSession já é chamado em getAuthToken, mas aqui também para estado inicial
      const session = await fetchAuthSession(); // { forceRefresh: true } pode ser útil em alguns casos de debug
      console.log('[AuthProvider] checkUser - Sessão:', session);
      
      // A existência de tokens implica que o usuário está logado
      // A validade é verificada pelo Amplify internamente; se expirados, fetchAuthSession tentaria refresh.
      // Se o refresh falhar (ex: refresh token expirado), ele lançaria um erro.
      if (session && session.tokens) {
        setLogged(true);
        console.log('[AuthProvider] checkUser - Usuário está logado (tokens encontrados).');
        // Opcional: buscar detalhes do usuário
        try {
          const cognitoUser = await getCurrentUser();
          console.log('[AuthProvider] checkUser - Usuário atual do Cognito:', cognitoUser);
          setCurrentUser({
            username: cognitoUser.username,
            userId: cognitoUser.userId,
            // Outros atributos se disponíveis e necessários
          });
          // sessionStorage.setItem('userId', cognitoUser.userId); // Pode ser redundante se já feito no login
        } catch (userError) {
          console.warn('[AuthProvider] checkUser - Não foi possível obter detalhes do usuário Cognito, mas tokens existem:', userError);
          // Mantém logado se tokens existem, mesmo que getCurrentUser falhe por algum motivo
        }
      } else {
        setLogged(false);
        setCurrentUser(null);
        console.log('[AuthProvider] checkUser - Usuário não está logado (sem tokens na sessão).');
      }
    } catch (error) {
      // Erro aqui geralmente significa que não há sessão válida (nem tokens, nem refresh token válido)
      setLogged(false);
      setCurrentUser(null);
      console.log('[AuthProvider] checkUser - Erro ao buscar sessão (usuário provavelmente não logado):', error.message || error);
    } finally {
      if (!isAfterLoginOrConfirmation) setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ logged, login, logout, loading, pendingChallenge, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);