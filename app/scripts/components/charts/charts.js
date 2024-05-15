import React from 'react';
import {Pie, Doughnut, HorizontalBar} from 'react-chartjs-2';

const state = {
  labels: ['Alojamoiento', 'Transporte Terrestre', 'Alimentos y Bebidas', 'Otros Gastos'],
  datasets: [
    {
      label: 'Frecuencia',
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
      ],
      hoverBackgroundColor: [
      '#501800',
      '#4B5000',
      '#175000',
      '#003350',
      '#35014F'
      ],
      data: [65, 59, 80, 81]
    }
  ]
}

export default class ChartData extends React.Component {
  render() {
    return (
      <div>
        <Pie
          data={state}
          options={{
            title:{
              display:true,
              text:'Título de la gráfica',
              fontSize:12
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />

        <Doughnut
          data={state}
          options={{
            title:{
              display:true,
              text:'Título de la gráfica',
              fontSize:12
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
        <HorizontalBar
          data={state}
          options={{
            title:{
              display:true,
              text:'Título de la gráfica',
              fontSize:12
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />  
      </div>
    );
  }
}

