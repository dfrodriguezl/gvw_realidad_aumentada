// Componente para el manejo de capas (on/off y transparencias), se muestran aquellas capas 
// que estan incluidas en el archivo de configuración (variables.js)

import React, { useState, useEffect } from 'react';
import { variables } from '../base/variables';

let layers = variables.layers;

const Capas = () => {

  const [actives, setActives] = useState(variables.layers);

  useEffect(() => {

  }, [actives])

  // Función para prender/apagar capa, y guardar su estado
  function handleChange(e) {
    let check = e.target.checked;
    let layer = e.target.value;

    if (check) {
      variables.map.setLayoutProperty(layer, 'visibility', 'visible');
    } else {
      variables.map.setLayoutProperty(layer, 'visibility', 'none');
    }
    setActives(variables.layers);
  }

  // Función para cambiar transparencia de la capa, y guardar su estado
  function changeSlider(e) {
    let value = e.target.value;
    let name = e.target.name;
    let transparencia = value / 10;
    const layer = Object.values(layers).filter((o) => o.id === name)[0]
    const typeLayer = layer.typeLayer;


    if (typeLayer === "fill-extrusion") {
      variables.map.setPaintProperty(name, 'fill-extrusion-opacity', transparencia);
    } else if (typeLayer === "line") {
      variables.map.setPaintProperty(name, 'line-opacity', transparencia);
    }

    setActives(variables.layers);

  }

  variables.updateActives = () => {
    setActives(Math.random());
  }

  return (
    <div className="tools__panel">
      <h3 className="tools__title"> Capas de referencia</h3>
      <div className="layers">
        <p className="tools__text">Active o desactive la capa que desea ver en el mapa</p>
        <ul className="layers__container">
          {
            Object.keys(layers).map((layer, index) => {
              if (!layers[layer].hideToc) {
                let id = layers[layer].id;
                let title = layers[layer].title;
                let checked = layers[layer].checked == undefined ? true : layers[layer].checked;
                let transparency = layers[layer].transparency == undefined ? 10 : layers[layer].transparency;
                let idx = 4 + index;
                let check = "check" + idx;

                return <li className="layers__list__item" key={id}>
                  <hr />
                  <div className="layers__check">
                    <label className="layers__checkBox" htmlFor={check}></label>
                    <input type="checkbox" value={id} className="layer__item" id={check} layer={id} name="radio" defaultChecked={checked} onChange={handleChange} />
                    <div className="layers__square" id={id}></div>
                    <p className="layers__name" >{title}</p>
                  </div>
                  <div className="layers__slider">
                    <p className="layers__slider__text" >Nivel de transparencia</p>
                    <p className="layers__slider__text" >0%</p>
                    <input type="range" className="layers__scroll" min="1" max="10" step="1" defaultValue={transparency} name={id} onChange={changeSlider} />
                    <p className="layers__slider__text" >100%</p>
                  </div >
                </li>
              }

            })
          }
        </ul>
      </div>
    </div>
  );
}


export default Capas;