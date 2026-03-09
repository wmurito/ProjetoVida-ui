import React from 'react';
import AreaCards from "../../components/Dashboard/AreaCards";
import AreaCharts from "../../components/Dashboard/AreaCharts";

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1600px] mx-auto animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard de Pacientes</h1>
          <p className="text-slate-500 text-sm mt-1">Visão geral das estatísticas clínicas e oncológicas.</p>
        </div>
      </div>

      <div className="w-full">
        <AreaCards />
      </div>

      <div className="w-full">
        <AreaCharts />
      </div>
    </div>
  );
};

export default Dashboard;
