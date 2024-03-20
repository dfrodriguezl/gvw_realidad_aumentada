// Layout componentes de navegacion inicial 
import React, { useState } from "react";
import { Tabs, useTabState, usePanelState } from "@bumaga/tabs";
import { variables } from "../base/variables";
import BarHData from '../components/charts/barHchart';

const cn = (...args) => args.filter(Boolean).join(' ')
  ;
const Tab = ({ children }) => {
  const { isActive, onClick } = useTabState();
  return <li className="results__btnTabsItem">
    <button className={cn("results__btn", isActive && '--active')} onClick={onClick}>{children}</button>
  </li>;
};

const Panel = ({ children }) => {
  const isActive = usePanelState();
  return isActive ? <div className="results__charts">{children}</div> : null;
};

const Charts = () => {
  const [tipoVariable, settipoVariable] = useState("VC")

  variables.changeChart = function () {
    settipoVariable(variables.tematica["CATEGORIAS"][variables.varVariable][0]["TIPO_VARIABLE"])
  }


  return (

    tipoVariable === "VC" ?
      <div className="results__btnCharts">
        <Tabs>
          <ul className="results__btnTabs" >
            <Tab><p className="results__btnTabsName">Barras horizontales</p></Tab>
          </ul>
          <Panel><BarHData /></Panel>
        </Tabs>
      </div> :
      tipoVariable === "" ?
        null :
        <div className="results__btnCharts">
          <Tabs>
            <ul className="results__btnTabs" >
              <Tab><p className="results__btnTabsName">Barras horizontales</p></Tab>
            </ul>
            <Panel><BarHData /> </Panel>
          </Tabs>
        </div>
  )
}

export default Charts;