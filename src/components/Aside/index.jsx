import React from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Container, MenuAside, MenuItens, Title, Menu, LogImg, Header, Logout } from "./styles";
import { MdDashboard } from "react-icons/md";
import { FaClipboardUser, FaFileInvoice, FaUserPlus } from "react-icons/fa6";
import { RiLogoutBoxRFill } from "react-icons/ri";
import LogoVida from "../../assets/logo.png";
import { useAuth } from '../../hooks/useAuth';

/**
 * Aside component renders the application's sidebar navigation menu.
 * 
 * Features:
 * - Displays the application logo.
 * - Provides navigation links to Dashboard, Novo Cadastro, Registros, and Relatórios pages.
 * - Includes a logout button that prompts the user for confirmation before logging out.
 * 
 * Hooks:
 * - Uses `useNavigate` from react-router-dom for navigation.
 * - Uses `useAuth` custom hook for authentication and logout functionality.
 * 
 * @component
 * @returns {JSX.Element} The rendered sidebar navigation menu.
 */
const Aside = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    const confirm = window.confirm('Tem certeza que deseja sair?');
    if (!confirm) return;

    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };


  return (
    <Container>
      <MenuAside>
        <Header>
          <LogImg src={LogoVida} alt="logoVida" />
        </Header>

        <MenuItens>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#8A8A8A' }}>
            <Menu>
              <MdDashboard />
              <Title>Dashboard</Title>
            </Menu>
          </Link>
        </MenuItens>

        <MenuItens>
          <Link to="/novocadastro" style={{ textDecoration: 'none', color: '#8A8A8A' }}>
            <Menu>
              <FaUserPlus />
              <Title>Novo Cadastro</Title>
            </Menu>
          </Link>
        </MenuItens>

         <MenuItens>
          <Link to="/registros" style={{ textDecoration: 'none', color: '#8A8A8A' }}>
            <Menu>
              <FaClipboardUser />
              <Title>Registros</Title>
            </Menu>
          </Link>
        </MenuItens>

        <MenuItens>
          <Link to="/relatorios" style={{ textDecoration: 'none', color: '#8A8A8A' }}>
            <Menu>
              <FaFileInvoice />
              <Title>Relatórios</Title>
            </Menu>
          </Link>
        </MenuItens>

        <Logout onClick={handleLogout}>
          <Menu>
            <RiLogoutBoxRFill />
            <Title>Sair</Title>
          </Menu>
        </Logout>
      </MenuAside>
    </Container>
  );
}

export default Aside;
