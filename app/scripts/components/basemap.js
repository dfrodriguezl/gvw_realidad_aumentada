import React, { useState } from 'react';
import { variables } from '../base/variables';
import XYZ from 'ol/source/XYZ';
import Gris from '../../img/gris.png';
import Noche from '../../img/noche.png';
import OSM from '../../img/OSM.png';
import Satelital from '../../img/satelital.png';

const BaseMap = () => {

  const [checked, setChecked] = useState(variables.baseMapCheck);

  function handleClick(e) {
    variables.map.setLayoutProperty(variables.baseMapCheck, 'visibility', 'none');
    variables.baseMapCheck = e;
    variables.map.setLayoutProperty(variables.baseMapCheck, 'visibility', 'visible');
    setChecked(e);
  }

  variables.changeBaseMap = () => {
    let bm = variables.baseMapCheck;
    setChecked(bm);
  }


  return (
    <div className="tools__panel">
      <h3 className="tools__title"> Mapa Base </h3>
      <p className="tools__text">Seleccione el tipo de mapa base que desea visualizar</p>
      <ul className="basemap__list">
        {
          Object.keys(variables.baseMaps).map((values, index) => {
            return <li key={'cajaBaseMap' + `${index + 1}`} className="basemap__list__item" onClick={() => handleClick(values)}>
              <input type="radio" id={'switch' + `${index + 1}`} name='radioBaseMap' value={values} defaultChecked={values == checked} />
              <label htmlFor={'switch' + `${index + 1}`}>
                <div key={'cajaBaseMap' + `${index + 1}`} className="basemap__btn">
                  {values === 'Gris' ?
                    <img src={Gris} className="basemap__img" alt="" /> :
                    values === 'Noche' ?
                      <img src={Noche} className="basemap__img" alt="" /> :
                      values === 'OSM' ?
                        <img src={OSM} className="basemap__img" alt="" /> :
                        values === 'Satelital' ?
                          <img src={Satelital} className="basemap__img" alt="" /> :
                          null
                  }

                  <p className="basemap__name">{values}</p>
                </div>
              </label>
            </li>
          })
        }
      </ul>
    </div>
  );
}
export default BaseMap;