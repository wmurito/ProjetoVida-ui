import React from "react";
import { Outlet } from "react-router-dom"; // Importa o Outlet
import Aside from "../Aside";
import Header from "../Header";
import Content from "../Content";
import { Grid } from "./styles";

const Layout = () => {
    return (
        <Grid>
            <Header />
            <Aside />
            <Content>
                <Outlet /> 
                {/* Renderiza as rotas filhas aqui */}
                {/* Outlet é específico para renderizar rotas filhas do React Router. */}
            </Content>
        </Grid>
    );
};

export default Layout;
