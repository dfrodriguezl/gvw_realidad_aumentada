// Componente para activar o desactivar el tipo de visualización

import React, { useState, useEffect } from 'react';
import { variables } from '../base/variables';

const TipoVisualizacion = () => {
  const [checked, setChecked] = useState(localStorage.getItem("visualization") === "symbols" ? false : true);
  const [textActive, setTextActive] = useState(localStorage.getItem("visualization") === "symbols" ? 0 : 1);
  const [disabledSlide, setDisabledSlide] = useState(false);
  const [vistaActiva, setVistaActiva] = useState("3D");

  useEffect(() => {
    if (!checked) {
      change3D();
    } else {
      change2D();
    }
  }, []);

  const toggleThemeChange = () => {
    if (!checked) {
      change2D();
      setChecked(true);
      setTextActive(1);
    } else {
      change3D();
      setChecked(false);
      setTextActive(0);
    }
  }

  const change2D = () => {
    if (variables.map != null) {
      variables.map.setPaintProperty('deptos_vt', 'fill-extrusion-height', ["*", 0, ["feature-state", "valor"]]);
      variables.map.setPaintProperty('mpios_vt', 'fill-extrusion-height', ["*", 0, ["feature-state", "valor"]]);
      variables.map.setPaintProperty('manzanas2022', 'fill-extrusion-height', ["*", 0, ["get", "viviendas"]]);
      variables.map.setPitch(0);
      variables.map.setLayoutProperty('markers-layer', 'visibility', 'none');
    }
  }

  const change3D = () => {
    if (variables.map != null) {
      variables.map.setPaintProperty('deptos_vt', 'fill-extrusion-height', ["*", 0.1, ["to-number", ["feature-state", "valor"]]]);
      variables.map.setPaintProperty('mpios_vt', 'fill-extrusion-height', ["*", 0.05, ["to-number", ["feature-state", "valor"]]]);
      variables.map.setPaintProperty('manzanas2022', 'fill-extrusion-height', ["*", 1, ["get", "viviendas"]]);
      variables.map.setPitch(30);
      variables.map.setLayoutProperty('markers-layer', 'visibility', 'none');
    }
  }

  const changeAR = () => {
    if (variables.map != null) {
      variables.map.setLayoutProperty('markers-layer', 'visibility', 'visible');
    }
  }

  const handleClick = (vista) => {
    setVistaActiva(vista)

    if (vista === "3D") {
      change3D();
    } else if (vista === "2D") {
      change2D();
    } else if (vista === "AR") {
      changeAR();
    }
  }

  return (
    <div className="tools__panel">
      <div className="custom__panel">
        <div className="custom custom-visualizacion-container">
          <div className={`navBar__list__item__btn_mode ${vistaActiva === "3D" ? "--active" : "--inactive"}`} onClick={() => handleClick("3D")}>
            <div className="filter__thematicGroup__icon">
              <span className="texto-button">3D</span>
            </div>
          </div>
          <div className={`navBar__list__item__btn_mode ${vistaActiva === "2D" ? "--active" : "--inactive"}`} onClick={() => handleClick("2D")}>
            <div className="filter__thematicGroup__icon">
              2D
            </div>
          </div>
          <div className={`navBar__list__item__btn_mode ${vistaActiva === "AR" ? "--active" : "--inactive"}`} onClick={() => handleClick("AR")}>
            <div className="filter__thematicGroup__icon">
              AR
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TipoVisualizacion;