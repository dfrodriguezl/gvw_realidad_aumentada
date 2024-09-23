import React from 'react';

const Descarga = () => {
  return (
    <a className="navBar__link" rel="noreferrer" href="https://geoportal.dane.gov.co/servicios/descarga-y-metadatos/datos-geoestadisticos/?cod=4" target="_blank">
      <div className="navBar__icon">
        <span className="DANE__Geovisor__icon__download"></span>
      </div>
      <p className="navBar__iconName">Descarga</p>
    </a>
  );
}

export default Descarga;
