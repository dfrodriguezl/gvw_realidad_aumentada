// Componente para el manejo de capas (on/off y transparencias), se muestran aquellas capas 
// que estan incluidas en el archivo de configuración (variables.js)

import React, { useState } from 'react';
import { variables } from '../base/variables';

let layers = variables.layers;

const Capas = () => {

  const [actives, setActives] = useState(variables.layers);

  // Función para prender/apagar capa, y guardar su estado
  function handleChange(e) {
    let check = e.target.checked;
    let layer = e.target.value;
    // let layers = variables.layersInMap;

    if(check){
      variables.map.setLayoutProperty(layer, 'visibility', 'visible');
    } else {
      variables.map.setLayoutProperty(layer, 'visibility', 'none');
    }


    // Object.keys(variables.layers).forEach((layerV, index) => {
    //   if (variables.layers[layerV].id == layer) {
    //     variables.layers[layerV].checked = check;
    //   }
    // });

    setActives(variables.layers);


    // layers.forEach((lyr) => {
    //   // console.log(lyr[layer])
    //   if (lyr[layer]) {
    //     if (check) {
    //       variables.map.addLayer(lyr[layer]);
    //       lyr[layer].setVisible(true);
    //     } else {
    //       variables.map.removeLayer(lyr[layer]);
    //     }
    //   }
    // })
  }

  // Función para cambiar transparencia de la capa, y guardar su estado
  function changeSlider(e) {
    let value = e.target.value;
    let name = e.target.name;
    let layers = variables.layersInMap;

    let transparencia = value / 10;

    variables.map.setPaintProperty(name, 'line-opacity', transparencia);



    // Object.keys(variables.layers).forEach((layerV, index) => {
    //   if (variables.layers[layerV].id == name) {
    //     variables.layers[layerV].transparency = value;
    //   }
    // });

    setActives(variables.layers);

    // layers.forEach((lyr) => {
    //   if (lyr[name]) {
    //     lyr[name].setOpacity(transparencia);
    //   }
    // });
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
                let visible = layers[layer].visible;
                let title = layers[layer].title;
                let checked = layers[layer].checked == undefined ? true : layers[layer].checked;
                let transparency = layers[layer].transparency == undefined ? 10 : layers[layer].transparency;
                let idx = 4 + index;
                let check = "check" + idx;
                // console.log(checked);

                return <li className="layers__list__item" key={id}>
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