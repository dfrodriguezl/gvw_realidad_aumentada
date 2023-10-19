// Componente para activar o desactivar el tipo de visualización

import React, { useState, useEffect } from 'react';
import { variables } from '../base/variables';

const TipoVisualizacion = () => {
  const [checked, setChecked] = useState(localStorage.getItem("visualization") === "symbols" ? false : true);
  const [textActive, setTextActive] = useState(localStorage.getItem("visualization") === "symbols" ? 0 : 1);
  const [disabledSlide, setDisabledSlide] = useState(false);

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
    if(variables.map != null){
      variables.map.setPaintProperty('manzanas', 'fill-extrusion-height', ["*", 0, ["get", "viv"]]);
      variables.map.setPaintProperty('manzanas2022', 'fill-extrusion-height', ["*", 0, ["get", "viviendas"]]);
      variables.map.setPaintProperty('secciones', 'fill-extrusion-height', ["*", 0, ["get", "secr_viv"]]);
      variables.map.setPaintProperty('manzanasVariacion', 'fill-extrusion-height', ["*", 0, ["get", "variacion"]]);
      variables.map.setPaintProperty('manzanasVariacion2022', 'fill-extrusion-height', ["*", 0, ["get", "variacion"]]);
      variables.map.setPaintProperty('secciones2022', 'fill-extrusion-height', ["*", 0, ["get", "secr_viv"]]);
      variables.map.setPitch(0);
    }
  }

  const change3D = () => {
    if(variables.map != null){
      variables.map.setPaintProperty('manzanas', 'fill-extrusion-height', ["*", 1, ["get", "viv"]]);
      variables.map.setPaintProperty('manzanas2022', 'fill-extrusion-height', ["*", 1, ["get", "viviendas"]]);
      variables.map.setPaintProperty('secciones', 'fill-extrusion-height', ["*", 1, ["get", "secr_viv"]]);
      variables.map.setPaintProperty('manzanasVariacion', 'fill-extrusion-height', ["*", 1, ["get", "variacion"]]);
      variables.map.setPaintProperty('manzanasVariacion2022', 'fill-extrusion-height', ["*", 0, ["get", "variacion"]]);
      variables.map.setPaintProperty('secciones2022', 'fill-extrusion-height', ["*", 1, ["get", "secr_viv"]]);
      variables.map.setPitch(60);
    }
  }


  // variables.updateSymbols = () => {
  //   // setChecked(true);
  //   setTextActive(1);
  //   change3D();
  //   setDisabledSlide(true);    
  // }

  // variables.updateToProps = () => {
  //   // setChecked(false);
  //   setTextActive(0);
  //   change2D();
  //   setDisabledSlide(false);    
  // }

  return (
    <div className="tools__panel">
      <div className="custom__panel">
        <p className="tools__text">Tipo de visualización</p>
        <div className="custom">
          <p className={textActive === 0 ? "custom__text_big custom__activeText" : "custom__text_big"}> 3D </p>
          <label className="custom__content">
            <input
              className="custom__input"
              type="checkbox"
              checked={checked}
              onChange={() => toggleThemeChange()}
              disabled={disabledSlide}
            />
            <span className="custom__slider" />
          </label>
          <p className={textActive === 1 ? "custom__text_big custom__activeText" : "custom__text_big"}> 2D </p>
        </div>
      </div>
    </div>
  )
}

export default TipoVisualizacion;