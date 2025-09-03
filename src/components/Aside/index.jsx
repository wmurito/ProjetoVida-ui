import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Container, MenuAside, MenuItens, Title, Menu, LogImg, Header, Logout, ToggleButton } from "./styles";
import { MdDashboard, MdMenu } from "react-icons/md";
import { FaClipboardUser, FaFileInvoice, FaUserPlus } from "react-icons/fa6";
import { RiLogoutBoxRFill } from "react-icons/ri";
import LogoVida from "../../assets/logo.png";
import VidaLogo from "../../assets/vida.png"
import { useAuth } from '../../hooks/useAuth';

const Aside = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Container $isCollapsed={isCollapsed}>
      <MenuAside>
        <Header>
          <ToggleButton 
            onClick={toggleSidebar}
            className="toggle-button"
            title={isCollapsed ? "Expandir menu" : "Recolher menu"}
          >
            <MdMenu />
          </ToggleButton>
          {!isCollapsed && <LogImg src={LogoVida} alt="logoVida" $isCollapsed={isCollapsed} />}
          {isCollapsed && <LogImg src={VidaLogo} alt="logoVida" $isCollapsed={isCollapsed} />}
        </Header>

        <MenuItens>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#8A8A8A' }}>
            <Menu>
              <MdDashboard />
              {!isCollapsed && <Title>Dashboard</Title>}
            </Menu>
          </Link>
        </MenuItens>

        <MenuItens>
          <Link to="/novocadastro" style={{ textDecoration: 'none', color: '#8A8A8A' }}>
            <Menu>
              <FaUserPlus />
              {!isCollapsed && <Title>Novo Cadastro</Title>}
            </Menu>
          </Link>
        </MenuItens>

        <MenuItens>
          <Link to="/registros" style={{ textDecoration: 'none', color: '#8A8A8A' }}>
            <Menu>
              <FaClipboardUser />
              {!isCollapsed && <Title>Registros</Title>}
            </Menu>
          </Link>
        </MenuItens>

        <MenuItens>
          <Link to="/relatorios" style={{ textDecoration: 'none', color: '#8A8A8A' }}>
            <Menu>
              <FaFileInvoice />
              {!isCollapsed && <Title>Relatórios</Title>}
            </Menu>
          </Link>
        </MenuItens>

        <Logout onClick={handleLogout}>
          <Menu>
            <RiLogoutBoxRFill />
            {!isCollapsed && <Title>Sair</Title>}
          </Menu>
        </Logout>
      </MenuAside>
    </Container>
  );
}

export default Aside;