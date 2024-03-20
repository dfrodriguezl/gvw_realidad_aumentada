// Layout componentes de navegacion inicial 
import React, { useState } from "react";
import { variables } from "../base/variables";
import BarHData from '../components/charts/barHchart';
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

const Charts = () => {
  const [tipoVariable, settipoVariable] = useState("VC");
  const [state, setState] = useState(0);

  variables.changeChart = function () {
    settipoVariable(variables.tematica["CATEGORIAS"][variables.varVariable][0]["TIPO_VARIABLE"])
  }


  return (

    tipoVariable === "VC" ?
      <div className="results__btnCharts">
        <Tabs selectedIndex={state} onSelect={(index) => setState(index)} >
          <TabList className="results__btnTabs">
            <Tab>
              <div className="results__btnTabsItem">
                <button className={state === 0 ? "results__btn --active" : "results__btn"} >
                  <p className="results__btnTabsName">Barras horizontales</p>
                </button>
              </div>
            </Tab>
          </TabList>
          <TabPanel>
            <BarHData />
          </TabPanel>
        </Tabs>
      </div> :
      tipoVariable === "" ?
        null :
        <div className="results__btnCharts">
          <Tabs selectedIndex={state} onSelect={(index) => setState(index)}>
            <TabList className="results__btnTabs">
              <Tab>
                <div className="results__btnTabsItem">
                  <button className={state === 0 ? "results__btn --active" : "results__btn"} >
                    <p className="results__btnTabsName">Barras horizontales</p>
                  </button>
                </div>
              </Tab>
            </TabList>
            <TabPanel>
              <BarHData />
            </TabPanel>
          </Tabs>
        </div>
  )
}

export default Charts;