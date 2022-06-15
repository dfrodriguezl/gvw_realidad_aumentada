import React, { useState, useEffect } from 'react';
import { variables } from '../../base/variables';

const BarHData = () => {
  let labelsData = []
  let dataFirst = []

  const [categoria, setCategoria] = useState("");
  const [data, setData] = useState("");
  const dataUnidades = variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"];

  variables.changeBarChartData = function (nivel, dpto) {



    setCategoria(variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"])

    let valor = 0;

    if (variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel] != undefined) {
      // console.log(variables.dataArrayDatos[variables.varVariable.substring(0, 5)])
      // console.log("NIVEL DATA", nivel)

      if (dpto == undefined) {
        var integrado = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).map(function (a, b) {

          let valor = parseFloat(a[variables.alias])
          if (valor != undefined && !isNaN(valor)) {
            return valor;
          } else {
            return 0
          }

        }, {});
        const reducer = (accumulator, curr) => accumulator + curr;
        dataFirst = parseFloat(integrado.reduce(reducer)).toLocaleString('es')
      } else if (nivel === "DPTO") {
        const dataNivel = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).filter((v) => {
          return v.ND === dpto;
        }, [])

        valor = parseFloat(dataNivel[0][variables.alias])
        dataFirst = valor.toLocaleString('de-DE');

      } else if (nivel === "MPIO") {
        const dataNivel = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).filter((v) => {
          return v.MPIO === dpto;
        }, [])
        // console.log(dataNivel[0])
        if (dataNivel[0] != undefined) {
          valor = parseFloat(dataNivel[0][variables.alias])
          dataFirst = valor.toLocaleString('de-DE');
        }

      } else if (nivel === "SECC") {
        const dataNivel = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).filter((v) => {
          return v.NSC === dpto;
        }, [])
        valor = parseFloat(dataNivel[0][variables.alias])
        dataFirst = valor.toLocaleString('de-DE');
      }


    }

    // console.log("DATA FIRST", dataFirst)

    if (dataFirst.length > 0) {
      setData(dataFirst)
    }


    // console.log(labelsData, dataFirst, "datos")
  }

  useEffect(() => {
    variables.changeBarChartData('DPTO');
  }, [])

  return (
    <div className="charts">
      <h2 className="charts__subtitle" id="title">{categoria + " (" + dataUnidades + ")"}</h2>
      <p className="charts__item">{data}</p>
    </div>
  );
}

export default BarHData;


