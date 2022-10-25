// Componente para activar o desactivar el tipo de visualización

import React, { useState, useEffect } from 'react';
import { variables } from '../base/variables';

const TipoVisualizacion = () => {
  const [checked, setChecked] = useState(localStorage.getItem("visualization") === "symbols" ? false : true);
  const [textActive, setTextActive] = useState(localStorage.getItem("visualization") === "symbols" ? 0 : 1);
  const [disabledSlide, setDisabledSlide] = useState(false);

  useEffect(() => {
    if (!checked) {
      change2Symbols();
    } else {
      change2Chropleths();
    }
  }, []);

  const toggleThemeChange = () => {
    if (!checked) {
      change2Chropleths();
      setChecked(true);
      setTextActive(1);
    } else {
      change2Symbols();
      setChecked(false);
      setTextActive(0);
    }
  }

  const change2Chropleths = () => {
    localStorage.setItem("visualization", "choropleth");
    let layer_2 = variables.capas['mpios_vt'];
    layer_2.setVisible(true);
    variables.layers["municipios"]["visible"] = true;
    variables.layers["municipios"]["checked"] = true;
    variables.unidadesMpio.setVisible(false);
    variables.layers["centroides_mpio"]["visible"] = false;
    variables.layers["centroides_mpio"]["checked"] = false;
    if(variables.hideProportionalSymbols !== null){
      variables.hideProportionalSymbols(true);
    }
  }

  const change2Symbols = () => {
    localStorage.setItem("visualization", "symbols");
    let layer_2 = variables.capas['mpios_vt'];
    layer_2.setVisible(false);
    variables.layers["municipios"]["visible"] = false;
    variables.layers["municipios"]["checked"] = false;
    variables.unidadesMpio.setVisible(true);
    variables.layers["centroides_mpio"]["visible"] = true;
    variables.layers["centroides_mpio"]["checked"] = true;
    if(variables.hideProportionalSymbols !== null){
      variables.hideProportionalSymbols(false);
    }
  }

  variables.updateSymbols = () => {
    setChecked(true);
    setTextActive(1);
    change2Chropleths();
    setDisabledSlide(true);    
  }

  variables.updateToProps = () => {
    setChecked(false);
    setTextActive(0);
    change2Symbols();
    setDisabledSlide(false);    
  }

  return (
    <div className="tools__panel">
      <div className="custom__panel">
        <p className="tools__text">Tipo de simbología a visualizar</p>
        <div className="custom">
          <p className={textActive === 0 ? "custom__text_big custom__activeText" : "custom__text_big"}> Símbolos proporcionales </p>
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
          <p className={textActive === 1 ? "custom__text_big custom__activeText" : "custom__text_big"}> Coropletas </p>
        </div>
      </div>
    </div>
  )
}

export default TipoVisualizacion;