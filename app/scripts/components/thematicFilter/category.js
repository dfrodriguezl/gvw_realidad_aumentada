// ACORDION VARIABLES - CONFIGURACION Y MAQUETA DE ACORDION PARA QUE MUESTRE LAS VARIABLES DEL SUBGRUPO DESDE BASE DE DATOS
import React from "react";
import { variables } from "../../base/variables";

const AccordionItem = ({
  tematica,
  categoria,
  index,
  click,
  btn
}) => {

  return (
    <li id={categoria.COD_CATEGORIA}
      key={categoria.COD_CATEGORIA}
      className={`filter__thematicVariable__item ${categoria.COD_CATEGORIA} ${btn == categoria.COD_CATEGORIA ? "--active" : ""}`}
      onClick={click}
      >
      <div className="filter__thematicVariable__radio">
        <span className="DANE__Geovisor__icon__radioButton"></span>
      </div>
        <p className="filter__thematicVariable__value">
        {categoria.CATEGORIA}
      </p>
        <div id={categoria.COD_CATEGORIA} key={categoria.COD_CATEGORIA} 
          className="filter__thematicVariable__icon" style={{ background: "rgba" + categoria.COLOR }} >
        <span className={variables.tematica["GRUPOS"][variables.varVariable.substring(0, 3)][0]["CLASE_ICONO"]} ></span>
      </div>
    </li>
  )
}
export default AccordionItem;
