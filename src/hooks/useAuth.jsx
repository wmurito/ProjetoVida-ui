import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth';
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const { nextStep } = await signIn({ username, password });
      if (nextStep.signInStep === 'DONE') {
        // Obter informações da sessão após login bem-sucedido
        const { tokens, userSub } = await fetchAuthSession();
        
        // Salvar o sub do usuário em sessionStorage em vez de localStorage para maior segurança
        if (tokens && userSub) {
          sessionStorage.setItem('userId', userSub);
        }
        
        setLogged(true);
        return true;
      }
      return false;
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
      const isLoggedIn = !!tokens;
      setLogged(isLoggedIn);
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
    <AuthContext.Provider value={{ logged, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);