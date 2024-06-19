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

  const handleClickPanel = (e) => {
    const target = e.currentTarget.id;
    variables.visualThematic(target);
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

  const Plus = () => {
    let claseActiva = "filter__thematicGroup__moreText --seemore";
    let claseInactiva = "filter__thematicGroup__moreText";

    return (
      <>
        {verMas && <div className="filter__thematicGroup__more" id="ver__mas" onClick={handleClickPanel}>
          <div className="filter__thematicGroup__moreIcon" >
            <span className="filter__thematicGroup__moreLine"></span>
            <span className="filter__thematicGroup__moreLine"></span>
            <span className="filter__thematicGroup__moreLine"></span>
          </div>
          <p className={claseActiva} id="ver__mas">Ver más</p>
        </div>}
        {!verMas && <div className="filter__thematicGroup__more" id="ver__menos" onClick={handleClickPanel}>
          <div className="filter__thematicGroup__moreIcon">
            <span className="filter__thematicGroup__moreLine"></span>
            <span className="filter__thematicGroup__moreLine"></span>
            <span className="filter__thematicGroup__moreLine"></span>
          </div>
          <p className={claseInactiva} >Volver</p>
        </div>}
      </>
    )
  }

  return (
    <div className="filter__thematic">
      {verMas && <div className="filter__thematicGroup">
        <ul className="filter__thematicGroup__list">
          {botones}
        </ul>
        <Plus />
      </div>}
      {!verMas && <div className="filter__thematicGroup --filtros  --visibleGroupPrincipal">
        <ul className="filter__thematicGroup__list">
          {botones}
        </ul>
        <Plus />
      </div>}
    </div>
  );
};

export default NavButton;
