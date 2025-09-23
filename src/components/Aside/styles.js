import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';

export const Container = styled.aside`
  grid-area: aside;
  background-color: var(--secondary-color);
  color: var(--side-text-color);
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  
  width: ${({ $isClosed }) => ($isClosed ? '60px' : '200px')};
  transition: width 0.3s ease-in-out;
  
  border-right: 1px solid var(--border-color-inverted);
  z-index: 1000;
  overflow-x: hidden;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    display: ${({ $menuAberto }) => ($menuAberto ? 'flex' : 'none')};
    position: fixed;
    left: 0;
    top: 60px;
    width: 70%;
    height: calc(100vh - 60px);
    box-shadow: 2px 0 5px rgba(0,0,0,0.2);
    z-index: 2000;
  }
`;

// O STYLED COMPONENT 'LOGO' FOI REMOVIDO DAQUI

// O STYLED COMPONENT 'TOGGLEBUTTON' FOI REMOVIDO DAQUI

export const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

export const NavItem = styled.li`
  margin-bottom: 0.5rem;
`;

export const NavLink = styled(RouterNavLink)`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: var(--side-text-color);
  text-decoration: none;
  border-radius: 6px;
  white-space: nowrap;

  svg {
    font-size: 1.5rem; /* Ícones um pouco maiores para destaque */
    min-width: 24px;
    margin-right: ${({ 'data-is-closed': isClosed }) => (isClosed ? 0 : '0.5rem')};
    transition: margin-right 0.3s ease-in-out;
  }

  span {
    opacity: ${({ 'data-is-closed': isClosed }) => (isClosed ? 0 : 1)};
    transition: opacity 0.2s ease-in-out;
  }

  &.active,
  &:hover {
    background-color: var(--primary-color);
    color: black;
  }
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  width: 100%;
  color: var(--side-text-color);
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  white-space: nowrap;
  
  svg {
    font-size: 1.5rem;
    min-width: 24px;
    margin-right: ${({ $isClosed }) => ($isClosed ? 0 : '0.5rem')};
    transition: margin-right 0.3s ease-in-out;
  }

  span {
    opacity: ${({ $isClosed }) => ($isClosed ? 0 : 1)};
    transition: opacity 0.2s ease-in-out;
  }

  &:hover {
    background-color: rgba(255, 0, 0, 0.1);
    color: var(--red-color);
  }
`;