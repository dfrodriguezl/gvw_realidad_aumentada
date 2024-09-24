import React, { useEffect, useState } from "react";
import { variables } from '../base/variables';


const Leyenda2 = () => {
  const [legend, setLegend] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [unidad, setUnidad] = useState("");
  // const [transparencyGeneral, settransparencyGeneral] = useState(variables.transparencyGeneral);
  const [visible, setVisible] = useState(true);


  // if(valores.data != undefined){
  //   setLegend(valores.data);
  // }

  // useEffect(() => {
  //   if (variables.coloresLeyend[variables.varVariable] != undefined) {
  //     setLegend(variables.coloresLeyend[variables.varVariable]["MNZN"])
  //   }
  // }, [legend])

  variables.changeLegend2 = function (nivel) {

    setCategoria(variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"])
    setUnidad(variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"])
    if (variables.coloresLeyend[variables.varVariable] != undefined) {
      setLegend(prevState => [...variables.coloresLeyend[variables.varVariable][nivel]])
    }
  }

  variables.apagarLegend = function () {
    setVisible(true);
  }

  const changeClickLess = () => {
    setVisible(false);
    variables.prenderLegend();
  }

  variables.hideLegendContainer = () => {
    setVisible(false);
  }

  return (
    <>
      {visible && <div className="legend">
        <div className="legend__slider" style={{ "height": "1.5em" }} onClick={changeClickLess}>
          <span className="DANE__Geovisor__icon__minus" style={{ "position": "absolute", "right": "10px", "top": "5px", }}></span>
        </div>

        {/* <div className="legend__slider">
          <div className="legend__slider__content">
            <p className="legend__slider__num" >0%</p>
            <label className="legend__scrollMain" htmlFor="scroll">
              <input id="scroll" type="range" className="legend__scroll" min="1" max="10" step="1" defaultValue={transparencyGeneral} onChange={changeSlider}></input>
            </label>
            <p className="legend__slider__num" >100%</p>
          </div>
        </div> */}

        <h2 className="legend__slider__text" id="title">{categoria}</h2>
        <h3 className="legend__value">({unidad})</h3>
        <ul className="legend__panel__list">
          {legend.map((item, index) => {
            return (
              // item[3] === "visible" ? <li className="legend__panel__list__item" key={index}>
              <li className="legend__panel__list__item" key={index}>
                <canvas className="legend__panel__list__item__square" style={{ background: item[0] }}></canvas>
                <p className="legend__panel__list__item__name"> {item[2]}</p>
              </li>
            )
          }, [])}
        </ul>
      </div>}
    </>
  );
}

export default Leyenda2;
