import React from 'react';
import { ResponsiveRadialBar } from '@nivo/radial-bar'

const RadialBarNivo = () => {
  // Datos inventados para el gráfico de barras de Nivo
  const data = [
    {
      "id": "Supermarket",
      "data": [
        {
          "x": "Vegetables",
          "y": 283
        },
        {
          "x": "Fruits",
          "y": 243
        },
        {
          "x": "Meat",
          "y": 71
        }
      ]
    },
    {
      "id": "Combini",
      "data": [
        {
          "x": "Vegetables",
          "y": 163
        },
        {
          "x": "Fruits",
          "y": 187
        },
        {
          "x": "Meat",
          "y": 98
        }
      ]
    },
    {
      "id": "Online",
      "data": [
        {
          "x": "Vegetables",
          "y": 115
        },
        {
          "x": "Fruits",
          "y": 190
        },
        {
          "x": "Meat",
          "y": 48
        }
      ]
    },
    {
      "id": "Marché",
      "data": [
        {
          "x": "Vegetables",
          "y": 57
        },
        {
          "x": "Fruits",
          "y": 131
        },
        {
          "x": "Meat",
          "y": 166
        }
      ]
    }
  ];

  return (
    <div style={{ maxWidth: '80%', width: '100%', height: '200px' }}> 
      <ResponsiveRadialBar
        data={data}
        valueFormat=">-.2f"
        padding={0.4}
        cornerRadius={2}
        margin={{ top: 40, right: 120, bottom: 40, left: 40 }}
        radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
        circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
        legends={[
            {
                anchor: 'right',
                direction: 'column',
                justify: false,
                translateX: 80,
                translateY: 0,
                itemsSpacing: 6,
                itemDirection: 'left-to-right',
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                symbolSize: 18,
                symbolShape: 'square',
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
    />
    </div>
  );
};

export default RadialBarNivo;
