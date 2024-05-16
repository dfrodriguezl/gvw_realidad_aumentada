import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

const BarChartNivo = () => {
  // Datos inventados para el gráfico de barras de Nivo
  const data = [
    { country: 'A', value: 100 },
    { country: 'B', value: 200 },
    { country: 'C', value: 300 },
    { country: 'D', value: 400 },
  ];

  return (
    <div style={{ maxWidth: '80%', width: '100%', height: '200px' }}> 
      <ResponsiveBar
        data={data}
        keys={['value']}
        indexBy="country"
        padding={0.3}
        colors={{ scheme: 'set3' }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Country',
          legendPosition: 'middle',
          legendOffset: 32
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'top-right',
            direction: 'column',
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemTextColor: '#000',
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    </div>
  );
};

export default BarChartNivo;
