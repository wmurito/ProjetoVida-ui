import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Aside from "../Aside";
import Content from "../Content";
import { Grid } from "./styles";

const Layout = () => {
    // Estado para controlar se o menu lateral está recolhido ou não
    const [isAsideCollapsed, setAsideCollapsed] = useState(false);

    // Função para alternar o estado
    const handleToggleAside = () => {
        setAsideCollapsed(!isAsideCollapsed);
    };

    return (
        // Passamos o estado para o Grid ajustar o layout
        <Grid $isAsideCollapsed={isAsideCollapsed}>
            <Aside 
                isCollapsed={isAsideCollapsed} 
                toggleAside={handleToggleAside} 
            />
            <Content>
                <Outlet />
            </Content>
        </Grid>
    );
};

export default Layout;