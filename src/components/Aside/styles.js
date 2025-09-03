import styled from 'styled-components';

export const Container = styled.div`
  grid-area: AS;
  background-color: #fff;
  border-right: 0.5px solid #ccc;
  color: #8A8A8A;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: ${props => props.$isCollapsed ? '70px' : '250px'};
  transition: width 0.3s ease;
  overflow: hidden;
  position: relative;

  &:hover .toggle-button {
    opacity: 1;
  }
`;

export const MenuAside = styled.nav`
  display: flex;
  flex-direction: column;
`;

export const MenuItens = styled.div`
  margin: 8px 20px;
  font-size: 16px;
  cursor: pointer;
  text-decoration: none;
  border-radius: 8px;
  padding: 8px;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: #ffe3ee;
    transform: scale(1.02);
  }
`;

export const Title = styled.span`
  margin: 0 10px;
  white-space: nowrap;
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > svg {
    font-size: 20px;
    color: #ff7bac;
    min-width: 20px;
  }
`;

export const Logout = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
  padding: 8px;
  transition: background-color 0.2s, transform 0.2s;

  &:hover {
    background-color: #ffe3ee;
    transform: scale(1.02);
  }

  > svg {
    font-size: 20px;
    margin-right: 8px;
    color: #ff7bac;
  }
`;

export const Header = styled.header`
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

export const LogImg = styled.img`
  width: ${({ $isCollapsed }) => ($isCollapsed ? '40px' : '140px')};
  height: ${({ $isCollapsed }) => ($isCollapsed ? '40px' : 'auto')};
  transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #ff7bac;
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  position: absolute;
  top: 20px;
  right: -15px; /* Posiciona o botão fora da borda do Container */
  opacity: 0;
  z-index: 20; /* Garantir que fique acima de tudo */

  &:hover {
    background-color: #ffe3ee;
    opacity: 1 !important;
  }

  &.toggle-button {
    opacity: 0;
  }
`;
