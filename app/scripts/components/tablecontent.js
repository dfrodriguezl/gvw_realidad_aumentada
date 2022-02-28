import React, { useState } from "react";
import {variables} from '../base/variables';
// import 'react-tabulator/lib/css/tabulator.min.css'; // theme
import {ReactTabulator} from 'react-tabulator';


const TableContent = () => {
  const [responsive, setResponsive] = useState("vertical");
  const [data, setData] = useState([])
  const [col, setCol] = useState([])
  
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
    locale:"en-gb",
    langs :{
      "en-gb":{
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
    }
  }

  const columns = [
    { title: "Código", field: "codigo" },
    { title: "Departamento", field: "depto"},
    { title: "Municipio", field: "mpio"},
    { title: "Valor", field: "valor" },
    { title: "Barra", field: "valor", hozAlign: "left", formatter: "progress" , formatterParams: {
      color:["green", "orange", "red"]
    }} 
  ]

  const estandarizarCantidades = (data) => {
    console.log("ESTANDARIZAR", data);
    return data;
  }

  variables.updateData = (dataTable,cols) => { 
    setCol(cols)
    setData(estandarizarCantidades(dataTable))
  }

  return (
    <React.Fragment> 
      <div className="tableBox__top">
        <h3 className="tableBox__tableName">Tabla de datos - {variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"]}</h3>
        {/* <div className="tableBox__close"></div> */}
      </div>
      <ReactTabulator
          columns={col}
          data={data}
          options={options}
      />
    </React.Fragment>
  );
}

export default TableContent;