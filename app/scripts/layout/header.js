import React, { Fragment, useState } from 'react';
import { variables } from '../base/variables';
import AccessibilityTool from '../components/accessibility';
import Search from '../components/search';


const Header = () => {
    const resultados = true;
    const [periodoActual, setPeriodoActual] = useState(variables.periodoSeleccionado);

    variables.updatePeriodoHeader = (nuevoPeriodo) => {
        setPeriodoActual(nuevoPeriodo)
    }

    return (
        <Fragment>
            <div className="Header__container">
                <div className="Header__container__logo">
                    <a rel="noreferrer" title="Geoportal DANE Logo" href="https://www.dane.gov.co/" className="Header__container__logo__link" target="_blank">
                        <span className="DANE__Geovisor__icon__logoDANE__01">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                            <span className="path6"></span>
                            <span className="path7"></span>
                            <span className="path8"></span>
                            <span className="path9"></span>
                            <span className="path10"></span>
                            <span className="path11"></span>
                            <span className="path12"></span>
                            <span className="path13"></span>
                            <span className="path14"></span>
                            <span className="path15"></span>
                            <span className="path16"></span>
                            <span className="path17"></span>
                            <span className="path18"></span>
                            <span className="path19"></span>
                            <span className="path20"></span>
                            <span className="path21"></span>
                            <span className="path22"></span>
                            <span className="path23"></span>
                            <span className="path24"></span>
                        </span>
                    </a>
                </div>
                <h3 className="Header__container__geoportal">
                    <a rel="noreferrer" title="Geoportal DANE Logo" href="https://geoportal.dane.gov.co/" target="_blank" className="Header__container__geoportal__link">
                        <span className="DANE__Geovisor__icon__logoGeoportal">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                            <span className="path6"></span>
                            <span className="path7"></span>
                            <span className="path8"></span>
                            <span className="path9"></span>
                            <span className="path10"></span>
                            <span className="path11"></span>
                            <span className="path12"></span>
                            <span className="path13"></span>
                            <span className="path14"></span>
                            <span className="path15"></span>
                            <span className="path16"></span>
                            <span className="path17"></span>
                            <span className="path18"></span>
                        </span>
                    </a>
                </h3>
                <div className="Header__textBox">
                    <h1 className="Header__textBox__title">{variables.title}</h1>
                    <h2 className="Header__textBox__place">
                        <span className="Header__textBox__value">Periodo: {periodoActual.label}</span>
                        {/* <span className="Header__textBox__value">-</span>
                        <span className="Header__textBox__value">{variables.place}</span>
                        <span className="Header__textBox__value">-</span>
                        <span className="Header__textBox__value">{variables.year}</span> */}
                    </h2>
                </div>
                <div className="accessibility --visible">
                    <AccessibilityTool />
                </div>
                <Search filterSearch={resultados} placeholder={"Búsqueda por lugar de Interés"} />
            </div>
        </Fragment>
    );
}

export default Header;