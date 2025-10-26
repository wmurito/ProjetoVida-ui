import React from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import {
  Container,
  NavMenu,
  NavItem,
  NavLink,
  LogoutButton,
} from './styles'; // Logo e ToggleButton removidos
import { 
  AiOutlineHome, 
  AiOutlineUserAdd, 
  AiOutlineFolderOpen, 
  AiOutlineBarChart 
} from 'react-icons/ai';
import { FaSignOutAlt } from 'react-icons/fa';

// Recebe apenas 'isClosed'. A função de toggle não é mais necessária aqui.
const Aside = ({ isClosed, $menuAberto }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erro no logout:', error);
      // Forçar limpeza mesmo com erro
      localStorage.clear();
      sessionStorage.clear();
      toast.error('Sessão encerrada');
      navigate('/login', { replace: true });
    }
  };

  const navLinks = [
    { to: "/dashboard", icon: <AiOutlineHome />, text: "Dashboard" },
    { to: "/novocadastro", icon: <AiOutlineUserAdd />, text: "Novo Cadastro" },
    { to: "/registros", icon: <AiOutlineFolderOpen />, text: "Registros" },
    { to: "/relatorios", icon: <AiOutlineBarChart />, text: "Relatórios" },
  ];

  return (
    <Container $isClosed={isClosed} $menuAberto={$menuAberto}>
      {/* A LOGO E O TOGGLE BUTTON FORAM REMOVIDOS DAQUI */}
      <NavMenu>
        {navLinks.map((link, index) => (
          <NavItem key={index}>
            <NavLink to={link.to} as={RouterNavLink} title={link.text}>
              {link.icon}
              {!isClosed && <span>{link.text}</span>}
            </NavLink>
          </NavItem>
        ))}
      </NavMenu>

      <LogoutButton onClick={handleLogout} $isClosed={isClosed}>
        <FaSignOutAlt />
        {!isClosed && <span>Sair</span>}
      </LogoutButton>
    </Container>
  );
};

export default Aside;