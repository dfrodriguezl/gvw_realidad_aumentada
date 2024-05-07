// Layout componentes menu de navegación secundario (Herramientas)
import React, { useState } from 'react';
import BaseMap from '../components/basemap';
import Capas from '../components/capas';
import Custom from '../components/custom';
import Upload from "../components/upload";
import Table from './table';
import Descarga from '../components/download';
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import RouterGoogle from '../components/routerGoogle';


const TabsComponent = () => {
  const [state, setState] = useState(-1);

  return (
    <Tabs selectedIndex={state} onSelect={(index) => setState(index)}>
      <TabList className="tools__list">
        <Tab>
          <div className="tools__list__item">
            <button className={state === 0 ? "tools__list__item__btn --active" : "tools__list__item__btn"}>
              <div className="tools__icon">
                <span className="DANE__Geovisor__icon__baseMap"></span>
              </div>
              <p className="tools__iconName">Mapa Base</p>
            </button>
          </div>
        </Tab>
        <Tab>
          <div className="tools__list__item">
            <button className={state === 1 ? "tools__list__item__btn --active" : "tools__list__item__btn"}>
              <div className="tools__icon">
                <span className="DANE__Geovisor__icon__layers"></span>
              </div>
              <p className="tools__iconName">Capas</p>
            </button>
          </div>
        </Tab>
        <Tab>
          <div className="tools__list__item">
            <button className={state === 2 ? "tools__list__item__btn --active" : "tools__list__item__btn"}>
              <Table />
            </button>
          </div>
        </Tab>
        <Tab>
          <div className="tools__list__item">
            <button className={state === 3 ? "tools__list__item__btn --active" : "tools__list__item__btn"}>
              <div className="tools__icon">
                <span className="DANE__Geovisor__icon__palette"></span>
              </div>
              <p className="tools__iconName">Personalizar</p>
            </button>
          </div>
        </Tab>
        <Tab>
          <div className="tools__list__item">
            <button className={state === 4 ? "tools__list__item__btn --active" : "tools__list__item__btn"}>
              <div className="tools__icon">
                <span className="DANE__Geovisor__icon__uploadCloud"></span>
              </div>
              <p className="tools__iconName">Cargar</p>
            </button>
          </div>
        </Tab>
        <Tab>
          <div className="tools__list__item">
            <button className={state === 5 ? "tools__list__item__btn --active" : "tools__list__item__btn"}>
              <div className="tools__icon">
                <span className="DANE__Geovisor__icon__route"></span>
              </div>
              <p className="tools__iconName">Rutas</p>
            </button>
          </div>
        </Tab>
        <Tab>
          <div className="tools__list__item">
            <button className={state === 6 ? "tools__list__item__btn --active" : "tools__list__item__btn"}>
              <Descarga />
            </button>
          </div>
        </Tab>
      </TabList>

      <TabPanel>
        <div className="tools__container">
          <BaseMap />
        </div>
      </TabPanel>
      <TabPanel>
        <div className="tools__container">
          <Capas />
        </div>
      </TabPanel>
      <TabPanel>
        <div className="tools__container"></div>
      </TabPanel>
      <TabPanel>
        <div className="tools__container">
          <Custom />
        </div>
      </TabPanel>
      <TabPanel>
        <div className="tools__container">
          <Upload />
        </div>
      </TabPanel>
      <TabPanel>
        <div className="tools__container">
        <RouterGoogle/>
        </div>
      </TabPanel>
      <TabPanel>
        <div className="tools__container">
        </div>
      </TabPanel>
    </Tabs>

  );
}

export default TabsComponent;