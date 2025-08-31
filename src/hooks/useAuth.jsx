import {
  signIn,
  signOut,
  fetchAuthSession,
  confirmSignIn,
  getCurrentUser
} from 'aws-amplify/auth';
import { useState, useEffect, createContext, useContext } from 'react';
import { clearSensitiveData } from '../services/securityConfig';
import { initCSRFProtection } from '../services/csrf';

const AuthContext = createContext();

// Constantes para limitar tentativas de login
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos em milissegundos

export const AuthProvider = ({ children }) => {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pendingChallenge, setPendingChallenge] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [mfaRequired, setMfaRequired] = useState(false);
  
  // Estado para controle de tentativas de login
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  
  // Estado para registro de auditoria
  const [securityEvents, setSecurityEvents] = useState([]);

  // Função para registrar eventos de segurança
  const logSecurityEvent = (eventType, details) => {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      details,
      userAgent: navigator.userAgent,
      ipAddress: 'client-side' // O IP real seria capturado pelo backend
    };
    
    setSecurityEvents(prev => [...prev, event]);
    
    // Em produção, enviar para o backend para armazenamento
    if (import.meta.env.PROD) {
      // Implementar envio para API de auditoria
      // api.post('/security-events', event);
    }
  };

  const login = async (username, password, newPassword = null, mfaCode = null) => {
    try {
      // Verificar se a conta está bloqueada
      if (lockoutUntil && new Date() < lockoutUntil) {
        const remainingMinutes = Math.ceil((lockoutUntil - new Date()) / (60 * 1000));
        logSecurityEvent('LOGIN_BLOCKED', { username, reason: 'account_locked' });
        return { 
          error: `Conta temporariamente bloqueada. Tente novamente em ${remainingMinutes} minutos.` 
        };
      }

      // Fluxo de troca de senha
      if (pendingChallenge && newPassword) {
        await confirmSignIn({ challengeResponse: newPassword });
        setPendingChallenge(null);
        await checkUser(true);
        
        // Resetar tentativas após login bem-sucedido
        setLoginAttempts(0);
        setLockoutUntil(null);
        logSecurityEvent('PASSWORD_CHANGED', { username });
        return { success: true };
      }
      
      // Fluxo de verificação MFA
      if (mfaRequired && mfaCode) {
        await confirmSignIn({ challengeResponse: mfaCode });
        setMfaRequired(false);
        await checkUser(true);
        
        // Resetar tentativas após login bem-sucedido
        setLoginAttempts(0);
        setLockoutUntil(null);
        logSecurityEvent('MFA_SUCCESS', { username });
        return { success: true };
      }

      // Fluxo de login inicial
      const { nextStep } = await signIn({ username, password });

      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        setPendingChallenge(true);
        logSecurityEvent('NEW_PASSWORD_REQUIRED', { username });
        return { newPasswordRequired: true };
      }
      
      if (nextStep.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_MFA') {
        setMfaRequired(true);
        logSecurityEvent('MFA_REQUIRED', { username });
        return { mfaRequired: true };
      }

      if (nextStep.signInStep === 'DONE') {
        await checkUser(true);
        // Marcar como logado em sessionStorage para detecção de inatividade
        sessionStorage.setItem('isLoggedIn', 'true');
        // Inicializar proteção CSRF
        initCSRFProtection();
        
        // Resetar tentativas após login bem-sucedido
        setLoginAttempts(0);
        setLockoutUntil(null);
        logSecurityEvent('LOGIN_SUCCESS', { username });
        return { success: true };
      }

      logSecurityEvent('LOGIN_UNKNOWN_STEP', { username, step: nextStep.signInStep });
      return { error: 'Passo de autenticação não suportado' };
    } catch (error) {
      // Incrementar tentativas de login em caso de falha
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Bloquear conta após muitas tentativas
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockTime = new Date(Date.now() + LOCKOUT_TIME);
        setLockoutUntil(lockTime);
        logSecurityEvent('ACCOUNT_LOCKED', { username, attempts: newAttempts });
        return { 
          error: `Muitas tentativas de login. Conta bloqueada por 15 minutos.` 
        };
      }
      
      logSecurityEvent('LOGIN_FAILED', { username, attempts: newAttempts });
      return { error: "Credenciais inválidas" };
    }
  };

  const logout = async () => {
    try {
      const username = currentUser?.username;
      await signOut({ global: true });
      setLogged(false);
      setCurrentUser(null);
      
      // Limpar dados sensíveis
      clearSensitiveData();
      sessionStorage.removeItem('isLoggedIn');
      
      logSecurityEvent('LOGOUT', { username });
    } catch (error) {
      logSecurityEvent('LOGOUT_ERROR', { error: error.name });
      throw error;
    }
  };

  const checkUser = async (isAfterLoginOrConfirmation = false) => {
    if (!isAfterLoginOrConfirmation) setLoading(true);
    try {
      const session = await fetchAuthSession();
      
      if (session && session.tokens) {
        setLogged(true);
        try {
          const cognitoUser = await getCurrentUser();
          setCurrentUser({
            username: cognitoUser.username,
            userId: cognitoUser.userId,
          });
          
          // Marcar como logado em sessionStorage para detecção de inatividade
          sessionStorage.setItem('isLoggedIn', 'true');
        } catch (userError) {
          // Manter logado se tokens existem, mesmo que getCurrentUser falhe
        }
      } else {
        setLogged(false);
        setCurrentUser(null);
        sessionStorage.removeItem('isLoggedIn');
      }
    } catch (error) {
      setLogged(false);
      setCurrentUser(null);
      sessionStorage.removeItem('isLoggedIn');
    } finally {
      if (!isAfterLoginOrConfirmation) setLoading(false);
    }
  };

  // Verificar sessão periodicamente para segurança
  useEffect(() => {
    checkUser();
    
    // Verificar a sessão a cada 5 minutos
    const interval = setInterval(() => {
      if (logged) {
        checkUser();
      }
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      logged, 
      login, 
      logout, 
      loading, 
      pendingChallenge, 
      currentUser,
      loginAttempts,
      lockoutUntil,
      mfaRequired
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);