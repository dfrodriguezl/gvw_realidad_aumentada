// Layout componentes de navegacion inicial 
import React, { useState, useEffect } from "react";
import { Tabs, useTabState, usePanelState } from "@bumaga/tabs";
import { variables } from "../base/variables";
import Treemap from '../components/charts/treemap';
import DonuChart from '../components/charts/donuchart';
import PieChart from '../components/charts/piechart';
import BarHData from '../components/charts/barHchart';
import VeloChart from "../components/charts/gaugechart";

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
  const [tipoVariable, settipoVariable] = useState("")

  variables.changeChart = function () {
    settipoVariable(variables.tematica["CATEGORIAS"][variables.varVariable][0]["TIPO_VARIABLE"])
  }


  return (

    tipoVariable === "VC" ?
      <div className="results__btnCharts">
        <Tabs>
          <ul className="results__btnTabs" >
            <Tab><p className="results__btnTabsName">Dona</p></Tab>
            <Tab><p className="results__btnTabsName">Torta</p></Tab>
          </ul>
          <Panel><DonuChart /></Panel>
          <Panel><PieChart /></Panel>
        </Tabs>
      </div> :
      tipoVariable === "" ?
        null :
        <div className="results__btnCharts">
          <Tabs>
            <ul className="results__btnTabs" >
              <Tab><p className="results__btnTabsName">Valor</p></Tab>
              {/* <Tab><p className="results__btnTabsName">Gráfico de Indicador</p></Tab> */}

              {/* <Tab><p className="results__btnTabsName">Gauge1</p></Tab> */}
            </ul>
            <Panel><BarHData /> </Panel>
            {/* <Panel><VeloChart /> </Panel> */}

            {/* <Panel><GaugeChart1 /> </Panel> */}
          </Tabs>
        </div>
  )
}

export default Charts;