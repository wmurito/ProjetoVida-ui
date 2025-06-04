import React from 'react';
import { Container } from './styles'; // Certifique-se de que o estilo está configurado corretamente

const Input = ({ ...rest }) => {
  return <Container {...rest} />;
};

export default Input;
