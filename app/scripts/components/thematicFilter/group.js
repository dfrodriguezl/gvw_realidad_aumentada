// ACORDION GRUPO - CONFIGURACION Y MAQUETA DE ACORDION PARA QUE MUESTRE LOS GRUPOS DEL VISOR DESDE BASE DE DATOS
import React, { useState } from "react";
import { variables } from "../../base/variables";

const NavButton = ({ temaTematica, click, btn }) => {

  variables.visualThematic = function (target) {
    // console.log(target)

    if (target == "ver__mas") {
      setVerMas(false);
      variables.visualGroup(false);
    } else if (target == "ver__menos") {
      setVerMas(true);
      variables.visualGroup(true);
    }
    else {
      variables.visualGroup(true);
      setVerMas(true);
    }
  }

  const [verMas, setVerMas] = useState(true);
  const botones = Object.values(temaTematica.GRUPOS).map((result, index) => {
    const ariaExpanded = result[0].COD_GRUPO === btn ? "--active" : "";

    return (
      <li id={result[0].COD_GRUPO} key={result[0].COD_GRUPO}
        className={`filter__thematicGroup__item ${result[0].COD_GRUPO} ${ariaExpanded}`}
        onClick={click}
      >
        <div id={result[0].COD_GRUPO} key={result[0].COD_GRUPO}
          className={`filter__thematicGroup__icon ${result[0].CLASE_COLOR}`}>
          <span id={result[0].COD_GRUPO} key={result[0].COD_GRUPO}
            className={result[0].CLASE_ICONO}></span>
        </div>
        <p className="filter__thematicGroup__name"> {result[0].GRUPO}</p>
      </li>
    )
  });

  return (
    <div className="filter__thematic">
      {verMas && <div className="filter__thematicGroup">
        <ul className="filter__thematicGroup__list">
          {botones}
        </ul>
      </div>}
      {!verMas && <div className="filter__thematicGroup --filtros  --visibleGroupPrincipal">
        <ul className="filter__thematicGroup__list">
          {botones}
        </ul>
      </div>}
    </div>
  );
};

export default NavButton;
