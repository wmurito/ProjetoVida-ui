import styled from "styled-components";

export const Grid = styled.div`
    display: grid;
    /* A largura do menu lateral (primeira coluna) muda dinamicamente.
      70px quando recolhido, 250px quando expandido.
    */
    grid-template-columns: ${props => (props.$isAsideCollapsed ? '70px' : '250px')} auto;
    
    grid-template-rows: 100vh;
    
    grid-template-areas:
        'AS CT';
    
    height: 100vh;
    
    /* Adiciona uma transição suave quando a largura do grid muda */
    transition: grid-template-columns 0.3s ease-in-out;
`;