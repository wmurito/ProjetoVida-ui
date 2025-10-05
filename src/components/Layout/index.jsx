import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Aside from '../Aside';
import { Grid, Main, MobileOverlay } from './styles';

const Layout = () => {
  const [isAsideClosed, setIsAsideClosed] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleAside = () => {
    const isMobile = window.innerWidth <= 768;
    console.log('Toggle clicked, isMobile:', isMobile, 'menuAberto:', menuAberto);
    if (isMobile) {
      setMenuAberto(prev => !prev);
    } else {
      setIsAsideClosed(prev => !prev);
    }
  };

  const closeMobileMenu = () => {
    if (window.innerWidth <= 768) {
      setMenuAberto(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuAberto(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Grid>
      <Header isAsideClosed={isAsideClosed} toggleAside={toggleAside} />
      <Aside isClosed={isAsideClosed} $menuAberto={menuAberto} />
      <MobileOverlay $show={menuAberto} onClick={closeMobileMenu} />
      <Main $isAsideClosed={isAsideClosed}>
        <Outlet />
      </Main>
    </Grid>
  );
};

export default Layout;