// Layout componentes de navegacion inicial 

import React, { useState, useRef, Fragment } from "react";
import { Tabs, useTabState, usePanelState } from "@bumaga/tabs";
import Filter from '../components/locationFilter';
import Help from './help';
import Tools from './tools';
import Temas from './searchMain';
import { useDetectOutsideClick } from "./useDetectOutsideClick";

const cn = (...args) => args.filter(Boolean).join(' ')

const Tab = ({ children }) => {
  const { isActive, onClick } = useTabState();

  return <li className="navBar__list__item">
    <button className={cn("navBar__list__item__btn", isActive && '--active')} onClick={onClick}>{children}</button>
  </li>;
};

const Panel = ({ children }) => {
  const isActive = usePanelState();

  return isActive ? <div className="navbar__panel" >{children}</div> : null;
};

const TabsComponent = () => {
  const state = useState(2);
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);

  return (
    <div className="navBar" id="navbar">
      <div ref={dropdownRef} className={`navBar__container ${isActive ? "inactive" : "active"}`}>
        <Fragment>
          <Tabs state={state}>
            <ul className="navBar__list">
              {/* La ayuda y la descarga son Modal por lo que no necesita un panel - Solo se llama el tab*/}
              <Tab><Help /></Tab>
              <Tab>
                <div className="navBar__icon">
                  <span className="DANE__Geovisor__icon__searchGeo"></span>
                </div>
                <p className="navBar__iconName">Ubicación</p>
              </Tab>
              <Tab>
                <div className="navBar__icon">
                  <span className="DANE__Geovisor__icon__searchTheme"></span>
                </div>
                <p className="navBar__iconName">Temas</p>
              </Tab>
              <Tab>
                <div className="navBar__icon">
                  <span className="DANE__Geovisor__icon__settings"></span>
                </div>
                <p className="navBar__iconName">Herramientas</p>
              </Tab>
            </ul>

            {/* LOS PANELS - LLAMAN EL CONTENIDO DE CADA ITEM TAB SEGUN SU ORDEN */}
            <Panel></Panel>
            <Panel>
              <Filter />
            </Panel>
            <Panel><Temas /></Panel>
            <Panel><Tools /></Panel>
          </Tabs>
        </Fragment>
        <div className="navBar__collapseBtn" onClick={onClick}>
          <div className="navBar__collapseBtn__triangle"></div>
        </div>
      </div>
    </div>

  );
}

export default TabsComponent;