// ACORDION SUBGRUPO - CONFIGURACION Y MAQUETA DE ACORDION PARA QUE MUESTRE LAS SUBGRUPO DEL GRUPO DESDE BASE DE DATOS
import React, { useState } from "react";
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';


const Accordion = (tematica) => {
  const [activeIndex, setActiveIndex] = useState(1);
  let item = tematica.item;
  let tematicaDos = tematica.tematica;
  let index = tematica.index;
  let liTemas = tematica.liTemas;

  const ariaExpanded = item[0].COD_SUBGRUPO === activeIndex ? "--collapse" : "";
  // console.log(ariaExpanded)
  return (
    <li
      className={`filter__thematic__item ${item[0].COD_SUBGRUPO} ${ariaExpanded}`}
      key={item[0].COD_SUBGRUPO}
      id={item[0].COD_SUBGRUPO}
      onClick={(e) => {
        if (e.currentTarget.classList.length < 3) {
          setActiveIndex(item[0].COD_SUBGRUPO);
        } else {
          setActiveIndex("");
        }
      }}
    >
      <p className="filter__thematic__nameGroup">  {tematicaDos.GRUPOS[(item[0].COD_SUBGRUPO).substring(0, 3)][0].GRUPO}
        <span style={{ float: 'right' }}>
          {activeIndex !== item[0].COD_SUBGRUPO ?
            <RemoveIcon fontSize="small" /> :
            <AddIcon fontSize="small" />}
        </span>
      </p>
      <h3 className="filter__thematic__name"> {item[0].SUBGRUPO}</h3>
      <ul
        key={item[0].COD_SUBGRUPO} id={item[0].COD_SUBGRUPO}
        className={`filter__thematicVariable__list ${item[0].COD_SUBGRUPO}`}
      >
        {liTemas}
      </ul>

    </li>
  );
};

export default Accordion;
