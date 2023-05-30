import React from "react";
import { variables } from "../base/variables";

const CambioMGN = () => {

  const onChangeValue = (e) => {
    let value = e.target.value;
    variables.versionMGN = value;
    let layers = variables.layers;
    if(value === "MGN2022"){
      layers["manzanas2022"].hideToc = false;
      layers["manzanas2022"].visible = true;
      layers["manzanas2022"].checked = true;
      layers["manzanas"].hideToc = true;
      layers["manzanas"].visible = false;
      layers["manzanas"].checked = false;
    } else if (value === "MGN2021"){
      layers["manzanas2022"].hideToc = true;
      layers["manzanas2022"].visible = false;
      layers["manzanas2022"].checked = false;
      layers["manzanas"].hideToc = false;
      layers["manzanas"].visible = true;
      layers["manzanas"].checked = true;
    }

    if(variables.updateActives != null){
      variables.updateActives();
    }

    variables.updateLayers();
    variables.changeTheme("MNZN", "05001", "NM", "n");
  }

  return (
    <div onChange={onChangeValue}>
      <p>Selección de MGN:</p>
      <input type="radio" id="MGN2021" name="mgn" value="MGN2021" defaultChecked />
      <label for="MGN2021">MGN 2021</label> <br />
      <input type="radio" id="MGN2022" name="mgn" value="MGN2022" />
      <label for="MGN2022">MGN 2022</label> <br />
    </div>
  )
}

export default CambioMGN;