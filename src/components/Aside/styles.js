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
`;

export const Menu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > svg {
    font-size: 20px;
    color: #ff7bac;
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
`;

export const LogImg = styled.img`
  width: 140px;
`;
