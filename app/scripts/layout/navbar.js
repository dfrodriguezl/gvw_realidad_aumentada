import React, { useRef, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import Filter from '../components/locationFilter';
import Help from './help';
import Temas from './searchMain';
import Tools from './tools';
import { useDetectOutsideClick } from "./useDetectOutsideClick";
import DashboardPanel from "./dasboardPanel";

const Accordion = ({ title, icon, children, data }) => {
  const [isOpen, setOpen] = React.useState(data);

  return (
    <div className="navBar__itemList">
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
    </div>
  );
};

const TabsComponent = ({ activeTab, setActiveTab }) => {
  const [state, setState] = useState(1);
  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
  const onClick = () => setIsActive(!isActive);

  const handleTabSelect = (index) => {
    setState(index);
    // setActiveTab(index);
  };

  return (
    <div className="navBar" id="navbar">
      <div ref={dropdownRef} className={`navBar__container ${isActive ? "inactive" : "active"} ${activeTab === 0 ? "tab-tablero-active" : ""}`}>
        <Tabs selectedIndex={state} onSelect={handleTabSelect}>
          <TabList className="navBar__list">
            <Tab>
              <div className="navBar__list__item">
                <button className={state === 0 ? "navBar__list__item__btn --active" : "navBar__list__item__btn"}>
                  <Help />
                </button>
              </div>
            </Tab>
            <Tab>
              <div className="navBar__list__item">
                <button className={state === 1 ? "navBar__list__item__btn --active" : "navBar__list__item__btn"}>
                  <div className="navBar__icon">
                    <span className="DANE__Geovisor__icon__searchTheme"></span>
                  </div>
                  <p className="navBar__iconName">Temas</p>
                </button>
              </div>
            </Tab>
            <Tab>
              <div className="navBar__list__item">
                <button className={state === 2 ? "navBar__list__item__btn --active" : "navBar__list__item__btn"}>
                  <div className="navBar__icon">
                    <span className="DANE__Geovisor__icon__settings"></span>
                  </div>
                  <p className="navBar__iconName">Herramientas</p>
                </button>
              </div>
            </Tab>
          </TabList>
          <TabPanel>
            <div className="navbar__panel"></div>
          </TabPanel>
          <TabPanel>
            <div className="navbar__panel">
              <Temas />
            </div>
          </TabPanel>
          <TabPanel>
            <div className="navbar__panel">
              <Tools />
            </div>
          </TabPanel>
        </Tabs>
        <div className="navBar__collapseBtn" onClick={onClick}>
          <div className="navBar__collapseBtn__triangle"></div>
        </div>
        <Accordion title="Visualización" icon="DANE__Geovisor__icon__layers" data={true}>
          <TabList className="navBar__list">
            <Tab>
              <div className="navBar__list__item">
                <button className={activeTab === 2 ? "navBar__list__item__btn --active" : "navBar__list__item__btn"} onClick={() => setActiveTab(2)}>
                  <div className="navBar__icon">
                    <span className="DANE__Geovisor__icon__world2"></span>
                  </div>
                  <p className="navBar__iconName">Mapa</p>
                </button>
              </div>
            </Tab>
            <Tab>
              <div className="navBar__list__item">
                <button className={activeTab === 0 ? "navBar__list__item__btn --active" : "navBar__list__item__btn"} onClick={() => setActiveTab(0)}>
                  <div className="navBar__icon">
                    <span className="DANE__Geovisor__icon__indicatorEconomy"></span>
                  </div>
                  <p className="navBar__iconName">Tablero</p>
                </button>
              </div>
            </Tab>
          </TabList>
          <TabPanel>
            <div className="navbar__panel">
              {activeTab === 2 && <div id="mapa"></div>}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="navbar__panel">
              {activeTab === 0 && <DashboardPanel />}
            </div>
          </TabPanel>
        </Accordion>
      </div>
    </div>
  );
}

export default TabsComponent;
