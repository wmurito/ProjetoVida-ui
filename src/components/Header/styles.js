import styled from 'styled-components';

export const Container = styled.div`
  grid-area: HE;
  color: #8A8A8A;
  background-color: #FFF;
  padding: 0 10px;
  border-bottom: 0.5px solid  #CCC;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  margin-bottom: 5px;
  overflow: hidden; 
`;

export const ButtonCadastro = styled.button `
    border-radius: 6px;
    background: linear-gradient(90deg, #FFD8E3, #FF7BAC);
    color: #FFF;
    font-size: 12px;
    font-weight: bold;
    padding: 10px 18px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    align-items: center;
    margin-right: 10px;
`;

