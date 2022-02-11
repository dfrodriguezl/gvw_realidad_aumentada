// Layout componentes menu de navegación secundario (Herramientas)
import React, { useState } from 'react';
import { Tabs, useTabState, usePanelState } from "@bumaga/tabs";
import BaseMap from '../components/basemap';
import Capas from '../components/capas';
import Custom from '../components/custom';
import Upload from "../components/upload";
import Table from './table';
import TipoVisualizacion from '../components/tipoVisualizacion';

const cn = (...args) => args.filter(Boolean).join(' ')

const Tab = ({ children }) => {
  const { isActive, onClick } = useTabState();

  return <li className="tools__list__item">
    <button className={cn("tools__list__item__btn", isActive && '--active')} onClick={onClick}>{children}</button>
  </li>;
};

const Panel = ({ children }) => {
  const isActive = usePanelState();

  return isActive ? <div className="tools__container">{children}</div> : null;
};

const TabsComponent = () => {
  const state = useState(null);

  return (
    <Tabs state={state}>
      <ul className="tools__list">
        <Tab>
          <div className="tools__icon">
            <span className="DANE__Geovisor__icon__baseMap"></span>
          </div>
          <p className="tools__iconName">Mapa Base</p>
        </Tab>
        <Tab>
          <div className="tools__icon">
            <span className="DANE__Geovisor__icon__layers"></span>
          </div>
          <p className="tools__iconName">Capas</p>
        </Tab>
        <Tab><Table /></Tab>
        <Tab>
          <div className="tools__icon">
            <span className="DANE__Geovisor__icon__palette"></span>
          </div>
          <p className="tools__iconName">Personalizar</p>
        </Tab>
        <Tab>
          <div className="tools__icon">
            <span className="DANE__Geovisor__icon__uploadCloud"></span>
          </div>
          <p className="tools__iconName">Cargar</p>
        </Tab>
      </ul>

      <Panel><BaseMap /></Panel>
      <Panel><Capas /></Panel>
      <Panel>
        {/* <div style display="none"/> */}
      </Panel>
      <Panel>
        <Custom />
        <TipoVisualizacion />
      </Panel>
      <Panel><Upload /></Panel>
    </Tabs>

  );
}

export default TabsComponent;