// PieChartNivo.js
import React from 'react';
import { ResponsivePie } from '@nivo/pie';

const PieChartNivo = () => {
  // Datos inventados para el gráfico de pastel de Nivo
  const data = [
    { id: 'A', value: 100 },
    { id: 'B', value: 200 },
    { id: 'C', value: 300 },
    { id: 'D', value: 400 },
  ];

  return (
    <div style={{ maxWidth: '800px', width: '100%', height: '200px' }}>
      <ResponsivePie
        data={data}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        colors={{ scheme: 'nivo' }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        radialLabelsSkipAngle={10}
        radialLabelsTextXOffset={6}
        radialLabelsTextColor="#333333"
        radialLabelsLinkOffset={0}
        radialLabelsLinkDiagonalLength={16}
        radialLabelsLinkHorizontalLength={24}
        radialLabelsLinkStrokeWidth={1}
        radialLabelsLinkColor={{ from: 'color' }}
        slicesLabelsSkipAngle={10}
        slicesLabelsTextColor="#333333"
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default PieChartNivo;
