import React from 'react'; 

import { Container } from './styles'; 

const Button = ({ children, ...rest }) => {
  // Define o componente funcional `Button`, que recebe `children` e qualquer outra prop via spread operator (`...rest`)
  return (
    <Container {...rest}>
      {children}
      {/* Renderiza o conteúdo (texto ou elementos) passado como `children` dentro do botão */}
    </Container>
  );
};

export default Button;
// Exporta o componente `Button` como padrão para ser utilizado em outras partes da aplicação