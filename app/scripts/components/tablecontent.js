import React, { useRef, useState } from "react";
import { variables } from '../base/variables';
import { ReactTabulator } from 'react-tabulator';
import ExportTable from "./exportTable";


const TableContent = () => {
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
    <div className="table" id="tableContent">
      <div className="tableBox__top">
        <h3 className="tableBox__tableName">Tabla de datos - {variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"]} - {periodoActual ? periodoActual.label : null} - {productoActual ? productoActual.label : null}</h3>
        <ExportTable exportar={downloadData} />
      </div>
      <ReactTabulator
        ref={tableRef}
        columns={col}
        data={data}
        options={options}
      />
    </div>

  );
}

export default TableContent;