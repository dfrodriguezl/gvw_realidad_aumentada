// Layout componentes de navegacion inicial 

import React, { useState, useRef } from "react";
import Filter from '../components/locationFilter';
import Help from './help';
import Tools from './tools';
import Temas from './searchMain';
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import DashboardPanel from "./dasboard-panel";


const Accordion = ({ title, icon, children, data }) => {
  const [isOpen, setOpen] = React.useState(data);

  return (
    <li className="results__itemList">
      <div
        className={`results__title ${isOpen ? "open" : ""}`}
        onClick={() => setOpen(!isOpen)}
      >
        <span className={`results__icon ${icon}`}></span>
        {title}
      </div>
      <div className={`results__panel ${!isOpen ? "collapsed" : ""}`}>
        <div className="results__content">{children}</div>
      </div>
    </li>
  );
};

const TabsComponent = () => {
  const [state, setState] = useState(2);
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);

  return (
    <div className="navBar" id="navbar">
      <div ref={dropdownRef} className={`navBar__container ${isActive ? "inactive" : "active"}`}>
        <Tabs selectedIndex={state} onSelect={(index) => setState(index)} >
          {/* La ayuda y la descarga son Modal por lo que no necesita un panel - Solo se llama el tab*/}
          <TabList className="navBar__list">
            <Tab>
              <div className="navBar__list__item">
                <button className={state === 0 ? "navBar__list__item__btn --active" : "navBar__list__item__btn"} >
                  <Help />
                </button>
              </div>
            </Tab>
            <Tab>
              <div className="navBar__list__item">
                <button className={state === 1 ? "navBar__list__item__btn --active" : "navBar__list__item__btn"} >
                  <div className="navBar__icon">
                    <span className="DANE__Geovisor__icon__searchGeo"></span>
                  </div>
                  <p className="navBar__iconName">Ubicación</p>
                </button>
              </div>
            </Tab>
            <Tab>
              <div className="navBar__list__item">
                <button className={state === 2 ? "navBar__list__item__btn --active" : "navBar__list__item__btn"} >
                  <div className="navBar__icon">
                    <span className="DANE__Geovisor__icon__searchTheme"></span>
                  </div>
                  <p className="navBar__iconName">Temas</p>
                </button>
              </div>
            </Tab>
            <Tab>
              <div className="navBar__list__item">
                <button className={state === 3 ? "navBar__list__item__btn --active" : "navBar__list__item__btn"} >
                  <div className="navBar__icon">
                    <span className="DANE__Geovisor__icon__settings"></span>
                  </div>
                  <p className="navBar__iconName">Herramientas</p>
                </button>
              </div>
            </Tab>

          </TabList>
          {/* LOS PANELS - LLAMAN EL CONTENIDO DE CADA ITEM TAB SEGUN SU ORDEN */}
          <TabPanel>
            <div className="navbar__panel" >
            </div>
          </TabPanel>
          <TabPanel>
            <div className="navbar__panel" >
              <Filter />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="navbar__panel" >
              <Temas />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="navbar__panel" >
              <Tools />
            </div>
          </TabPanel>
        </Tabs>
        <div className="navBar__collapseBtn" onClick={onClick}>
          <div className="navBar__collapseBtn__triangle"></div>
        </div>
        <Accordion title="Visualización" icon="DANE__Geovisor__icon__layers" data={true}>  <TabList className="navBar__list">
            <Tab>
              <div className="navBar__list__item">
                <button className={state === 2 ? "navBar__list__item__btn --active" : "navBar__list__item__btn"} >
                  <div className="navBar__icon">
                    <span className="DANE__Geovisor__icon__world2"></span>
                  </div>
                  <p className="navBar__iconName">Mapa General</p>
                </button>
              </div>
            </Tab>
            <Tab>
              <div className="navBar__list__item">
                <button className={state === 0 ? "navBar__list__item__btn --active" : "navBar__list__item__btn"} >
                  <div className="navBar__icon">
                    <span className="DANE__Geovisor__icon__indicatorEconomy"></span>
                  </div>
                  <p className="navBar__iconName">Tablero
                  </p>
                </button>
              </div>
            </Tab>

          </TabList>
          {/* LOS PANELS - LLAMAN EL CONTENIDO DE CADA ITEM TAB SEGUN SU ORDEN */}
          <TabPanel>
            <div className="navbar__panel" >
            </div>
          </TabPanel>
          <TabPanel>
            <div className="navbar__panel" >
              <DashboardPanel />
            </div>
          </TabPanel> 
          </Accordion>
      </div>
    </div>

  );
}

export default TabsComponent;