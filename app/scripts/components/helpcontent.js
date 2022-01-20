// Layout componentes de navegacion inicial 

import React, { useState, Fragment } from "react";
import { Tabs, useTabState, usePanelState } from "@bumaga/tabs";
import { variables } from '../base/variables';

const cn = (...args) => args.filter(Boolean).join(' ')

const Tab = ({ children }) => {
    const { isActive, onClick } = useTabState();

    return <li className={cn("help__listTabItem", isActive && '--active')} onClick={onClick}>{children}
    </li>;
};

const Panel = ({ children }) => {
    const isActive = usePanelState();

    return isActive ? <div className="help__panel" >{children}</div> : null;
};

const HelpContent = () => {
    const state = useState(0);

    return (
        <Fragment>
            <div className="help__container" itemScope itemType="https://schema.org/GovernmentOrganization">
                <h3 className="help__title" itemProp="name">{variables.title}</h3>
            </div>
            <Tabs state={state}>
                <ul className="help__listTab">
                    <Tab>
                        <div className="help__icon">
                            <span className="DANE__Geovisor__icon__bookOpen"></span>
                        </div>
                        <p className="help__text">Guía Rápida</p>
                    </Tab>
                    <Tab>
                        <div className="help__icon">
                            <span className="DANE__Geovisor__icon__identify"></span>
                        </div>
                        <p className="help__text">Acerca de</p>
                    </Tab>
                    <Tab>
                        <div className="help__icon">
                            <span className="DANE__Geovisor__icon__user"></span>
                        </div>
                        <p className="help__text">Contáctenos</p>
                    </Tab>
                </ul>

                {/* LOS PANELS - TRAEN EL CONTENIDO DE CADA TAB SEGUN SU ORDEN */}
                <Panel>
                    <div className="help__content">
                        <img width="100" height="100" loading="lazy" className="help__content__item" rel="noreferrer" src="https://nowsoft.app/geoportal/descargas/ayudas/ayuda-geovisor-licencias-construccion.webp" alt="Instrucciones de uso para geovisores del Geoportal DANE" target="_blank" />
                    </div>
                </Panel>

                <Panel>
                    <div className="help__content" id="help__aboutUrl">
                        <p className="help__content__text" itemProp="description">
                            Geovisor  para la consulta y visualización de la información correspondiente a los resultados de
                            la operación estadística de licencias de construcción para agregados geográficos departamento, municipio
                            y manzana censal 
                            <br />
                            <a href="https://www.dane.gov.co/files/investigaciones/fichas/construccion/Ficha-ELIC-FME-001-V5.pdf" target="_blank">Ver ficha metodológica</a>
                        </p>
                        
                    </div>
                </Panel>

                <Panel>
                    <p className="help__content__text" itemProp="pqrs">Envíe su consulta por correo electrónico o tramite su petición, queja, reclamo, sugerencia o denuncia en el formulario DANE</p>
                    <a href="https://www.dane.gov.co/index.php/ventanilla-unica/pqr-s" target="_blank" className="help__listPanelLink">
                        <div className="help__panelItem__icon1">
                            <span className="DANE__Geovisor__icon__List"></span>
                        </div>
                        <p className="help__panelItem__text">Ventanilla única de PQRSD,</p><p className="help__panelItem__textBold">aquí.</p>
                    </a>
                    <a href="mailto:contacto@dane.gov.co?Subject=Contacto%20Dane" target="_blank" className="help__listPanelLink" itemProp="contacto">
                        <div className="help__panelItem__icon2">
                            <span className="DANE__Geovisor__icon__postalCourier"></span>
                        </div>
                        <p className="help__panelItem__text">contacto@dane.gov.co</p>
                    </a>
                </Panel>
            </Tabs>
        </Fragment >
    );
}

export default HelpContent;