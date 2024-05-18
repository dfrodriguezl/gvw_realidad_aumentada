// Dashboard.js
import React, { useState } from 'react';
import BarChartNivo from '../components/charts/barNivo';
import PieChartNivo from '../components/charts/pieNivo';


const DashboardPanel = () => {

  return (
    <div className="dashboard__container">
      <div className="dashboard_title">
        <h1 className='dashboard_h1'>Educación y Primera Infancia | </h1>
        <h2 className='dashboard_h2'> Alfabetismo 15 y más</h2>
      </div>
      <div className='dashboard_containerBlocks'>
				<ul class="dashboard_blocks">
					<li class="block"><BarChartNivo /></li>
					<li class="block"><PieChartNivo /></li>
					<li class="block"><BarChartNivo /></li>
					<li class="block"><PieChartNivo /></li>
				</ul>
      </div>
    </div>
  );
};

export default DashboardPanel;