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
    // let layer = variables.capas['deptos_vt'];
    // layer.setVisible(true);
    let layer_2 = variables.capas['mpios_vt'];
    layer_2.setVisible(true);
    // variables.layers["departamentos"]["visible"] = true;
    // variables.layers["departamentos"]["checked"] = true;
    variables.layers["municipios"]["visible"] = true;
    variables.layers["municipios"]["checked"] = true;
    // variables.unidadesDepto.setVisible(false);
    // variables.layers["centroides_depto"]["visible"] = false;
    // variables.layers["centroides_depto"]["checked"] = false;
    variables.unidadesMpio.setVisible(false);
    variables.layers["centroides_mpio"]["visible"] = false;
    variables.layers["centroides_mpio"]["checked"] = false;
    if(variables.hideProportionalSymbols !== null){
      variables.hideProportionalSymbols(true);
    }
  }

  const change2Symbols = () => {
    localStorage.setItem("visualization", "symbols");
    let layer = variables.capas['deptos_vt'];
    layer.setVisible(false);
    let layer_2 = variables.capas['mpios_vt'];
    layer_2.setVisible(false);
    variables.layers["departamentos"]["visible"] = false;
    variables.layers["departamentos"]["checked"] = false;
    variables.layers["municipios"]["visible"] = false;
    variables.layers["municipios"]["checked"] = false;
    variables.unidadesDepto.setVisible(true);
    variables.layers["centroides_depto"]["visible"] = true;
    variables.layers["centroides_depto"]["checked"] = true;
    variables.unidadesMpio.setVisible(true);
    variables.layers["centroides_mpio"]["visible"] = true;
    variables.layers["centroides_mpio"]["checked"] = true;
    if(variables.hideProportionalSymbols !== null){
      variables.hideProportionalSymbols(false);
    }
  }

  variables.updateSymbols = () => {
    // toggleThemeChange();
    change2Chropleths();
  }

  variables.updateProps = () => {
    // toggleThemeChange();
    change2Symbols();
  }

  return (
    <div className="tools__panel">
      <div className="custom__panel">
        <p className="tools__text_big">Tipo de simbología a visualizar</p>
        <div className="custom">
          <p className="custom__text_big"> Símbolos proporcionales </p>
          <label className="custom__content">
            <input
              className="custom__input"
              type="checkbox"
              defaultChecked={checked}
              onChange={() => toggleThemeChange()}
            />
            <span className="custom__slider" />
          </label>
          <p className="custom__text_big"> Coropletas </p>
        </div>
      </div>
    </div>
  )
}

export default TipoVisualizacion;