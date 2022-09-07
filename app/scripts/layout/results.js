// Layout componentes resultados 
import React, { useState, useRef, Fragment } from 'react'
import { variables } from '../base/variables';
import Leyenda from '../components/legend';
import LeyendaCluster from '../components/legendaCluster';
import TematicCharts from '../layout/tematicCharts';
import { useDetectOutsideClick } from "./useDetectOutsideClick";

const Accordion = ({ title, children, data }) => {
  const [isOpen, setOpen] = React.useState(data);
  return (
    <div className="results__item">
      <div
        className={`results__title ${isOpen ? "open" : ""}`}
        onClick={() => setOpen(!isOpen)}
      >
        {title}
      </div>
      <div className={`results__panel ${!isOpen ? "collapsed" : ""}`}>
        <div className="results__content">{children}</div>
      </div>
    </div>
  );
};

const Results = () => {
  const [tema, setTema] = React.useState("");
  const [subtema, setSubtema] = React.useState("");
  const [locationDpto, setLocationDpto] = React.useState("Todos los departamentos");
  const [results, setResults] = useState([]);
  const [active, setActive] = useState(true);
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);
  const [periodo, setPeriodo] = React.useState(variables.periodoSeleccionado);

  variables.legenTheme = function (nivel) {
    setTema(variables.tematica["GRUPOS"][variables.varVariable.substring(0, 3)][0]["GRUPO"]);
    setSubtema(variables.tematica["SUBGRUPOS"][variables.varVariable.substring(0, 5)][0]["SUBGRUPO"]);
  }

  variables.legendChange = function (legendcluster) {
    setActive(legendcluster)
  }

  variables.changeDepto = (depto) => {
    setLocationDpto(depto)
  }

  variables.updatePeriodoResult = (periodo) => {
    setPeriodo(periodo)
  }

  return (
    <div ref={dropdownRef} className={`results__main ${isActive ? "inactive" : "active"}`}>
      <Fragment>
        <div className="results__collapseBtn" onClick={onClick}>
          <div className="results__collapseBtn__triangle"></div>
        </div>
        <div className="results__resize"></div>
        <div className="results__container">
          <div className="results__top">
            <h2 className="results__top__title" id="title">{tema}</h2>
            <h3 className="results__top__subtitle" id="title">{subtema}</h3>
            <h4 className="results__top__thirdtitle result__locationDpto">{locationDpto}</h4>
            <h4 className="results__top__thirdtitle result__locationDpto">{periodo.label}</h4>
          </div>
          <Accordion title="Leyenda" data={true}> <Leyenda /> </Accordion>
          {/* {active && <Accordion title="Leyenda" data={true}> <LeyendaCluster /> </Accordion>}
          {!active && <Accordion title="Leyenda" data={true}> <Leyenda /> </Accordion>} */}
          <Accordion title="Resultado Temático" data={true}> <TematicCharts /> </Accordion>
          <div className="results__panel__source">
            <p className="results__panel__source__name">Fuente: <a rel="noreferrer" href="https://www.dane.gov.co/index.php/estadisticas-por-tema/precios-y-costos/sistema-de-informacion-de-precios-sipsa" target="_blank" className="results__source__link">{variables.title}</a></p>
          </div>
        </div>
      </Fragment>
    </div>
  )
};

export default Results;