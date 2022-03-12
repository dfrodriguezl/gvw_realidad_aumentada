import React, { useEffect } from "react";
import { toContext } from "ol/render";
import { Style, Fill, Stroke, Circle, Text } from 'ol/style';
import Point from "ol/geom/Point";
import { variables } from "../base/variables";


const ProportionalSymbol = () => {

  

  const intlNumberFormat = new Intl.NumberFormat('es-ES');

  useEffect(() => {
    generateLegend();
  }, [])

  const generateLegend = () => {
    const min = 0;
    const max = variables.max !== null ? variables.max : 500;
    const fillCircle = new Fill({
      color: 'rgb' + variables.tematica["CATEGORIAS"][variables.varVariable][0]['COLOR']
    });

    const canvas = document.getElementById('canvas');
    let vectorContext = toContext(canvas.getContext('2d'), {
      size: [300, 200]
    });
    
    [min, (min + max) / 5, ((min + max) / 5) * 2, ((min + max) / 5) * 3, ((min + max) / 5) * 3, ((min + max) / 5) * 4, max]
      .slice(0)
      .reverse()
      .forEach(val => {
        if (val !== min) {
          const radius = (val * 60) / max;
          const text = new Text({
            offsetX: 50,
            offsetY: -radius,
            text: `${intlNumberFormat.format(val.toFixed(0))}`,
            font: '12px Calibri,sans-serif'
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