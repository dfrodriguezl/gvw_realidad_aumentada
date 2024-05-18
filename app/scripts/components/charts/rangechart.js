import React, { useState} from "react";
import { variables } from '../../base/variables';
import { HorizontalBar } from 'react-chartjs-2';

const RangeChart = () => {

  const [datos, setDatos] = useState(variables.dataChart);

  variables.changeChart = function (dataInfo) {
    const state = {
      labels: Object.values(dataInfo).map((item, index) => { return (item[1]) }, []),
      datasets: [
        {
          barThickness: 32,
          label: 'Unidades de Cobertura',
          backgroundColor: Object.keys(dataInfo),
          hoverBackgroundColor: Object.keys(dataInfo),
          data: Object.values(dataInfo).map((item, index) => { return (item[0]) }, [])
        }
      ],
    }
    // console.log("charts ", state)
    variables.dataChart = state
    setDatos(state);
  }

  return (
    <div className="results__chart">
      <HorizontalBar
        data={datos}
        width={110}
        options={{
          title: {
            display: false,
            text: 'Conteo de manzanas según rango de clasificación',
            fontSize: 11
          },
          legend: {
            display: false,
          },
          responsive: true,
          tooltips: {
            titleFontSize: 11,
          },
          scales: {    
            xAxes: [
              { 
                ticks: {
                  beginAtZero: true
                }
              }
            ],     
            yAxes: [
              {
              display: true,
              align: 'start',
                ticks: {
                  fontSize: 9,
                  callback: function(label) {
                    if (/\s/.test(label)) {
                      return label.split(" ");
                    }else{
                      return label;
                    }             
                   }
                },
              }
            ]
          }
        }}
      />
    </div>
  );
  // }
}

export default RangeChart;