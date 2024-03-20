import React from "react";

const LeyendaCluster = () => {

  return (
    <div className="legend">
      <div className="legend__item">
        <span className="circle">25</span>
        <p className="circle__text">Agrupación de edificaciones con unidades económicas</p>
      </div>
      <div className="legend__item">
        <img className="cluster" src="./img/gps-cyan.png" alt="Clúster"></img>
        <p className="circle__text">Edificaciones con unidades económicas</p>
      </div>
    </div>
  );
}

export default LeyendaCluster;
