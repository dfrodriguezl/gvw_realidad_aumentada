// Dashboard.js
import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import { variables } from '../base/variables';

const Dashboard = () => {
  const [selectedSurvey, setSelectedSurvey] = useState("Encuesta1");

  const handleSurveyChange = (survey) => {
    setSelectedSurvey(survey);
  };

  return (
    <div className="dashboard__container">
      <div className="title">
        <h1>Dashboard de {selectedSurvey}</h1>
      </div>
      

      {/* Widgets con información de la encuesta */}
      <div className="widgets__container">
        <Paper elevation={6} className="widget" survey={selectedSurvey}>
          <h2> Manzanas marco operativo</h2>
          <p> 9012</p>
        </Paper>

        <Paper elevation={6} className="widget" survey={selectedSurvey}>
          <h2> Manzanas sincronizadas</h2>
          <p> 9012</p>
        </Paper>

        <Paper elevation={6} className="widget" survey={selectedSurvey}>
          <h2> Puntos barrido transmitidos</h2>
          <p> 9012</p>
        </Paper>

        <Paper elevation={6} className="widget" survey={selectedSurvey}>
          <h2> Puntos barrido sincronizadas</h2>
          <p> 9012</p>
        </Paper>
      </div>

      <div className="summary__container">
        {/* Cards con gráficos */}
        <div className="cards__container" survey={selectedSurvey}>
          <Card className="card" >
            <h3>Condición de Ocupación</h3>
          </Card>
          <Card className="card">
            <h3>Condición de Ocupación</h3>
          </Card>
          <Card className="card" >
            <h3>Condición de Ocupación</h3>
          </Card>
          <Card className="card" >
            <h3>Condición de Ocupación</h3>
          </Card>
        </div>

        {/* Histograma de resumen */}
        <div className="graph__container">
          <h3>Manzanas sincronizadas</h3>
        </div>

      </div>      
    </div>
  );
};

export default Dashboard;