import React from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Profile, Welcome, UserName } from "./styles";
import { useAuth } from '../../hooks/useAuth';
import { sanitizeInput } from '../../services/securityConfig';
import { toast } from 'react-toastify';

const Header = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    const confirm = window.confirm('Tem certeza que deseja sair?');
    if (!confirm) return;

    try {
      await logout();
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error) {
      // Log seguro com sanitização
      console.error('Erro no logout:', {
        message: sanitizeInput(error.message || 'Erro desconhecido'),
        timestamp: new Date().toISOString(),
        user: sanitizeInput(currentUser?.username || 'unknown')
      });
      
      // Notificação específica para o usuário
      if (error.name === 'NetworkError') {
        toast.error('Erro de conexão. Logout pode não ter sido completado no servidor.');
      } else if (error.name === 'AuthenticationError') {
        toast.error('Erro de autenticação durante logout.');
      } else {
        toast.error('Erro inesperado durante logout. Contate o suporte se o problema persistir.');
      }
      
      // Mesmo com erro, redirecionar para login por segurança
      navigate('/login');
    }
  };

  // Sanitizar nome do usuário antes de exibir
  const displayName = currentUser?.username ? 
    sanitizeInput(currentUser.username) : 
    'Usuário';

  return (
    <Container>
      <div></div>
      <Profile>
        <Welcome>Bem-vindo,</Welcome>
        <UserName onClick={handleLogout} title="Clique para sair">
          {displayName}
        </UserName>
      </Profile>
    </Container>
  );
};

export default Header;