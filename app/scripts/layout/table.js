// Layout boton tabla, para animacion, si quiere modificar la tabla dirijase a components -> tablecontent
import React from "react";

function handleScroll() {
  window.scroll({
    top: document.body.offsetHeight,
    left: 0,
    behavior: 'smooth',
  });
}

const Table = () => {
  return (
    <div className="tools__list__item__btn" onClick={handleScroll}>
      <div className="tools__icon">
        <span className="DANE__Geovisor__icon__table"></span>
      </div>
      <p className="tools__iconName">Tabla</p>
    </div>

  );
}

export default Table;
