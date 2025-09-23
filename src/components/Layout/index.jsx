import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header'; // Importa o novo Header
import Aside from '../Aside';
import { Grid, Main } from './styles';

const Layout = () => {
  const [isAsideClosed, setIsAsideClosed] = useState(false);

  const toggleAside = () => {
    setIsAsideClosed(prevState => !prevState);
  };

  return (
    <Grid>
      {/* Renderiza o Header, passando o controle do menu */}
      <Header isAsideClosed={isAsideClosed} toggleAside={toggleAside} />
      
      {/* O Aside continua recebendo o estado para controlar sua largura */}
      <Aside isClosed={isAsideClosed} />
      
      {/* O Main ajusta sua margem com base no estado do Aside */}
      <Main $isAsideClosed={isAsideClosed}>
        <Outlet />
      </Main>
    </Grid>
  );
};

export default Layout;