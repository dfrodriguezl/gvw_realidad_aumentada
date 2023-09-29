import React, { useState, useEffect } from 'react';
import { variables } from '../../base/variables';
import { HorizontalBar } from 'react-chartjs-2';

const BarHData = () => {
  let labelsData = []
  let dataFirst = []

  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState([]);
  const dataUnidades = variables.tematica["CATEGORIAS"][variables.varVariable] ? variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"] : "";
  const [subgrupo, setSubgrupo] = useState("");
  const [labelsChart, setLabelsChart] = useState([]);
  const [colorsChart, setColorsChart] = useState([]);
  let rangos = {};
  let rangosLista = [];

  variables.changeBarChartData = function (labels, colors, datos, nivel) {

    setCategoria(variables.tematica["CATEGORIAS"][variables.varVariable] ? variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"] : "");
    setLabelsChart(labels);
    setColorsChart(colors);

    if (datos) {
      datos.map((dato) => {
        const valorCampo = dato.valor;

        for (let index = 0; index < variables.coloresLeyend[variables.varVariable][nivel].length; index++) {
          const obj = variables.coloresLeyend[variables.varVariable][nivel][index];
          // if (obj[3] === "visible") {
          let element = obj[2];
          // console.log("ELEMENT");
          element = String(element).split(' - ');
          if (element.length == 1) {
            if (parseFloat(valorCampo).toFixed(2)
              >= parseFloat(element[0].replace(">", "").replaceAll('.', '').replace("($)", "").trim())) {
                rangos[obj[2]] = !rangos[obj[2]] ? 1 : rangos[obj[2]] + 1
              break;
            }
          } else {
            if (parseFloat(valorCampo).toFixed(2) >= parseFloat(element[0].replaceAll('.', '').replace("%", ""))
              && parseFloat(valorCampo).toFixed(2) <= parseFloat(element[1].replaceAll('.', '').replace("%", ""))) {
                rangos[obj[2]] = !rangos[obj[2]] ? 1 : rangos[obj[2]] + 1
              break;
            }
          }
          // }
        }
      }, [])
    }
    console.log("RANGOS", rangos);

    console.log("LABELS", labels)
    if(labels.length > 0 && labels != "MPIO"){
      labels.map((label) => {
        rangosLista.push(rangos[label])
      })
    }

    setData(rangosLista);
  }

  useEffect(() => {
    variables.changeBarChartData('MPIO');
  }, [])

  const datasets = [
    {
      axis: 'y',
      label: '',
      data: data,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: colorsChart,
    }
  ];


  return (
    <div className="charts">
      {/* {console.log(data)} */}
      <h2 className="charts__subtitle" id="title">{categoria}</h2>
      <HorizontalBar
        data={{
          labels: labelsChart,
          datasets: datasets
        }}
        width={180}
        height={100}
        options={{
          elements: {
            bar: {
              borderWidth: 2,
            },
          },
          indexAxis: 'y',
        }}
      />
    </div>
  );
}

export default BarHData;


