import React from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import logo from '../../assets/logo.png';

const Header = ({ isAsideClosed, toggleAside }) => {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm z-30 relative shrink-0 h-16">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleAside}
                    className="p-2 -ml-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
                    aria-label="Toggle Menu"
                >
                    <AiOutlineMenu size={24} />
                </button>
            </div>
            <div className="h-8">
                <img src={logo} alt="Logo Projeto Vida" className="h-full object-contain" />
            </div>
        </header>
    );
};

export default Header;
