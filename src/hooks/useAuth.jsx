import {
  signIn,
  signOut,
  fetchAuthSession,
  confirmSignIn,
} from 'aws-amplify/auth';
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingChallenge, setPendingChallenge] = useState(null); // controle de troca de senha

  const login = async (username, password, newPassword = null) => {
    try {
      if (pendingChallenge && newPassword) {
        // Envia a nova senha
        const confirmed = await confirmSignIn({
          challengeResponse: newPassword,
        });
        setPendingChallenge(null);
        const { tokens, userSub } = await fetchAuthSession();
        sessionStorage.setItem('userId', userSub);
        setLogged(true);
        return { success: true };
      }

      const { nextStep } = await signIn({ username, password });

      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setPendingChallenge(true);
        return { newPasswordRequired: true };
      }

      if (nextStep.signInStep === 'DONE') {
        const { tokens, userSub } = await fetchAuthSession();
        sessionStorage.setItem('userId', userSub);
        setLogged(true);
        return { success: true };
      }

      return { error: 'Passo de autenticação não suportado' };
    } catch (error) {
      console.error("Erro no login:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setLogged(false);
    } catch (error) {
      console.error("Erro no logout:", error);
      throw error;
    }
  };

  const checkUser = async () => {
    setLoading(true);
    try {
      const { tokens } = await fetchAuthSession();
      setLogged(!!tokens);
    } catch (error) {
      setLogged(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ logged, login, logout, loading, pendingChallenge }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
