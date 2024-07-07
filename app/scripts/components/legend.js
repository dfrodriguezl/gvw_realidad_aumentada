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
    let layers = variables.layers;
    settransparencyGeneral(value);

    const layerManzanas = Object.values(layers).filter((o) => o.id === "manzanas")[0];
    const layerManzanas2022 = Object.values(layers).filter((o) => o.id === "manzanas2022")[0];
    const layerManzanasVariacion = Object.values(layers).filter((o) => o.id === "manzanasVariacion")[0];
    const layerManzanasVariacion2022 = Object.values(layers).filter((o) => o.id === "manzanasVariacion2022")[0];
    const layerDeptos = Object.values(layers).filter((o) => o.id === "deptos_vt")[0];
    const layerMpios = Object.values(layers).filter((o) => o.id === "mpios_vt")[0];

    variables.map.setPaintProperty(layerManzanas.id, 'fill-extrusion-opacity', transparencia);
    variables.map.setPaintProperty(layerManzanas2022.id, 'fill-extrusion-opacity', transparencia);
    variables.map.setPaintProperty(layerManzanasVariacion.id, 'fill-extrusion-opacity', transparencia);
    variables.map.setPaintProperty(layerManzanasVariacion2022.id, 'fill-extrusion-opacity', transparencia);
    variables.map.setPaintProperty(layerDeptos.id, 'line-opacity', transparencia);
    variables.map.setPaintProperty(layerMpios.id, 'line-opacity', transparencia);

  }

  return (
    <div className="legend">
      {/* <h2 className="result__top__title result__tema"  id="title"> {tema} - {subtema} - {categoria}</h2> */}
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
        {/* {leyenda} */}
      </ul>
      {/* <h5>Los colores más oscuros en la leyenda corresponden a los rangos más altos </h5> */}
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
