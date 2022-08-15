import React, { useState, useEffect, useContext, useLayoutEffect, Fragment } from "react";
import { variables } from '../base/variables';
import ProportionalSymbol from "./proportionalSymbol";

const Leyenda = () => {
  // const [tema, setTema] = React.useState("Educación");
  // const [subtema, setSubtema] = React.useState("Alfabetismo 15 y más");
  const [legend, setLegend] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState("");
  const [transparency, setTransparency] = useState(variables.tansparency);
  const [propSymbol, setPropSymbol] = useState(false);

  // console.log(legend)
  // console.log(variables.tematica)

  const leyenda = (legend)
    .map((item, index) => {
      return (
        item[3] === "visible" ? <li className="legend__panel__list__item" key={index}>
          <canvas className="legend__panel__list__item__square" style={{ background: item[0] }}></canvas>
          <p className="legend__panel__list__item__name"> {item[2]}</p>
        </li> : null
      )
    });

  variables.changeLegend = function (nivel) {
    // console.log(variables.coloresLeyend)
    // setTema(variables.tematica["GRUPOS"][variables.varVariable.substring(0, 3)][0]["GRUPO"]);
    // setSubtema(variables.tematica["SUBGRUPOS"][variables.varVariable.substring(0, 5)][0]["SUBGRUPO"]);
    setLegend(variables.coloresLeyend[variables.varVariable][nivel])
    setCategoria(variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"])
    setUnidad(variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"])
  }

  // Función para cambiar transparencia de la capa, y guardar su estado
  function changeSlider(e) {
    let value = e.target.value;
    let transparencia = value / 10;
    // console.log(transparencia)
    let layerdpto = variables.capas['deptos_vt'];
    let layermpios = variables.capas['mpios_vt'];
    // let layermzn = variables.capas["mzn_vt"];
    layerdpto.setOpacity(transparencia);
    layermpios.setOpacity(transparencia);
    variables.tansparency = transparencia
    setTransparency(transparencia)
  }

  variables.hideProportionalSymbols = (hide) => {
    if (hide) {
      setPropSymbol(true);
    } else {
      setPropSymbol(false);
    }
  }

  return (
    <div className="legend">
      {/* <h2 className="result__top__title result__tema"  id="title"> {tema} - {subtema} - {categoria}</h2> */}
      <h2 className="legend__slider__text" id="title">{categoria}</h2>
      <h3 className="legend__value">({unidad})</h3>
      <ul className="legend__panel__list">
        {leyenda}
      </ul>
      {/* <h5>Los colores más oscuros en la leyenda corresponden a los rangos más altos </h5> */}
      <div className="legend__slider">
        <p className="legend__slider__text" >Nivel de transparencia (Mapa)</p>
        <div className="legend__slider__content">
          <p className="legend__slider__num" >0%</p>
          <label className="legend__scrollMain" htmlFor="scroll">
            <input id="scroll" type="range" className="legend__scroll" min="1" max="10" step="1" defaultValue={transparency} onChange={changeSlider}></input>
          </label>
          <p className="legend__slider__num" >100%</p>
        </div>
      </div>

      {!propSymbol ?
        <Fragment>
          <h2 className="legend__slider__text" id="title">Símbolos</h2>
          <h3 className="legend__value"><ProportionalSymbol /></h3>

        </Fragment>
        : null}

    </div>
  );
}

export default Leyenda;
