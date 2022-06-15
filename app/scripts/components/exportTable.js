// Botón para exportar datos de tabla a formato csv

import React from "react";

const ExportTable = (props) => {
  const { exportar } = props;

  return (
    <div className="btnContainer">
      <button className="btnContainer__btn" id="upload__linkBtn" onClick={exportar}>
        <div className="btnContainer__icon">
          <span className="DANE__Geovisor__icon__download"></span>
        </div>
        <p className="btnContainer__name">Exportar .CSV</p>
      </button>
    </div>
  )
}

export default ExportTable;