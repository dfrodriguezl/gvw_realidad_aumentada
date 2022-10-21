import React, { useRef, useState } from "react";
import { variables } from '../base/variables';
// import 'react-tabulator/lib/css/tabulator.min.css'; // theme
import { ReactTabulator } from 'react-tabulator';
import ExportTable from "./exportTable";


const TableContent = () => {
  const [responsive, setResponsive] = useState("vertical");
  const [data, setData] = useState([])
  const [col, setCol] = useState([])
  const [periodoActual, setPeriodoActual] = useState(variables.periodoSeleccionado)
  const [productoActual, setProductoActual] = useState(variables.productoSeleccionado)
  const tableRef = useRef();

  const options = {
    movableRows: true,
    paginationDataSent: {
      page: 'page',
      size: 'per_page' // change 'size' param to 'per_page'
    },
    paginationDataReceived: {
      last_page: 'total_pages'
    },
    current_page: 1,
    pagination: 'local',
    paginationSize: 10,
    locale: "en-gb",
    langs: {
      "en-gb": {
        pagination: {
          next: 'Siguiente',
          prev: 'Anterior',
          last: 'Última',
          first: 'Primera',
          // rowsPerPage: 'Filas por página:',
          displayRows: 'of',
          // jumpToPage: 'Ir a la página:',
        },
      }
    },
    downloadDataFormatter: (data) => data,
    downloadReady: (fileContents, blob) => blob
  }

  const columns = [
    { title: "Código", field: "codigo" },
    { title: "Departamento", field: "depto" },
    { title: "Municipio", field: "mpio" },
    { title: "Valor", field: "valor" },
    {
      title: "Barra", field: "valor", hozAlign: "left", formatter: "progress", formatterParams: {
        color: ["green", "orange", "red"]
      }
    }
  ]

  variables.updateData = (dataTable, cols) => {
    setCol(cols)
    setData(dataTable)
  }

  const downloadData = () => {
    tableRef.current.table.download("csv", "data.csv");
  }

  variables.updatePeriodoTabla = (nuevoPeriodo) => {
    setPeriodoActual(nuevoPeriodo)
  }

  variables.updateProductoTabla = (nuevoProducto) => {
    setProductoActual(nuevoProducto)
  }

  return (
    <React.Fragment>
      <div className="tableBox__top">
        <h3 className="tableBox__tableName">Tabla de datos - {variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"]} - {periodoActual ? periodoActual.label : null} - {productoActual ? productoActual.label : null}</h3>
        <ExportTable exportar={downloadData} />
        {/* <div className="tableBox__close"></div> */}
      </div>
      <ReactTabulator
        ref={tableRef}
        columns={col}
        data={data}
        options={options}
      />
    </React.Fragment>
  );
}

export default TableContent;