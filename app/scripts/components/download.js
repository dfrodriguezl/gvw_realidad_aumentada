import React,{Component} from 'react';

const Descarga=()=> {
    return (
      <a className= "navBar__link" rel="noreferrer" href="https://geoportal.dane.gov.co/servicios/descarga-y-metadatos/visor-descarga-conteo/"  target="_blank">
          <div className="navBar__icon">
              <span className="DANE__Geovisor__icon__download"></span>
          </div>
          <p className="navBar__iconName">Descarga</p>
      </a>
    );
  }

export default Descarga;
