import React from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { toast } from 'react-toastify';
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
const Aside = ({ isClosed }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout. Tente novamente.');
    }
  };

  const navLinks = [
    { to: "/dashboard", icon: <AiOutlineHome />, text: "Dashboard" },
    { to: "/novocadastro", icon: <AiOutlineUserAdd />, text: "Novo Cadastro" },
    { to: "/registros", icon: <AiOutlineFolderOpen />, text: "Registros" },
    { to: "/relatorios", icon: <AiOutlineBarChart />, text: "Relatórios" },
  ];

  return (
    <Container $isClosed={isClosed}>
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