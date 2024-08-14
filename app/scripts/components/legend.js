import React, { useEffect, useState } from "react";
import { variables } from '../base/variables';


const Leyenda = () => {
  const [legend, setLegend] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState("");
  const [transparencyGeneral, settransparencyGeneral] = useState(variables.transparencyGeneral);

  useEffect(() => {
    if (variables.coloresLeyend[variables.varVariable] != undefined) {
      setLegend(variables.coloresLeyend[variables.varVariable]["MNZN"])
    }
  }, [legend])

  variables.changeLegend = function (nivel) {
    setCategoria(variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"])
    setUnidad(variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"])

    if (variables.coloresLeyend[variables.varVariable] != undefined) {
      console.log("COLORES LEYEND NIVEL", variables.coloresLeyend[variables.varVariable][nivel]);
      setLegend([...variables.coloresLeyend[variables.varVariable][nivel]])
    }
  }

  // Función para cambiar transparencia de la capas, y guardar su estado
  function changeSlider(e) {
    let value = e.target.value;
    let transparencia = value / 10;
    settransparencyGeneral(value);

    const capaManzana = "manzanas2022";
    const capaDepto = "deptos_vt";
    const capaMunicipio = "mpios_vt";

    variables.map.setPaintProperty(capaManzana, 'fill-extrusion-opacity', transparencia);
    variables.map.setPaintProperty(capaDepto, 'fill-extrusion-opacity', transparencia);
    variables.map.setPaintProperty(capaMunicipio, 'fill-extrusion-opacity', transparencia);

  }

  return (
    <div className="legend">
      <h2 className="legend__slider__text" id="title">{categoria}</h2>
      <h3 className="legend__value">({unidad})</h3>
      <ul className="legend__panel__list">
        {legend.map((item, index) => {
          return (
            item[3] === "visible" ? <li className="legend__panel__list__item" key={index}>
              <canvas className="legend__panel__list__item__square" style={{ background: item[0] }}></canvas>
              <p className="legend__panel__list__item__name"> {item[2]}</p>
            </li> : null
          )
        }, [])}
      </ul>
      <div className="legend__slider">
        <p className="legend__slider__text" >Nivel de transparencia (Capa)</p>
        <div className="legend__slider__content">
          <p className="legend__slider__num" >0%</p>
          <label className="legend__scrollMain" htmlFor="scroll">
            <input id="scroll" type="range" className="legend__scroll" min="1" max="10" step="1" defaultValue={transparencyGeneral} onChange={changeSlider}></input>
          </label>
          <p className="legend__slider__num" >100%</p>
        </div>
      </div>

    </div>
  );
}

export default Leyenda;
