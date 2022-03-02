// Componente para activar o desactivar el modo oscuro

import React, { useState, useEffect } from 'react';
import { variables } from '../base/variables';

const Custom = () => {
  const [checked, setChecked] = useState(localStorage.getItem("theme") === "light" ? true : false);
  useEffect(() => {
    document
      .getElementsByTagName("HTML")[0]
      .setAttribute("data-theme", localStorage.getItem("theme"));
    if (variables.updateCharTheme != null) {
      variables.updateCharTheme();
    }

  }, []);

  const toggleThemeChange = () => {
    ;
    if (checked === false) {
      localStorage.setItem("theme", "light");
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", localStorage.getItem("theme"));
      setChecked(true);
      if (variables.updateCharTheme != null) {
        variables.updateCharTheme();
      }
    } else {
      localStorage.setItem("theme", "dark");
      document
        .getElementsByTagName("HTML")[0]
        .setAttribute("data-theme", localStorage.getItem("theme"));
      setChecked(false);
      if (variables.updateCharTheme != null) {
        variables.updateCharTheme();
      }
    }
  }

  return (
    <div className="tools__panel">
      <h3 className="tools__title"> Personalizar</h3>
      <div className="custom__panel">
        <p className="tools__text">Active o desactive el tipo de vista que desea</p>
        <div className="custom">
          <p className="custom__text"> Oscura </p>
          <label className="custom__content">
            <input
              className="custom__input"
              type="checkbox"
              defaultChecked={checked}
              onChange={() => toggleThemeChange()}
            />
            <span className="custom__slider" />
          </label>
          <p className="custom__text"> Clara </p>
        </div>
      </div>
    </div>
  )
}

export default Custom;