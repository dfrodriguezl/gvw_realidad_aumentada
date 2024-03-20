import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { variables } from '../../base/variables';


const DonutChart = () => {
  let labelsData = []
  let colors = []
  let dataFirst = []

  const [data, setData] = useState(variables.state);
  const [subgrupo, setSubgrupo] = useState("");
  const [dark, setDark] = useState(localStorage.getItem("theme") === "light" ? true : false);

  variables.updateCharTheme = () => {
    setDark(localStorage.getItem("theme") === "light" ? true : false)
  }

  variables.changeDonuChartData = function (nivel, dpto) {
    setSubgrupo(variables.tematica["SUBGRUPOS"][variables.varVariable.substring(0, 5)][0]["SUBGRUPO"])


    Object.keys(variables.tematica["CATEGORIAS"]).filter(o => o.substring(0, 5) == variables.varVariable.substring(0, 5)).map(function (a, b) {
      labelsData.push(variables.tematica["CATEGORIAS"][a][0]["CATEGORIA"]);
      colors.push('rgb' + variables.tematica["CATEGORIAS"][a][0]["COLOR"]);

      let dataNivel;

      if (dpto === null) {
        dpto = '97';
      }

      if (nivel === "MPIO") {
        dataNivel = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).filter((v) => {
          return v.MPIO === dpto;
        }, [])
      } else if (nivel === "SECC") {
        dataNivel = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).filter((v) => {
          return v.NSC === dpto;
        }, [])
      } else {
        dataNivel = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).filter((v) => {
          return v.ND === dpto;
        }, []);
      }

      let contador = dataNivel.length;
      let porcentaje = "PP" + b;

      const groupBy = dataNivel.reduce((objectsByKeyValue, obj) => {
        const value = obj[porcentaje];
        objectsByKeyValue[porcentaje] = (objectsByKeyValue[porcentaje] || 0) + parseFloat(value);

        return objectsByKeyValue;
      }, {});

      dataFirst.push(parseFloat(groupBy[porcentaje] / contador).toFixed(2));

    }, {})

    let dataD = {
      labels: labelsData,
      datasets: [
        {
          label: 'Total',
          backgroundColor: colors,
          data: dataFirst
        }
      ]
    }

    setData(dataD)

  }


  useEffect(() => {
    variables.changeDonuChartData('DPTO', '97');
    variables.updateCharTheme();
  }, [])


  return (
    <div className="charts">
      <h2 className="charts__subtitle" id="title">{subgrupo}</h2>
      <Doughnut
        data={data}
        width={180}
        height={100}
        options={{
          legend: {
            position: 'bottom',
            align: 'start',
            fullWidth: true,
            labels: {
              fontColor: dark ? 'black' : 'white',
              fontSize: 14
            }
          }
        }}
      />
    </div>
  )
}

export default DonutChart;

