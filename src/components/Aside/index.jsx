import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import {
  AiOutlineHome,
  AiOutlineUserAdd,
  AiOutlineFolderOpen,
  AiOutlineBarChart
} from 'react-icons/ai';
import { FaSignOutAlt } from 'react-icons/fa';

const Aside = ({ isClosed, menuAberto, closeMobileMenu }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Erro no logout:', error);
      localStorage.clear();
      sessionStorage.clear();
      toast.error('Sessão encerrada');
      navigate('/login', { replace: true });
    }
  };

  const navLinks = [
    { to: "/dashboard", icon: <AiOutlineHome size={22} />, text: "Dashboard" },
    { to: "/novocadastro", icon: <AiOutlineUserAdd size={22} />, text: "Novo Cadastro" },
    { to: "/registros", icon: <AiOutlineFolderOpen size={22} />, text: "Registros" },
    { to: "/relatorios", icon: <AiOutlineBarChart size={22} />, text: "Relatórios" },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-sm
        md:relative md:shadow-none
        ${menuAberto ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${isClosed ? 'md:w-20' : 'md:w-64'}
        w-64 shrink-0
      `}
    >
      <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden flex flex-col px-3">
        <nav className="space-y-2 flex-1 mt-4">
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              title={isClosed ? link.text : ""}
              onClick={closeMobileMenu}
              className={({ isActive }) => `
                flex items-center px-3 py-3 rounded-lg transition-colors group relative
                ${isActive ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                ${isClosed ? 'justify-center' : 'justify-start'}
              `}
            >
              <div className={`${isClosed ? 'mx-auto' : 'mr-4'}`}>
                {link.icon}
              </div>
              <span className={`whitespace-nowrap transition-opacity duration-300 ${isClosed ? 'opacity-0 hidden' : 'opacity-100 block'}`}>
                {link.text}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto pt-6 pb-2">
          <button
            onClick={handleLogout}
            title={isClosed ? "Sair" : ""}
            className={`
              w-full flex items-center px-3 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200
              ${isClosed ? 'justify-center' : 'justify-start'}
            `}
          >
            <div className={`${isClosed ? 'mx-auto' : 'mr-4'} shrink-0`}>
              <FaSignOutAlt size={22} />
            </div>
            <span className={`whitespace-nowrap font-medium transition-opacity duration-300 ${isClosed ? 'opacity-0 hidden' : 'opacity-100 block'}`}>
              Sair
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Aside;
