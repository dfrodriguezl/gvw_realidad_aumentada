import React, { useState } from "react";
import Select from 'react-select'
import { variables } from '../base/variables';

const periodos = [
    { value: '2021-12', label: '2021-12' },
    { value: '2020-12', label: '2020-12' },
    { value: '2019-12', label: '2019-12' },
    { value: '2018-12', label: '2018-12' },
    { value: '2017-12', label: '2017-12' },
    { value: '2016-12', label: '2016-12' },
    { value: '2015-12', label: '2015-12' },
]

const Periodo = () => {
    const [periodosList, setPeriodosList] = useState(periodos);
    const [selectedPeriodo, setSelectedPeriodo] = useState(variables.periodoSeleccionado);


    const handleChange = (event) => {
        setSelectedPeriodo(event);
        variables.periodoSeleccionado = event;
        variables.updatePeriodoHeader(event);
        const currentZoom = variables.map.getView().getZoom();
        if (currentZoom <= 7) {
            if(!variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["DPTO"][variables.periodoSeleccionado.value]){
                variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["DPTO"][variables.periodoSeleccionado.value] = {};
            }
            variables.changeTheme("DPTO", 0, "ND", "y");
        } else if (currentZoom > 7 && currentZoom <= 11) {
            if(!variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["DPTO"][variables.periodoSeleccionado.value]){
                variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["DPTO"][variables.periodoSeleccionado.value] = {};
            }
            if(!variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["MPIO"][variables.periodoSeleccionado.value]){
                variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["MPIO"][variables.periodoSeleccionado.value] = {};
            }
            variables.changeTheme("DPTO", 0, "ND", "y");
            variables.changeTheme("MPIO", null, null, "y");
            if (variables.deptoSelected == undefined && variables.deptoVariable != undefined) {
                variables.filterGeo("DPTO", variables.deptoVariable)
            }
            variables.changeStyleDepto();
        } else {
            if (variables.municipioSeleccionado != null) {
                variables.changeTheme("DPTO", 0, "ND", "n");
                variables.changeTheme("MPIO", variables.municipioSeleccionado, null, "y");
            }

            variables.changeTheme("SECC", null, "NSC", "n");
            variables.changeStyleDepto();
            variables.changeStyleMpio();
        }
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