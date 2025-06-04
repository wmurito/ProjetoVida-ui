import React from "react"; 
import { Container } from "./styles"; 

const Content = ({ children }) => ( // Define o componente Content, que recebe `children` como uma propriedade.
    <Container> 
       {children}  {/* Renderiza o conteúdo passado como filhos para o componente Content dentro do Container. */}
    </Container>
);

export default Content; 
