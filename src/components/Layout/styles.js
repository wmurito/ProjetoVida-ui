import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-areas:
    "header header"
    "aside main";
  
  grid-template-rows: 60px 1fr;
  grid-template-columns: auto 1fr;
  
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 100%;
    grid-template-areas:
      "header"
      "main";
  }
`;

export const Main = styled.main`
  grid-area: main;
  background-color: var(--background-color);
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 60px);
  position: relative;
  
  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
  }
`;

export const MobileOverlay = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${({ $show }) => ($show ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1500;
  }
`;