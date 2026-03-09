import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Aside from '../Aside';

const Layout = () => {
  const [isAsideClosed, setIsAsideClosed] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleAside = () => {
    const isMobile = window.innerWidth <= 768;
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
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900 overflow-hidden w-full">
      <Aside isClosed={isAsideClosed} menuAberto={menuAberto} closeMobileMenu={closeMobileMenu} />

      {/* Mobile Overlay */}
      {menuAberto && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={closeMobileMenu}
        />
      )}

      <div className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 w-full relative">
        <Header isAsideClosed={isAsideClosed} toggleAside={toggleAside} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-4 md:p-6 pb-20 md:pb-6 relative w-full h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;