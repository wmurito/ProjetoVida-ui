import styled from 'styled-components';

export const Container = styled.div`
  grid-area: CT; 

  //padding: 10px;
  color: #8a8a8a;
  height: calc(100vh - 70px);
  overflow-y: auto;

  /* Estilos da barra de rolagem */
  &::-webkit-scrollbar {
    width: 8px;               
    background-color: #f5f5f5; 
  }

  &::-webkit-scrollbar-track {
    background-color: #f5f5f5; 
    border-radius: 4px;        
  }

  &::-webkit-scrollbar-thumb {
    background-color: #FF7BAC;    
    border-radius: 4px;        
  }
`;