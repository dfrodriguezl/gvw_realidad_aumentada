import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {variables} from '../base/variables';

let urlData =  variables.urlVariables + "?codigo_subgrupo=" + variables.varVariable.substring(0, 5);
console.log(urlData, "urlData")

const Data = () => {
    const URL = urlData;
    const result = useFetch(URL, {});
  
    return <div>{JSON.stringify(result)}</div>;
};

const useFetch = (url, defaultData) => {
  const [data, updateData] = useState(defaultData);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url);
      const json = await response.json();
      updateData(json.resultado.joke);
    }
    fetchData();
  }, [url]);

  return data;
};

// const rootElement = document.getElementById("results");
// ReactDOM.render(<Data />, rootElement);
