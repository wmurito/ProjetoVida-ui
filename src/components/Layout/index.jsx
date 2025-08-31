import React from "react";
import { Outlet } from "react-router-dom";
import Aside from "../Aside";
import Content from "../Content";
import { Grid } from "./styles";

const Layout = () => {
    return (
        <Grid>
            <Aside />
            <Content>
                <Outlet />
            </Content>
        </Grid>
    );
};

export default Layout;