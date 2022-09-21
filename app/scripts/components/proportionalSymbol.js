import React, { useEffect } from "react";
import { toContext } from "ol/render";
import { Style, Fill, Stroke, Circle, Text } from 'ol/style';
import Point from "ol/geom/Point";
import { variables } from "../base/variables";


const ProportionalSymbol = () => {

  

  const intlNumberFormat = new Intl.NumberFormat('de-DE');

  useEffect(() => {
    generateLegend();
  }, [])

  const generateLegend = () => {
    const min = variables.min;
    const max = variables.max !== null ? variables.max : 500;
    const unidad = variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"];
    // console.log("MIN 2", min);
    // console.log("MAX 2", max);

    const fillCircle = variables.tematica["CATEGORIAS"][variables.varVariable] ? new Fill({
      color: 'rgb' + variables.tematica["CATEGORIAS"][variables.varVariable][0]['COLOR']
    }) : null;

    const canvas = document.getElementById('canvas');
    let vectorContext = toContext(canvas.getContext('2d'), {
      size: [300, 200]
    });
    
    [min, min + ((max - min) / 4), min + (((max - min) / 4) * 2), min + (((max - min) / 4) * 3), max]
      .slice(0)
      .reverse()
      .forEach(val => {
        // console.log("VAL", val);
        if (val !== min) {
          const radius = ((val - min)/(max - min))*30;
          const text = new Text({
            offsetX: 80,
            offsetY: -radius,
            text: `${intlNumberFormat.format(val.toFixed(0))} (${unidad})`,
            font: '12px Calibri,sans-serif',
            backgroundFill: new Fill({
              color: 'white'
            }),
            stroke: new Stroke({
              color: 'white',
              width: 2
            }),
            padding: [10,10,10,10]
          });
          const newStyle = new Style({
            image: new Circle({
              stroke: new Stroke({
                color: '#ffffff',
                width: 1
              }),
              fill: fillCircle,
              radius: radius
            }),
            text: text
          });
          vectorContext.setStyle(newStyle);
          // vectorContext.drawGeometry(new Point([150, 60 - (2 + radius)]));
          vectorContext.drawGeometry(new Point([150, 150 - (2 + radius)]));
        }


      })
  }

  variables.updateLegendProportional = () => {
    generateLegend();
  }

  return (
    <canvas id="canvas"></canvas>
  )

}

export default ProportionalSymbol;