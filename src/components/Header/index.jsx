import React from 'react';
import { Container, Logo, ToggleButton } from './styles';
import { AiOutlineMenu } from 'react-icons/ai';
import logo from '../../assets/logo.png';

// Recebe a função para controlar o menu e o estado atual dele
const Header = ({ isAsideClosed, toggleAside }) => {
    return (
        <Container>
            <ToggleButton onClick={toggleAside}>
                <AiOutlineMenu />
            </ToggleButton>
            <Logo src={logo} alt="Logo Projeto Vida" />
        </Container>
    );
};

export default Header;