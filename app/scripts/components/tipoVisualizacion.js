// Componente para activar o desactivar el modo oscuro

import React, { useState, useEffect } from 'react';
import { variables } from '../base/variables';

const TipoVisualizacion = () => {
  const [checked, setChecked] = useState(localStorage.getItem("visualization") === "symbols" ? false : true);
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
    } else {
      change2Symbols();
      setChecked(false);
    }
  }

  const change2Chropleths = () => {
    localStorage.setItem("visualization", "choropleth");
    let layer = variables.capas['deptos_vt'];
    layer.setVisible(true);
    variables.layers["departamentos"]["visible"] = true;
    variables.layers["departamentos"]["checked"] = true;
    variables.unidadesDepto.setVisible(false);
    variables.layers["centroides_depto"]["visible"] = false;
    variables.layers["centroides_depto"]["checked"] = false;
  }

  const change2Symbols = () => {
    localStorage.setItem("visualization", "symbols");
    let layer = variables.capas['deptos_vt'];
    layer.setVisible(false);
    variables.layers["departamentos"]["visible"] = false;
    variables.layers["departamentos"]["checked"] = false;
    variables.unidadesDepto.setVisible(true);
    variables.layers["centroides_depto"]["visible"] = true;
    variables.layers["centroides_depto"]["checked"] = true;
  }

  return (
    <div className="tools__panel">
      <div className="custom__panel">
        <p className="tools__text">Tipo de mapa a visualizar</p>
        <div className="custom">
          <p className="custom__text"> Simbolos proporcionales </p>
          <label className="custom__content">
            <input
              className="custom__input"
              type="checkbox"
              defaultChecked={checked}
              onChange={() => toggleThemeChange()}
            />
            <span className="custom__slider" />
          </label>
          <p className="custom__text"> Coropletas </p>
        </div>
      </div>
    </div>
  )
}

export default TipoVisualizacion;