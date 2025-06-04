import React from 'react';
import AreaCards from "../../components/Dashboard/AreaCards";
import AreaCharts from "../../components/Dashboard/AreaCharts";
import './Dashboards.scss';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <section className="dashboard-layout">
      <div className="dashboard-main">
          <AreaCards />
        </div>
        <div className="dashboard-main">
          <AreaCharts />
        </div>
       
      </section>
    </div>
  );
};

export default Dashboard;
