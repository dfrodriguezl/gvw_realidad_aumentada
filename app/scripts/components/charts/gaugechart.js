import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart'
import { variables } from '../../base/variables';


const VeloChart = () => {
    
    const [categoria, setCategoria] = useState("");

    variables.changeGaugeChartData = function () {
        // setCategoria(variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"])

    }

    useEffect(() => {
        variables.changeGaugeChartData('DPTO');
    }, [])

    return (
        <div className="charts">
            <h2 className="charts__subtitle" id="title">{categoria}</h2>
            <GaugeChart id="gauge-chart3"
                nrOfLevels={20}
                colors={['#C3C3C3', '#007C76']}
                arcWidth={0.3}
                percent={1}
                textColor="#3D3D3D"
                needleColor="#C3C3C3"
            />"

        </div>
    );
};

export default VeloChart;