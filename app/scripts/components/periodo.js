import React, { useState } from "react";
import Select from 'react-select'
import { variables } from '../base/variables';

const Periodo = () => {
    const [periodosList, setPeriodosList] = useState(variables.periodos);
    const [selectedPeriodo, setSelectedPeriodo] = useState(variables.periodoSeleccionado);


    const handleChange = (event) => {
        setSelectedPeriodo(event);
        variables.periodoSeleccionado = event;
        console.log("EVENT", event);
        variables.updatePeriodoHeader(event);
        variables.updatePeriodoTabla(event);
        variables.updatePeriodoResult(event);
        variables.getProductosByPeriodo("MPIO", "MPIO", variables.periodoSeleccionado.value);
        // const currentZoom = variables.map.getView().getZoom();
        console.log("DATA", variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["MPIO"][variables.periodoSeleccionado.value]);
        if(!variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["MPIO"][variables.periodoSeleccionado.value]){
            variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["MPIO"][variables.periodoSeleccionado.value] = {};
        }
        variables.changeTheme("MPIO", 0, "MPIO", "y");
        // variables.changeTheme("MPIO", null, null, "y");
    }


    return (
        <div className="tools__panel">
            <p className="tools__text">Realice la selección de período que desea ver en el mapa</p>
            <div className="selectBox">
                <p className="selectBox__name">Periodo:</p>
                <Select
                    styles={{
                        navBar: provided => ({ zIndex: 9999 })
                    }}
                    name="form-field-name"
                    value={selectedPeriodo}
                    onChange={handleChange}
                    className="select2-container"
                    placeholder="Seleccione un período"
                    options={periodosList}
                    getOptionValue={(option) => option.value}
                    getOptionLabel={(option) => option.label}
                /> 
            </div>
        </div>
    )
}

export default Periodo;