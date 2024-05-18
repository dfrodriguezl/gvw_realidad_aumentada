import React from 'react';
import { ResponsiveChord } from '@nivo/chord';

const ChordChartNivo = () => {
  // Datos inventados para el gráfico de acordes de Nivo
  const data = [
    { A: 262, B: 133, C: 500, D: 1053, E: 31 },
    { A: 428, B: 436, C: 468, D: 419, E: 298 },
    { A: 975, B: 68, C: 437, D: 1767, E: 1765 },
    { A: 1693, B: 181, C: 423, D: 152, E: 489 },
    { A: 258, B: 247, C: 50, D: 156, E: 462 }
  ];
  

  return (
    <div style={{ maxWidth: '800px', width: '100%', height: '50%' }}> 
      <ResponsiveChord
        data={data}
        keys={[ 'John', 'Raoul', 'Jane', 'Marcel', 'Ibrahim' ]}
        valueFormat=".2f"
        padAngle={0.02}
        innerRadiusRatio={0.96}
        innerRadiusOffset={0.02}
        inactiveArcOpacity={0.25}
        arcBorderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.6
                ]
            ]
        }}
        activeRibbonOpacity={0.75}
        inactiveRibbonOpacity={0.25}
        ribbonBorderColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    0.6
                ]
            ]
        }}
        labelRotation={-90}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    1
                ]
            ]
        }}
        colors={{ scheme: 'nivo' }}
        motionConfig="stiff"
        legends={[
            {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 70,
                itemWidth: 80,
                itemHeight: 14,
                itemsSpacing: 0,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                symbolSize: 12,
                symbolShape: 'circle',
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

export default ChordChartNivo;
