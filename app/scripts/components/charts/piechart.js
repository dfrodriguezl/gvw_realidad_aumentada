import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { variables } from '../../base/variables';

const PieChart = () => {
  let labelsData = []
  let colors = []
  let dataFirst = []

  // console.log(variables.state)
  const [data, setData] = useState(variables.state);

  variables.changePieChartData = function (nivel, dpto) {
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
        });
        // console.log(dataNivel)
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
    // console.log("veo", dataFirst, labelsData, colors)
    let dataP = {
      labels: labelsData,
      datasets: [
        {
          label: 'Total',
          // labels: myLabels,
          backgroundColor: colors,
          data: dataFirst
        }
      ]
    }

    // console.log(variables.state)

    setData(dataP)
    // setData(variables.state)
  }

  useEffect(() => {
    variables.changePieChartData('DPTO', '97');
    // variables.changePieChartData('MPIO');
  }, [])



  return (
    <div className="charts">
      <Pie
        data={data}
        width={180}
        options={{
          legend: {
            position: 'bottom',
            align: 'start',
            fullWidth: true,
            labels: {
              boxWidth: 20,
              fontColor: 'black',
              fontSize: 14
            }
          }
        }}
      />
    </div>
  );
}

export default PieChart;

