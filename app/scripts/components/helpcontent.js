// Layout componentes de navegacion inicial 

import React, { useState, Fragment } from "react";
import { variables } from '../base/variables';
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

const HelpContent = () => {
    const [state, setState] = useState(0);

    return (
        <Fragment>
            <div className="help__container" itemScope itemType="https://schema.org/GovernmentOrganization">
                <h3 className="help__title" itemProp="name">{variables.title}</h3>
            </div>
            <Tabs selectedIndex={state} onSelect={(index) => setState(index)} >
                <TabList className="help__listTab">
                    <Tab>
                        <div className="help__listTabItem">
                            <div className="help__icon">
                                <span className="DANE__Geovisor__icon__bookOpen"></span>
                            </div>
                            <p className="help__text">Guía Rápida</p>
                        </div>
                    </Tab>
                    <Tab>
                        <div className="help__listTabItem">
                            <div className="help__icon">
                                <span className="DANE__Geovisor__icon__identify"></span>
                            </div>
                            <p className="help__text">Acerca de</p>
                        </div>
                    </Tab>
                    <Tab>
                        <div className="help__listTabItem">
                            <div className="help__icon">
                                <span className="DANE__Geovisor__icon__user"></span>
                            </div>
                            <p className="help__text">Contáctenos</p>
                        </div>
                    </Tab>
                </TabList>

                {/* LOS PANELS - TRAEN EL CONTENIDO DE CADA TAB SEGUN SU ORDEN */}
                <TabPanel>
                    <div className="help__content">
                        <img width="100" height="100" loading="lazy" className="help__content__item" rel="noreferrer" src="https://geoportal.dane.gov.co/descargas/ayudas/ayuda-geovisor-consultaMGN.webp" alt="Instrucciones de uso para geovisores del Geoportal DANE" target="_blank" />
                    </div>
                </TabPanel>

                <TabPanel>
                    <div className="help__content" id="help__aboutUrl">
                        <p className="help__content__text" itemProp="description">
                            Geovisor para la consulta y visualización en 3D de la información correspondiente a las variables temáticas del Marco Geoestadístico Nacional - MGN.
                            <br />
                        </p>

                    </div>
                </TabPanel>

                <TabPanel>
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
                </TabPanel>
            </Tabs>
        </Fragment >
    );
}

export default HelpContent;