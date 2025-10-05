import styled from 'styled-components';

export const Container = styled.header`
  grid-area: header; /* Define a área no grid do Layout */
  display: flex;
  align-items: center;
  //padding: 0 1.5rem;
  height: 60px; /* Altura fixa para o header */
  padding-left: 1rem;
  background-color: var(--secondary-color);
  border-bottom: 1px solid var(--border-color-inverted);
  position: relative; /* Fixa o header no topo */
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001; /* Garante que fique acima dos outros elementos */
`;

export const Logo = styled.img`
  //height: 35px; /* Tamanho da logo no header */
  width: 10rem;
`;

export const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #ff7bac;
  font-size: 1.5rem;
  cursor: pointer;
  margin-left: 0.5rem;
  margin-right: 1rem;
  transition: all 0.2s ease;

  &:hover {
    color: black;
    transform: scale(1.1);
  }
`;