import React from "react";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Registros from "../pages/Registros";

const AppRoutes = () => {
  return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}/>
        <Route path="/registros" element={<Registros />}/>
      </Routes>
  );
};
export default AppRoutes;