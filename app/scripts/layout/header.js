import React, { Fragment, useState } from 'react';
import { variables } from '../base/variables';
import AccessibilityTool from '../components/accessibility';
import Search from '../components/search';
import SearchGoogle from '../components/searchGoogle';


const Header = () => {
    const resultados = true;
    const [periodoActual, setPeriodoActual] = useState(variables.periodoSeleccionado);
    const [MGN, setMGN] = useState(variables.versionMGN);

    variables.updatePeriodoHeader = (nuevoPeriodo) => {
        setPeriodoActual(nuevoPeriodo)
    }

    variables.updateMGNHeader = (versionMGN) => {
        setMGN(versionMGN)
    }

    return (
        <Fragment>
            <header className="Header" id="header">
                <div className="Header__container">
                    <div className="Header__container__logo">
                        <a rel="noreferrer" title="Geoportal DANE Logo" href="https://www.dane.gov.co/" className="Header__container__logo__link" target="_blank">
                        <img class="DANE__Geovisor__icon__logoDANE__01" src="https://geoportal.dane.gov.co/src/images/general/LogoDANE_Nuevo.svg" id="logo" alt="logo-dane" />
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
               
                    </div>
                    <div className="accessibility --visible">
                        <AccessibilityTool />
                    </div>
                    <Search filterSearch={resultados} placeholder={"Búsqueda por lugar de Interés"} />
                    {/* <SearchGoogle/> */}
                </div>
            </header>

        </Fragment>
    );
}

export default Header;