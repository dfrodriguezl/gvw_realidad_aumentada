import React, { useState } from "react";
import {variables} from '../base/variables';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

export const ExportToExcel = ({ apiData, fileName }) => {
    
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (apiData, fileName) => {
    //const ws = XLSX.utils.json_to_sheet(apiData);
    const ws = XLSX.utils.aoa_to_sheet(apiData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] }; //ws
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

    let Huso = (new Date()).getTimezoneOffset() * 60000;
    let Fecha = (new Date(Date.now() - Huso)).toISOString().split('T')[0];
    let Nombrefile = `${Fecha}${fileName}`;

  return (
    <button onClick={(e) => exportToCSV(apiData, Nombrefile)}>Descargar</button>
  );
};