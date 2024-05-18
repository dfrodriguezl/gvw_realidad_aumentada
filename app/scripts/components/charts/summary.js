import React, { useState} from "react";
import { variables } from '../../base/variables';
import { servidorQuery } from '../../base/request';

const Summary = () => {
    const [summary, setSummary] = useState(variables.dataSummary);

    variables.changeSummary = function (mpio) {
        let url = variables.urlRUE + "unidadescobertura.php?query=esperados_transmitidos&codigo_municipio=" + mpio;
        // let url = "http://localhost/recuentoce/servicios/" + "unidadescobertura.php?query=esperados_transmitidos&codigo_municipio=" + mpio;
        servidorQuery(url).then(function (response){
            if (response.data.estado) {
                variables.dataSummary = response.data.resultado[0];
                setSummary(response.data.resultado[0]);
            }
        });
    }

    return (
        <div>
            <p className="legend__btn__name">{`Cantidad de Unidades Esperadas ${summary.ESPERADOS}`}</p>
            <p className="legend__btn__name">{`Cantidad de Unidades Contadas ${summary.TRANSMITIDOS}`}</p>
        </div>
    );
}

export default Summary;