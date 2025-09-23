import styled from 'styled-components';

export const Grid = styled.div`
  display: grid;
  grid-template-areas:
    "header header"
    "aside main";
  
  grid-template-rows: 60px 1fr;
  grid-template-columns: auto 1fr;
  
  /* Layout fixo sem overflow */
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
`;

export const Main = styled.main`
  grid-area: main;
  background-color: var(--background-color);
  
  /* Scroll apenas no conteúdo interno */
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 60px); /* Altura total menos o header */
  position: relative;
`;