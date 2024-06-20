// Componente encargado de renderizar el mapa y todas sus herramientas bajo openLayers
// Autor: Diego Rodriguez
// Fecha: 31/03/2021

import 'ol/ol.css';
import React, { useEffect, useRef } from 'react';
import Overlay from 'ol/Overlay';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { Zoom } from 'ol/control.js';
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style';

import { Cluster, Vector as VectorSource } from 'ol/source';
import GeoJSON from 'ol/format/GeoJSON';
import { variables } from '../base/variables'
import geostats from 'geostats';
import municipios from '../../json/mpio-extent.json'
import departamentos from '../../json/dpto-extent.json'
import { servidorQuery } from '../base/request'
import 'ol-street-view/dist/css/ol-street-view.min.css';
import TipoVisualizacion from '../components/tipoVisualizacion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//Libreria MapLibre
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mglStreetViewControl } from '../util/mglStreetViewControl.js'

let container, content;
let zoomActual;
let unidadesAbsolutas;

var resolutions = [];
let max;
let min;
let max2;

const Mapa = () => {

  // const [hideVisualizationSwitch, setHideVisualizationSwitch] = useState("show");

  const mapRef = useRef(null);
  const ciudadInicial = "05001";
  localStorage.setItem("theme", "light");
  localStorage.setItem("visualization", "symbols");



  var overlay = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    }
  });

  var key = variables.key;

  variables.base = new TileLayer({
    source: new XYZ({
      url: variables.baseMaps[variables.baseMapCheck] + key,
      crossOrigin: "Anonymous"
    })
  });


  useEffect(() => {
    variables.map = new maplibregl.Map({
      container: mapRef.current,
      center: [-74.1083125, 4.663437], // starting position [lng, lat]
      zoom: 5, // starting zoom,
      pitch: 60
    });

    Object.keys(variables.baseMaps).map((basemap) => {
      variables.map.addSource(basemap, {
        type: "raster",
        tiles: [
          variables.baseMaps[basemap]
        ],
        tileSize: 256
      })

      variables.map.addLayer({
        id: basemap,
        type: "raster",
        source: basemap,
        minZoom: 0,
        maxZoom: 22,
        layout: {
          visibility: 'none'
        }
      })

      if (basemap == variables.baseMapCheck) {
        variables.map.setLayoutProperty(basemap, 'visibility', 'visible');
      }
    });

    variables.map.addControl(new mglStreetViewControl({
      mapillaryAlias: "COZ",
      mapillaryLayerOptions: {
        userKey: false,
        pano: 1
      }
    }), 'top-right');

    loadLayers();
    loadPopups();
    // const municipio = municipios.filter((o) => o.cod_dane === ciudadInicial)[0];
    // bboxExtent(municipio.bextent);
    variables.map.addControl(new maplibregl.NavigationControl());
    variables.map.addControl(new maplibregl.ScaleControl({
      position: 'bottom-left',
      unit: 'metric',
      maxWidth: 500
    }));

    // change mouse cursor when over marker
    variables.map.on('mousemove', function (e) {
      if (e.dragging) {
        return;
      }

      let coordinates = e.lngLat.wrap();
      coordinates = "Lat: " + coordinates.lat.toFixed(4) + " N," + "Long: " + coordinates.lng.toFixed(4) + " W";
      document.getElementById("coordenates__panel").innerHTML = coordinates;
    });

  }, []);

  // Adicionar control de zoom al mapa
  var zoom = new Zoom();
  let currZoom = 1;

  const bboxExtent = (bbox) => {
    bbox = bbox.replace('BOX(', '').replace(')', '')
    bbox = bbox.split(",")
    let bbox1 = bbox[0].split(" ")
    let bbox2 = bbox[1].split(" ")
    let boundary = [[bbox1[0], bbox1[1]], [bbox2[0], bbox2[1]]];
    variables.map.flyTo({
      center: [-74, 4],
      zoom: 10,
      essential: false // this animation is considered essential with respect to prefers-reduced-motion
    });
    variables.map.fitBounds(boundary);
    variables.map.fire('flystart');
  }

  return (
    <div>
      <div id="map">
        <ul className='switch'>
          <li id="switch_visualization"><TipoVisualizacion /></li>
        </ul>

        <div ref={mapRef} className="mapa"></div>

        <div className="coordenates">
          <div id="coordenates__panel"></div>
          <ToastContainer
            position="top-center" />

        </div>
      </div>
    </div>
  )
}
var buttons = document.querySelectorAll(".toggle-button");
var modal = document.querySelector("#modal");



[].forEach.call(buttons, function (button) {
  button.addEventListener("click", function () {
    modal.classList.toggle("off");
  })
});

// Nueva función carga de capas MapLibre
function loadLayers() {
  let layers = variables.layers;
  Object.keys(layers).map((layer) => {
    let infoLayer = layers[layer];
    if (infoLayer.tipo == 'vt') {
      variables.map.addSource(infoLayer.id, {
        type: "vector",
        tiles: [
          infoLayer.url
        ],
        promoteId: 'id'
      })

      variables.map.addLayer({
        id: infoLayer.id,
        type: infoLayer.typeLayer,
        source: infoLayer.id,
        "source-layer": infoLayer.layer,
        paint: infoLayer.style
      })

      variables.map.setLayerZoomRange(infoLayer.id, infoLayer.minZoom, infoLayer.maxZoom)

      variables.capas[infoLayer.id] = variables.map.getLayer(infoLayer.id);
      if (!infoLayer.visible) {
        variables.map.setLayoutProperty(infoLayer.id, 'visibility', 'none');
      }

      let ident = infoLayer.id;
      let elementLyr = {};
      elementLyr[ident] = variables.capas[infoLayer.id];
      variables.layersInMap.push(elementLyr);

    } else if (infoLayer.tipo == 'wms') {
      //TO-DO
    }
  })
}

// Nueva función carga de popups MapLibre
function loadPopups() {
  let layers = variables.layers;
  Object.keys(layers).map((layer) => {
    let infoLayer = layers[layer];
    if (infoLayer.tipo == 'vt' && infoLayer.clickable) {

      variables.map.on('click', infoLayer.id, (e) => {
        const feature = e.features[0];
        const coordinates = e.lngLat;
        const valor = e.features[0].state.valor;
        const deptoCodigo = feature.properties.id.substring(0, 2);
        const mpioCodigo = feature.properties.id.substring(2, 5);
        const departamentosFilter = (departamentos).filter(result => (result.cod_dane == deptoCodigo));
        const municipiosFilter = (municipios).filter(result => (result.cod_dane == deptoCodigo + mpioCodigo));
        const dataSubgrupo = variables.tematica["CATEGORIAS"][variables.varVariable][0]["SUBGRUPO"];
        const dataUnidades = variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"];
        const dataCategorias = variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"];
        const tipoVariable = variables.tematica["CATEGORIAS"][variables.varVariable][0]["TIPO_VARIABLE"];
        const nfObject = new Intl.NumberFormat("es-ES");
        const valorFormateado = nfObject.format(valor);
        let HTML = "";
        HTML = '<p class="popup__list"><span class="popup__title">' + dataSubgrupo + ' (' + variables.versionMGN + ')</span></p>';
        HTML += '<p class="popup__list"><span class="popup__subtitle">' + dataCategorias + '</span> ' + '</p>';

        // console.log("VARIABLES", variables.varVariable);

        if (variables.varVariable === "39501002" || variables.varVariable === "38201002") {
          HTML += '<p class="popup__list"><span class="popup__subtitle">Variación (porcentaje): </span><span class="popup__subtitle">' + valorFormateado + '</span></p>';
        } else {
          HTML += '<p class="popup__list"><span class="popup__subtitle">Valor: </span><span class="popup__subtitle">' + valorFormateado + ' ' + dataUnidades + '</span></p>';
        }

        HTML += '<hr>' + '</hr>';
        HTML += '<p class="popup__list"><span class="popup__thirdtitle"> Departamento:</span> ' + departamentosFilter[0].name + '</p>';

        if (municipiosFilter.length != 0) {
          HTML += '<p class="popup__list"><span class="popup__thirdtitle"> Municipio:</span> ' + municipiosFilter[0].name + '</p>';
        }

        HTML += '<p class="popup__list"><span class="popup__thirdtitle"> Cod. DANE:</span> ' + feature.properties.id + '</p>';

        new maplibregl.Popup()
          .setLngLat(coordinates)
          .setHTML(HTML)
          .addTo(variables.map);
      })

    }
  })
}

//VARIABLES PARA PINTAR MAPA
variables.changeMap = function (nivel, dpto, table) {
  unidadesAbsolutas = variables.varVariable.includes("284") ? "m<sup>2</sup>" : variables.varVariable.includes("292") ? "licencias" : "$";
  let campos1 = ((variables.queryText[variables.varVariable.substring(0, 5)]).replace('SELECT', '')).split("FROM")
  let campos = campos1[0].split(",")
  let tipoVariable = variables.tematica["CATEGORIAS"][variables.varVariable][0]["TIPO_VARIABLE"];

  for (let index = 0; index < campos.length; index++) {
    if (tipoVariable === "VC") {
      if (campos[index].indexOf(variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA2"]) != "-1") {
        let arrField = (campos[index]).split(" ")
        arrField = cleanArray(arrField)

        if ((variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA2"]).trim() == arrField[0].trim()) {
          variables.alias = (arrField[arrField.length - 1]).trim() // definir el tipo de variable que se debe previsualizar
          variables.valorTotal = variables.alias.replace('PP', 'V')
        }
      }
      else if (campos[index].indexOf(variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA"]) != "-1") {
        let arrField = (campos[index]).split(" ")
        arrField = cleanArray(arrField)
        if ((variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA"]).trim() == arrField[0].trim()) {
          variables.alias2 = (arrField[arrField.length - 1]).trim() //definir el tipo de variable que se debe previsualizar
          variables.valorTotal = variables.alias2.replace('V', 'PP')
        }
      }
    }
    else {
      if (campos[index].indexOf(variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA"]) != "-1") {
        let arrField = (campos[index]).split(" ")
        arrField = cleanArray(arrField)
        if ((variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA"]).trim() == arrField[0].trim()) {
          variables.alias = (arrField[arrField.length - 1]).trim() // definir el tipo de variable que se debe previsualizar
          variables.valorTotal = variables.alias.replace('V', 'PP')
        }
      }
    }
  }


  if (nivel == "DPTO") {
    const capa = "deptos_vt";
    let valor2Array = [];
    var integrado = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel]).map(function (a, b) {
      let valor, valor2
      // if (a["G"] === variables.periodoSeleccionado.value) {
      if (a[variables.alias].includes(",")) {
        valor = parseFloat(a[variables.alias]).toFixed(2).toLocaleString("de-De").replace(",", ".")
      } else {
        valor = parseFloat(a[variables.alias]).toFixed(2)
      }


      if (a[variables.alias2] != undefined) {
        if (a[variables.alias2].includes(",")) {
          valor2 = parseFloat(a[variables.alias2]).toFixed(2).toLocaleString("de-De").replace(",", ".")
        } else {
          valor2 = parseFloat(a[variables.alias2])
        }

        if (!isNaN(valor2)) {
          valor2Array.push(valor2);
        }

      }




      if (valor != undefined && !isNaN(valor)) {
        variables.map.setFeatureState({
          source: capa,
          sourceLayer: 'mgn_2020_dpto_politico',
          id: String(a["ND"])
        }, {
          valor: valor
        })

        return valor
      } else if (valor2 != undefined && !isNaN(valor2)) {
        variables.map.setFeatureState({
          source: capa,
          sourceLayer: 'mgn_2020_dpto_politico',
          id: String(a["ND"])
        }, {
          valor: valor2
        })

        return valor2
      } else {
        variables.map.setFeatureState({
          source: capa,
          sourceLayer: 'mgn_2020_dpto_politico',
          id: String(a["ND"])
        }, {
          valor: 0
        })

        return 0
      }
      // }

    }, []);

    max = Math.max(...integrado);
    min = Math.min(...integrado);
    max2 = Math.max(...valor2Array);
    variables.max = valor2Array.length === 0 ? max : max2;

    let list = integrado.filter((x, i, a) => a.indexOf(x) == i)

    // LEYENDA NIVEL DPTO
    var serie = new geostats(list);
    let dataUnidades = variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"];

    let paintPropertyRanges = [];
    paintPropertyRanges.push("step");
    paintPropertyRanges.push(["to-number", ["feature-state", "valor"]]);

    if (serie.getClassJenks(5) != undefined) {

      for (let index = 0; index < (serie.ranges).length; index++) {
        let rangeSplit = serie.ranges[(serie.ranges).length - (index + 1)].split(" - ");
        let newRange = parseFloat(rangeSplit[0]).toLocaleString("de", "DE") + " - " + parseFloat(rangeSplit[1]).toLocaleString("de", "DE");
        let rango = newRange + " (" + dataUnidades + ")";
        if (index == 0) {
          rango = rango.split("-")
          rango = " > " + rango[0].trim() + " (" + dataUnidades + ")"
        }

        variables.coloresLeyend[variables.varVariable]["DPTO"][index][2] = rango;
        variables.coloresLeyend[variables.varVariable]["DPTO"][index][3] = "visible";
      }
    }

    const coloresCopy = [...variables.coloresLeyend[variables.varVariable]["DPTO"]];

    coloresCopy.reverse().forEach((color, index) => {
      let maxNumberRange = color[2].split("-")[1];
      if (maxNumberRange != undefined) {
        console.log("COLOR", Number(maxNumberRange.split(" (")[0]));
        maxNumberRange = Number(maxNumberRange.split(" (")[0].replaceAll(".", ""));
      }

      if (index === 4) {
        paintPropertyRanges.push(color[0]);
      } else {
        paintPropertyRanges.push(color[0]);
        paintPropertyRanges.push(maxNumberRange);
      }
    })

    variables.map.setPaintProperty(capa, "fill-extrusion-color", paintPropertyRanges);

    variables.map.setPaintProperty(capa, 'fill-extrusion-height', ["*", 0.1, ["to-number", ["feature-state", "valor"]]]);

    // DATOS TABLA POR DEPARTAMENTO
    let labelsData = []
    let data = []
    let colors = []
    let dataTable = []
    let colsTable = []

    if (tipoVariable === "VC") {
      colsTable = [
        { title: "Código", field: "codigo", hozAlign: "right", width: "150", headerSort: true, headerFilter: true, headerFilterPlaceholder: "Código..." },
        { title: "Departamento", field: "depto", width: "150", headerFilter: true, headerSort: true, headerFilterPlaceholder: "Departamento..." },
        { title: "Cantidad (" + unidadesAbsolutas + ")", field: "valor2", hozAlign: "right", width: "300", headerFilter: true, headerSort: true, headerFilterPlaceholder: "Cantidad..." },
        { title: "Porcentaje (%)", field: "valor", hozAlign: "right", width: "400", headerFilter: true, headerSort: true, headerFilterPlaceholder: "Porcentaje..." },
        {
          title: "Distribución (%)", field: "valor", hozAlign: "left", formatter: "progress", formatterParams: {
            color: variables.coloresLeyend[variables.varVariable][nivel][2][0]
          }
        }
      ]
    } else {
      colsTable = [
        { title: "Código", field: "codigo", hozAlign: "right", width: "150", headerFilter: true, headerSort: true, headerFilterPlaceholder: "Código..." },
        { title: "Departamento", field: "depto", width: "150", headerFilter: true, headerSort: true, headerFilterPlaceholder: "Departamento..." },
        { title: "Valor (" + unidadesAbsolutas + ")", field: "valor", hozAlign: "right", width: "300", headerFilter: true, headerSort: true, headerFilterPlaceholder: "Cantidad..." },
        {
          title: "Distribución (Cantidad)", field: "valorGraf", hozAlign: "left", formatter: "progress", formatterParams: {
            color: variables.coloresLeyend[variables.varVariable][nivel][2][0]
          }
        }
      ]
    }

    var labels = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel]).map(function (a, b) {

      let valor = parseFloat(a[variables.alias]).toFixed(2).replace(".", ",");
      let valor2 = parseFloat(a[variables.alias2]).toLocaleString("de-De").replace(",", ".")

      if (a[variables.alias].includes(",")) {
        valor = parseFloat(a[variables.alias].replace(".", ",")).toFixed(2)
        valor2 = parseFloat(a[variables.alias2].replace(",", "."))
      } else {
        valor = parseFloat(a[variables.alias].replace(".", ",")).toFixed(2)
        valor2 = parseFloat(a[variables.alias2])
      }

      let depto = (departamentos).filter(result => (result.cod_dane == a["ND"]))
      labelsData.push(depto[0].name.length > 18 ? [depto[0].name.substring(0, 17), depto[0].name.substring(18, depto[0].name.length)] : depto[0].name)
      // console.log(valor)
      data.push(valor);

      dataTable.push({ depto: depto[0].name, codigo: depto[0].cod_dane, valor: valor, valor2: valor2, valorGraf: (parseFloat(valor) * 100) / max });

      let shouldSkip = false;
      (variables.coloresLeyend[variables.varVariable][nivel]).forEach((value) => {
        let element = value[2].split("-")
        let colour

        if (shouldSkip) {
          return;
        }

        if (element.length == 1) {
          if (parseFloat(valor) >= parseFloat((element[0].replace(">", "").trim()))) {
            colour = value[0];
            colors.push(colour)
            shouldSkip = true
          }
        } else {
          if (parseFloat(valor) >= parseFloat(element[0]) && parseFloat(valor) <= parseFloat(element[1])) {
            colour = value[0];
            colors.push(colour)
            shouldSkip = true
          }
        }


      })
    }, []);

    variables.changeLegend(nivel);
    variables.legenTheme();
    // if (table == "y") {
    //   let orderData = dataTable.sort((a, b) => {
    //     if (parseFloat(a.valor) > parseFloat(b.valor)) {
    //       return -1;
    //     } else if (parseFloat(a.valor) < parseFloat(b.valor)) {
    //       return 1;
    //     }
    //     return 0;
    //   })

    //   // variables.updateData(orderData, colsTable);
    // }

    // if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined) {
    //   variables.filterGeo("DPTO", variables.deptoSelectedFilter)
    // } else {
    //   const capa = "deptos_vt";
    //   let layer = variables.capas['deptos_vt'];
    //   layer.setStyle(function (feature) {
    //     var layer = feature.get("id");
    //     return changeSymbologi(layer, nivel, feature)
    //   })

    //   localStorage.getItem("visualization") === "symbols" ? layer.setVisible(false) : layer.setVisible(true);


    //   variables.unidadesDepto.setStyle(function (feature) {
    //     const id = feature.values_.features[0].values_.cod_dane;
    //     return changeSymbologiCluster(id, nivel, min, max, max2);
    //   })
    // }

  }
  else if (nivel == "MPIO") {
    let valor2Array = [];

    var integrado = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).map(function (a, b) {
      let valor, valor2;

      if (dpto !== 0) {
        if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value && a["COD_DPTO"] === dpto) {
          if (a[variables.alias].includes(",")) {
            valor = parseFloat(a[variables.alias].replace(",", ".")).toFixed(2).toLocaleString("de-De")
          } else {
            valor = parseFloat(a[variables.alias]).toFixed(2)
          }


          if (a[variables.alias2] != undefined) {

            if (a[variables.alias2].includes(",")) {
              valor2 = parseFloat(a[variables.alias2]).toFixed(2).toLocaleString("de-De").replace(",", ".")
            } else {
              valor2 = parseFloat(a[variables.alias2])
            }

            if (!isNaN(valor2)) {
              if (variables.deptoSelectedFilter != undefined) {
                if (a[nivel].substring(0, 2) === variables.deptoSelectedFilter) {
                  valor2Array.push(valor2);
                }
              } else {
                valor2Array.push(valor2);
              }

            }

          }


          if (valor != undefined && !isNaN(valor)) {
            return valor;
          } else if (valor2 != undefined && !isNaN(valor2)) {
            if (variables.deptoSelectedFilter != undefined) {
              if (a[nivel].substring(0, 2) === variables.deptoSelectedFilter) {
                return valor2
              } else {
                return 0;
              }
            } else {
              return valor2
            }

          } else {
            return 0
          }
        } else {
          return 0;
        }
      } else {
        if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value) {
          if (a[variables.alias].includes(",")) {
            valor = parseFloat(a[variables.alias].replace(",", ".")).toFixed(2).toLocaleString("de-De")
          } else {
            valor = parseFloat(a[variables.alias]).toFixed(2)
          }


          if (a[variables.alias2] != undefined) {

            if (a[variables.alias2].includes(",")) {
              valor2 = parseFloat(a[variables.alias2]).toFixed(2).toLocaleString("de-De").replace(",", ".")
            } else {
              valor2 = parseFloat(a[variables.alias2])
            }

            if (!isNaN(valor2)) {
              if (variables.deptoSelectedFilter != undefined) {
                if (a[nivel].substring(0, 2) === variables.deptoSelectedFilter) {
                  valor2Array.push(valor2);
                }
              } else {
                valor2Array.push(valor2);
              }

            }

          }


          if (valor != undefined && !isNaN(valor)) {
            return valor;
          } else if (valor2 != undefined && !isNaN(valor2)) {
            if (variables.deptoSelectedFilter != undefined) {
              if (a[nivel].substring(0, 2) === variables.deptoSelectedFilter) {
                return valor2
              } else {
                return 0;
              }
            } else {
              return valor2
            }

          } else {
            return 0
          }
        } else {
          return 0;
        }
      }


    }, []);

    const dataUnidades = variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"];

    if (tipoVariable !== "DV") {
      integrado = integrado.filter(o => o !== 0);
      max = Math.max(...integrado);
      min = Math.min(...integrado);
      max2 = Math.max(...valor2Array);
      variables.max = valor2Array.length === 0 ? max : max2;
      variables.min = min;

      let list = integrado.filter((x, i, a) => a.indexOf(x) == i)
      const rangeNumber = list.length < 5 ? list.length : 5;
      var serie = new geostats(list);

      if (list.length > 3) {
        let classes = 5;

        if (list.length == 2) {
          classes = 2;
          if (serie.getClassJenks(classes).includes(undefined)) {
            classes = 1;
          }
        } else {
          if (serie.getClassJenks(classes).includes(undefined)) {
            classes = 4;
            if (serie.getClassJenks(classes).includes(undefined)) {
              classes = 3;
              if (serie.getClassJenks(classes).includes(undefined)) {
                classes = 2;
              }
            }
          }
        }

        if (serie.getClassJenks(classes) != undefined) {
          for (let index = 0; index < (serie.ranges).length; index++) {
            const searchRegExp = /\./g;
            let rangeSplit = serie.ranges[(serie.ranges).length - (index + 1)].split(" - ");
            let newRange = parseFloat(rangeSplit[0]).toLocaleString("de", "DE") + " - " + parseFloat(rangeSplit[1]).toLocaleString("de", "DE");
            let rango = newRange + " (" + dataUnidades + ")";
            if (index == 0) {
              rango = rango.split("-")
              rango = " > " + rango[0].trim() + " (" + dataUnidades + ")"
            }

            if (table == "y") {
              variables.coloresLeyend[variables.varVariable]["MPIO"][index][2] = rango;
            }

          }
        }


        variables.coloresLeyend[variables.varVariable]["MPIO"].map((color, idx) => {
          if (idx >= rangeNumber) {
            variables.coloresLeyend[variables.varVariable]["MPIO"][idx][3] = "hidden";
          } else {
            variables.coloresLeyend[variables.varVariable]["MPIO"][idx][3] = "visible";
          }
        })
      }

    } else {
      let integradoPos = integrado.filter(o => o > 0);
      let integradoNeg = integrado.filter(o => o < 0);
      integradoPos.push(0.1);
      integradoNeg.push(-0.1);
      let listPos = integradoPos.filter((x, i, a) => a.indexOf(x) == i);
      let listNeg = integradoNeg.filter((x, i, a) => a.indexOf(x) == i);
      let rangeNumber = 2;
      let seriePos = new geostats(listPos);
      let serieNeg = new geostats(listNeg);
      if (seriePos.getClassJenks(rangeNumber).includes(undefined)) {
        rangeNumber = 1
      }
      if (seriePos.getClassJenks(rangeNumber) != undefined) {
        for (let index = 0; index < (seriePos.ranges).length; index++) {
          let rangeSplit = seriePos.ranges[(seriePos.ranges).length - (index + 1)].split(" - ");
          let newRange = parseFloat(rangeSplit[0]).toLocaleString("de", "DE") + " - " + parseFloat(rangeSplit[1]).toLocaleString("de", "DE");
          let rango = newRange + " (" + dataUnidades + ")";
          if (index == 0) {
            rango = rango.split("-")
            rango = " > " + rango[0].trim() + " (" + dataUnidades + ")"
          }

          variables.coloresLeyend[variables.varVariable]["MPIO"][index][2] = rango;

        }
      }

      variables.coloresLeyend[variables.varVariable]["MPIO"][2][2] = '0 ' + dataUnidades;
      rangeNumber = 2;
      if (serieNeg.getClassJenks(rangeNumber).includes(undefined)) {
        rangeNumber = 1;
      }

      if (serieNeg.getClassJenks(rangeNumber) != undefined) {
        for (let index = 0; index < (serieNeg.ranges).length; index++) {
          let rangeSplit = serieNeg.ranges[(serieNeg.ranges).length - (index + 1)].split(" - ");
          let newRange = parseFloat(rangeSplit[1]).toLocaleString("de", "DE") + " - " + parseFloat(rangeSplit[0]).toLocaleString("de", "DE");
          let rango = newRange + " (" + dataUnidades + ")";
          if (index === serieNeg.ranges.length - 1) {
            rango = rango.split(" - ");
            rango = " < " + rango[0].trim();
          }
          variables.coloresLeyend[variables.varVariable]["MPIO"][index + 3][2] = rango;

        }
      }

      variables.coloresLeyend[variables.varVariable]["MPIO"].map((color, idx) => {
        if (color[2] === 0) {
          variables.coloresLeyend[variables.varVariable]["MPIO"][idx][3] = "hidden";
        } else {
          variables.coloresLeyend[variables.varVariable]["MPIO"][idx][3] = "visible";
        }
      })

    }



    let layer = variables.capas['mpios_vt'];
    let extent = variables.map.getView().calculateExtent();
    let f = layer.getSource().getFeaturesInExtent(extent);



    // DATOS TABLA POR MUNICIPIO
    let labelsData = []
    let data = []
    let colors = []
    let dataTable = []
    let colsTable = []
    if (tipoVariable === "VC") {
      colsTable = [
        { title: "Departamento", field: "depto", width: "150", headerFilter: true, headerFilterPlaceholder: "Departamento..." },
        { title: "Cód. Municipio", field: "codigo", width: 150, headerFilter: true, headerFilterPlaceholder: "Código..." },
        { title: "Municipio", field: "mpio", width: "200", headerFilter: true, headerFilterPlaceholder: "Municipio..." },
        { title: "Cantidad de licencias", field: "valor2", width: "300", headerFilter: true, headerFilterPlaceholder: "Cantidad..." },
        { title: "Porcentaje de licencias (%)", field: "valor", width: "300", headerFilter: true, headerFilterPlaceholder: "Porcentaje..." },
        {
          title: "Distribución (%)", field: "valor", hozAlign: "left", formatter: "progress", formatterParams: {
            color: variables.coloresLeyend[variables.varVariable][nivel][2][0]
          }
        }
      ]
    } else {
      colsTable = [
        { title: "Departamento", field: "depto", width: "150", headerFilter: true, headerFilterPlaceholder: "Departamento..." },
        { title: "Cód. Municipio", field: "codigo", width: 150, headerFilter: true, headerFilterPlaceholder: "Código..." },
        { title: "Municipio", field: "mpio", width: "200", headerFilter: true, headerFilterPlaceholder: "Municipio..." },
        tipoVariable === "DV" ?
          { title: "Variación porcentual", field: "valor", width: "300", headerFilter: true, headerFilterPlaceholder: "Variación..." } :
          { title: "Precio promedio actual", field: "valor", width: "300", headerFilter: true, headerFilterPlaceholder: "Precio..." },
      ]
    }

    Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).map(function (a, b) {

      if (dpto !== 0) {
        if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value && a["COD_DPTO"] === dpto) {
          let valor = parseFloat(a[variables.alias]).toFixed(2)
          let valor2 = parseFloat(a[variables.alias2])
          let mpio = (municipios).filter(result => (result.cod_dane == a["COD_MPIO"]))
          let depto = (departamentos).filter(result => (result.cod_dane == a["COD_MPIO"].substring(0, 2)))

          if (dpto != null) {
            depto = (departamentos).filter(result => (result.cod_dane == dpto))
            if (mpio[0].cod_dane.substring(0, 2) == dpto) {
              dataTable.push({ depto: depto[0].name, mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor, valor2: valor2 });
            }

          } else {
            let shouldSkipp = false;
            labelsData.push(mpio[0].name);
            data.push(valor);
            dataTable.push({ depto: depto[0].name, mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor });
          }
        }
      } else {
        if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value) {

          let valor = parseFloat(a[variables.alias]).toFixed(2)
          let valor2 = parseFloat(a[variables.alias2])
          let mpio = (municipios).filter(result => (result.cod_dane == a["COD_MPIO"]))
          let depto = (departamentos).filter(result => (result.cod_dane == a["COD_MPIO"].substring(0, 2)))
          if (dpto != 0) {
            depto = (departamentos).filter(result => (result.cod_dane == dpto))
            if (mpio[0].cod_dane.substring(0, 2) == dpto) {
              dataTable.push({ depto: depto[0].name, mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor, valor2: valor2 });
            }

          } else {
            let shouldSkipp = false;
            labelsData.push(mpio[0].name);
            data.push(valor);
            dataTable.push({ depto: depto[0].name, mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor });
          }
        }
      }

    }, []);

    variables.changeLegend(nivel);
    variables.legenTheme();

    if (table == "y") {
      // variables.updateData(dataTable, colsTable);
    }

    variables.changeLegend(nivel);

    if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined) {
      variables.filterGeo("DPTO", variables.deptoSelectedFilter)
    } else {
      let layer = variables.capas['mpios_vt'];
      layer.setStyle(function (feature) {
        var layer = feature.get("id");
        return changeSymbologi(layer, nivel, feature)
      })

      localStorage.getItem("visualization") === "symbols" ? layer.setVisible(false) : layer.setVisible(true);
      variables.unidadesMpio.setStyle(function (feature) {
        const id = feature.values_.features[0].values_.cod_dane;
        return changeSymbologiCluster(id, nivel, min, max, max2);
      })
      if (dpto == null) {
        layer.setStyle(function (feature) {
          var layer = feature.get("id");
          return changeSymbologi(layer, nivel, feature)
        })
      }
    }

    localStorage.getItem("visualization") === "symbols" ? layer.setVisible(false) : layer.setVisible(true);

  } else if (nivel == "SECC") {

    var integrado = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel]).map(function (a, b) {
      let valor = parseFloat(a[variables.alias]).toFixed(2)
      if (valor != undefined && !isNaN(valor)) {
        return valor;
      } else {
        return 0
      }
    }, []);

    let list = integrado.filter((x, i, a) => a.indexOf(x) == i)
    let dataUnidades = variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"];
    var serie = new geostats(list);
    // console.log(serie)
    if (serie.getClassJenks(5) != undefined) {
      for (let index = 0; index < (serie.ranges).length; index++) {
        const searchRegExp = /\./g;
        let rango = serie.ranges[(serie.ranges).length - (index + 1)].replace(searchRegExp, ",") + " (" + dataUnidades + ")"
        if (index == 0) {
          rango = rango.split("-")
          rango = " > " + rango[0].trim() + " (" + dataUnidades + ")"
        }
        variables.coloresLeyend[variables.varVariable]["SECC"][index][2] = rango;

      }
    }


    // DATOS TABLA POR MUNICIPIO
    let labelsData = []
    let data = []
    let colors = []
    let dataTable = []
    let colsTable = []
    if (tipoVariable === "VC") {
      colsTable = [
        { title: "Departamento", field: "depto", width: "150" },
        { title: "Cód. Municipio", field: "codigo", width: 150 },
        { title: "Municipio", field: "mpio", width: "200" },
        { title: "Sección urbana", field: "nsc", width: "200" },
        { title: "Cantidad de licencias", field: "valor2", width: "300" },
        { title: "Porcentaje de licencias (%)", field: "valor", width: "300" },
        {
          title: "Distribución (%)", field: "valor", hozAlign: "left", formatter: "progress", formatterParams: {
            color: variables.coloresLeyend[variables.varVariable][nivel][2][0]
          }
        }
      ]
    } else {
      colsTable = [
        { title: "Departamento", field: "depto", width: "150" },
        { title: "Cód. Municipio", field: "codigo", width: 150 },
        { title: "Municipio", field: "mpio", width: "200" },
        { title: "Sección urbana", field: "nsc", width: "200" },
        { title: "Valor", field: "valor2", width: "300" },
        {
          title: "Distribución (Cantidad)", field: "valor2", hozAlign: "left", formatter: "progress", formatterParams: {
            color: variables.coloresLeyend[variables.varVariable][nivel][2][0]
          }
        }
      ]
    }

    var labels = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel]).map(function (a, b) {

      let valor = parseFloat(a[variables.alias]).toFixed(2)
      let valor2 = parseFloat(a[variables.alias2])
      let lvl = "NSC";

      let mpio = (municipios).filter(result => (result.cod_dane == a[lvl].substring(0, 5)))
      let depto = (departamentos).filter(result => (result.cod_dane == a[lvl].substring(0, 2)))

      if (depto.length > 0) {
        labelsData.push(depto[0].name.length > 18 ? [depto[0].name.substring(0, 17), depto[0].name.substring(18, depto[0].name.length)] : depto[0].name)
        // console.log(valor)
        data.push(valor);

        dataTable.push({ depto: depto[0].name, codigo: mpio[0].cod_dane, mpio: mpio[0].name, nsc: a[lvl], valor: valor, valor2: valor2 });

        let shouldSkip = false;
        (variables.coloresLeyend[variables.varVariable][nivel]).forEach((value) => {
          let element = String(value[2]).split("-")
          let colour

          if (shouldSkip) {
            return;
          }

          if (element.length == 1) {
            if (parseFloat(valor) >= parseFloat((element[0].replace(">", "").trim()))) {
              colour = value[0];
              colors.push(colour)
              shouldSkip = true
            }
          } else {
            if (parseFloat(valor) >= parseFloat(element[0]) && parseFloat(valor) <= parseFloat(element[1])) {
              colour = value[0];
              colors.push(colour)
              shouldSkip = true
            }
          }


        })
      }

    }, []);


    variables.changeLegend(nivel);
    variables.legenTheme();

    let layer = variables.capas["secc_vt"];


    layer.setStyle(function (feature) {
      var field = feature.get("id");
      return changeSymbologi(field, nivel, feature, layer)
    })

  } else if (nivel == "MNZN") {

    let dataTable = []
    let colsTable = []
    let labelsChart = [];
    let colorsChart = [];

    let integrado_mnzn;

    const capa = variables.varVariable === "38201001" ? "manzanas" :
      variables.varVariable === "39501001" ? "manzanas2022" :
        variables.varVariable === "38202001" ? "secciones" :
          variables.varVariable === "39502001" ? "secciones2022" :
            variables.varVariable === "38201002" ? "manzanasVariacion" :
              variables.varVariable === "39501002" ? "manzanasVariacion2022" : null;

    integrado_mnzn = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][dpto]).map(function (value) {
      let valor = parseFloat(value[variables.alias].replace(",", "."))

      let mpio = (municipios).filter(result => (result.cod_dane == value["MPIO"]));
      dataTable.push({ cod_dane: value["NM"], mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor });

      if (valor != undefined && !isNaN(valor)) {

        variables.map.setFeatureState({
          source: capa,
          sourceLayer: 'MGN_2018_URB_MANZANA',
          id: String(value["NM"])
        }, {
          viviendas: valor
        })

        return valor;

      } else {

        return 0;

      }

    }, []);



    let list = integrado_mnzn.filter((x, i, a) => a.indexOf(x) == i)


    var serie = new geostats(list);

    let paintPropertyRanges = [];
    paintPropertyRanges.push("step");
    paintPropertyRanges.push(["to-number", ["feature-state", "viviendas"]]);

    if (serie.getClassJenks(5) != undefined) {
      for (let index = 0; index < (serie.ranges).length; index++) {

        let rango = serie.ranges[(serie.ranges).length - (index + 1)]

        if (index == 0) {

          rango = rango.split("-")

          rango = " > " + rango[0].trim()

        }

        variables.coloresLeyend[variables.varVariable]["MNZN"][index][2] = rango;
        variables.coloresLeyend[variables.varVariable]["MNZN"][index][3] = "visible";
        labelsChart.push(rango);
        colorsChart.push(variables.coloresLeyend[variables.varVariable]["MNZN"][index][0]);
      }

    }

    const coloresCopy = [...variables.coloresLeyend[variables.varVariable]["MNZN"]];

    coloresCopy.reverse().forEach((color, index) => {
      let maxNumberRange = Number(color[2].split("-")[1]);
      if (index === 4) {
        paintPropertyRanges.push(color[0]);
      } else {
        paintPropertyRanges.push(color[0]);
        paintPropertyRanges.push(maxNumberRange);
      }
    })


    variables.map.setPaintProperty(capa, "fill-extrusion-color", paintPropertyRanges);



    colsTable = [
      { title: "Cód. DANE", field: "cod_dane", hozAlign: "right", width: "150", headerSort: true, headerFilter: true, headerFilterPlaceholder: "Cód. DANE..." },
      { title: "Municipio", field: "mpio", width: "150", headerFilter: true, headerSort: true, headerFilterPlaceholder: "Municipio..." },
      { title: "Cantidad (Viviendas)", field: "valor", hozAlign: "right", width: "300", headerFilter: true, headerSort: true, headerFilterPlaceholder: "Cantidad..." }
    ];

    let orderData = dataTable.sort((a, b) => {
      if (parseFloat(a.valor) > parseFloat(b.valor)) {
        return -1;
      } else if (parseFloat(a.valor) < parseFloat(b.valor)) {
        return 1;
      }
      return 0;
    })

    // variables.updateData(orderData, colsTable);

    variables.changeBarChartData(labelsChart, colorsChart, orderData, nivel);

  }

  variables.changeLegend(nivel);
  variables.legenTheme();
}

const updateRangeSimbology = (valorCampo, nivel, colorInput) => {
  let color = colorInput;
  const tipoVariable = variables.tematica["CATEGORIAS"][variables.varVariable][0]["TIPO_VARIABLE"];

  if (tipoVariable === "DV") {
    if (valorCampo.length > 0) {

      for (let index = 0; index < variables.coloresLeyend[variables.varVariable][nivel].length; index++) {
        const obj = variables.coloresLeyend[variables.varVariable][nivel][index];
        let element = obj[2];
        element = String(element).split(' - ');
        if (element.length == 1) {
          const valorEvaluado = parseFloat(valorCampo[0][variables.alias].replaceAll(',', '.')).toFixed(2);
          const valorElemento = parseFloat(element[0].replace(">", "").replace("<", "").replaceAll(',', '.').replace("%", "").trim()).toFixed(2);

          if (valorEvaluado > 0) {
            if (valorElemento > 0) {
              if (valorEvaluado
                >= valorElemento) {
                color = obj[0];
                break;
              }
            }

          } else if (valorEvaluado < 0 && valorElemento) {
            if (valorElemento < 0) {
              if (valorEvaluado
                <= valorElemento) {
                color = obj[0];
                break;
              }
            }

          } else {
            color = obj[0];
            break;
          }


        } else {
          const valorEvaluado = parseFloat(valorCampo[0][variables.alias].replaceAll(',', '.')).toFixed(2);
          const valorElemento0 = parseFloat(element[0].replaceAll(',', '.').replace("%", ""));
          const valorElemento1 = parseFloat(element[1].replaceAll(',', '.').replace("%", ""));

          if (valorEvaluado > 0) {
            if (valorElemento0 > 0) {
              if (valorEvaluado < valorElemento1
                && valorEvaluado >= valorElemento0) {
                color = obj[0];
                break;
              }
            }

          } else if (valorEvaluado < 0) {
            if (valorElemento0 < 0) {
              if (valorEvaluado <= valorElemento0
                && valorEvaluado > valorElemento1) {
                color = obj[0];
                break;
              }
            }

          } else {
            color = obj[0];
            break;
          }

        }
      }
    }
  } else {
    if (valorCampo.length > 0) {
      for (let index = 0; index < variables.coloresLeyend[variables.varVariable][nivel].length; index++) {
        const obj = variables.coloresLeyend[variables.varVariable][nivel][index];
        if (obj[3] === "visible") {
          let element = obj[2];
          element = String(element).split(' - ');
          if (element.length == 1) {
            if (parseFloat(valorCampo[0][variables.alias]).toFixed(2)
              >= parseFloat(element[0].replace(">", "").replaceAll('.', '').replace("($)", "").trim())) {
              color = obj[0];
              break;
            }
          } else {
            if (parseFloat(valorCampo[0][variables.alias]).toFixed(2) >= parseFloat(element[0].replaceAll('.', '').replace("%", ""))
              && parseFloat(valorCampo[0][variables.alias]).toFixed(2) <= parseFloat(element[1].replaceAll('.', '').replace("%", ""))) {
              color = obj[0];
              break;
            }
          }
        }
      }
    }
  }



  return color === undefined ? colorInput : color;
}

function changeSymbologi(cluster, nivel, feature, layer) {
  let color = "#FFFFFF1A";
  if (variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][cluster.substring(0, 2)] !== undefined && nivel === "MNZN") {
    const valorCampo = variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][cluster.substring(0, 2)][cluster];
    color = updateRangeSimbology(valorCampo, nivel, color);
  } else {
    const valorCampo = variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value].filter((a) => {
      if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value
        && a["COD_MPIO"] === cluster) {
        return a;
      }
    });
    if (valorCampo.length > 0) {
      if (valorCampo[0]["FECHA"] === variables.periodoSeleccionado.value && valorCampo[0]["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value) {
        color = updateRangeSimbology(valorCampo, nivel, color);
      }
    }

  }

  let strokeColor

  let layerName = feature.properties_.layer;
  layerName == 'mgn_2020_dpto_politico' ? strokeColor = '#FFFFFF' : layerName == 'MGN_2018_URB_MANZANA' ? strokeColor = '#FFFFFF00' : strokeColor = '#adaba3'

  let fill = new Fill({
    color: color
  });
  let stroke = new Stroke({
    color: strokeColor,
    width: 1
  })
  let styleLyr = new Style({
    stroke: stroke,
    fill: fill
  });

  return styleLyr
}

function changeSymbologiCluster(cluster, nivel, min, max, max2) {
  let color = "#FFFFFF80";
  let valorCampo = "";
  let radioValor = 0;

  if (variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][cluster.substring(0, 2)] !== undefined && nivel === "MNZN") {
    const valorCampo = variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][cluster.substring(0, 2)][cluster];
    color = updateRangeSimbology(valorCampo, nivel, color);
  } else {
    const valorCampo = variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value].filter((a) => {
      if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value
        && a["COD_MPIO"] === cluster) {
        return a;
      }
    });

    if (valorCampo.length > 0) {

      if (valorCampo[0]["FECHA"] === variables.periodoSeleccionado.value && valorCampo[0]["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value) {
        color = updateRangeSimbology(valorCampo, nivel, color);
        let valor = valorCampo[0][variables.alias2] ? valorCampo[0][variables.alias2] : valorCampo[0][variables.alias];
        let maxValor = valorCampo[0][variables.alias2] ? max2 : max;
        radioValor = ((valor.replace(",", ".") - variables.min) / (maxValor - variables.min)) * 35;
      }
    }

  }

  if (nivel === "MPIO") {
    if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined) {
      if (cluster.substring(0, 2) !== variables.deptoSelectedFilter) {
        radioValor = 0;
      }
    }
  }

  if (radioValor > 0) {
    let strokeColor = '#adaba3'
    let fill = new Fill({
      color: color.endsWith("80") ? color : color + "E6"
    });
    let stroke = new Stroke({
      color: strokeColor,
      width: 1
    })
    let styleLyr = new Style({
      image: new CircleStyle({
        radius: radioValor,
        stroke: stroke,
        fill: fill
      })

    });

    return styleLyr
  }


}

variables.filterGeo = (nivel, value) => {
  let layer;
  let layer_2;
  if (nivel == 'DPTO') {
    layer = variables.capas["deptos_vt"];
    let prevStyle = layer.getStyle();
    layer.setStyle(function (feature) {
      var field = feature.get("id");
      return changeSymbologyGeo(field, nivel, feature, layer, value, prevStyle)
    })
    layer_2 = variables.capas["mpios_vt"];
    let prevStyle_2 = layer_2.getStyle();
    layer_2.setStyle(function (feature) {
      var field = feature.get("id");
      return changeSymbologyGeo(field, "MPIO", feature, layer, value, prevStyle_2)
    })
    variables.unidadesMpio.setStyle(function (feature) {
      const id = feature.values_.features[0].values_.cod_dane;
      return changeSymbologiCluster(id, "MPIO", min, max, max2);
    })
    variables.changeStyleDepto();

  } else if (nivel == 'MCPIO') {
    layer = variables.capas["mpios_vt"];
    layer.setStyle(function (feature) {
      var field = feature.get("id");
      return changeSymbologyGeo(field, "MCPIO", feature, layer, value)
    })
  }

  var source = layer.getSource();
  source.tileCache.expireCache({});
  source.tileCache.clear();
  source.refresh();
}

const changeSymbologyGeo = (field, nivel, feature, layer, value) => {

  let style = new Style({

    fill: new Fill({
      color: "#FFFFFF00"
    }),
    stroke: new Stroke({
      color: "#FFFFFF",
      width: 1
    })
  });

  if (nivel == 'DPTO') {
    if (field == value) {
      style = changeSymbologi(field, nivel, feature, layer)
    }
  } else if (nivel == 'MCPIO') {
    if (field == value) {
      style = changeSymbologi(field, "MPIO", feature, layer)
    }
  } else {
    if (field.substring(0, 2) == value) {
      style = changeSymbologi(field, nivel, feature, layer)
    }
  }
  return style;
}

function cleanArray(actual) {
  var newArray = new Array();
  for (var i = 0, j = actual.length; i < j; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

const getDataUE = (municipio, min, max) => {
  return servidorQuery(variables.urlUE + municipio + "&mn=" + min + "&max=" + max)
}

const getCountUE = (municipio) => {
  return servidorQuery(variables.urlCount + municipio)
}

const getDataCentroids = (depto) => {
  return servidorQuery(variables.urlCentroids + depto)
}

const getDataCentroidsGeneral = (capa) => {
  const idCapa = {
    "mgn2021_dpto": "dpto_ccdgo",
    "mgn2021_mpio": "mpio_cdpmp"
  }
  return servidorQuery(variables.urlCentroidsGeneral + "capa=" + capa + "&id=" + idCapa[capa])
}

const crearJson = (res, mpio) => {
  let data = res.data.resultado;
  let largeNames = variables.structureUE;
  let geoObj = {
    'type': 'FeatureCollection',
    'crs': {
      'type': 'name',
      'properties': {
        'name': 'EPSG:4326',
      },
    },
    'features': []
  };

  let lat = 0.0, lon = 0.0, prevLon = 0.0, prevLat = 0.0;
  let feature, properties = {};

  data.forEach((row, index) => {

    if (row.LT != "" && row.LG != "") {
      properties = {};
      lat = parseFloat(row.LT);
      lon = parseFloat(row.LG);

      if (index == 0) {
        prevLon = lon;
        prevLat = lat;
        feature = {
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [lon, lat]
          }
        };
      } else {
        Object.entries(row).map((a) => {
          if (a[0] == "M") {
            return properties[largeNames[a[0]]] = mpio + a[1];
          } else {
            return properties[largeNames[a[0]]] = a[1];
          }
        })

        if ((lon != prevLon) || (lat != prevLat)) {
          prevLon = lon;
          prevLat = lat;
          geoObj.features.push(feature);
          feature = {
            "type": "Feature",
            "properties": properties,
            "geometry": {
              "type": "Point",
              "coordinates": [lon, lat]
            }
          };
          feature.properties["unidad_" + row.E + "_" + row.UE] = properties;
        } else {
          feature.properties["unidad_" + row.E + "_" + row.UE] = properties;
        }
      }
    }
  })

  return geoObj;

}

variables.loadUE = (mpio) => {

  getCountUE(mpio).then((count) => {
    let conteo = count.data.resultado[0]["C"];
    let jump = 20000;
    let jumps = conteo / jump;
    let geojsonObj;
    let offset = 0;

    let vectorSourceCluster = new VectorSource({
      features: []
    });
    variables.unidadesCluster.setSource(new Cluster({
      distance: variables.distanceCluster,
      source: vectorSourceCluster,
    }));
    for (let i = 0; i < jumps; i++) {

      getDataUE(mpio, offset, offset + jump).then(response => {

        if (i === 0) {
          geojsonObj = crearJson(response, mpio)

          vectorSourceCluster.addFeatures(new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeatures(geojsonObj));

          // var source = variables.unidadesCluster.getSource();
          // source.refresh();
          variables.changeLoader(true);

        } else {
          geojsonObj = crearJson(response, mpio)
          vectorSourceCluster.addFeatures(new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeatures(geojsonObj));

        }
      })

      offset = offset + jump;
    }
  })


}

variables.loadMzCentroids = (depto) => {

  getDataCentroids(depto).then((centroids) => {
    const resultado = centroids.data[0].geojson;
    let vectorSourceCluster = new VectorSource({
      features: new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeatures(JSON.parse(resultado))
    });

    variables.unidadesMz.setSource(new Cluster({
      distance: variables.distanceCluster,
      source: vectorSourceCluster
    }))

  })
}

variables.loadDeptoCentroids = () => {

  getDataCentroidsGeneral("mgn2021_dpto").then((centroids) => {
    const resultado = centroids.data[0].geojson;
    let vectorSourceCluster = new VectorSource({
      features: new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeatures(JSON.parse(resultado))
    });

    variables.unidadesDepto.setSource(new Cluster({
      distance: variables.distanceCluster,
      source: vectorSourceCluster
    }))

  })
}

variables.loadMpioCentroids = () => {

  getDataCentroidsGeneral("mgn2021_mpio").then((centroids) => {
    const resultado = centroids.data[0].geojson;
    let vectorSourceCluster = new VectorSource({
      features: new GeoJSON({ featureProjection: 'EPSG:3857' }).readFeatures(JSON.parse(resultado))
    });

    variables.unidadesMpio.setSource(new Cluster({
      distance: variables.distanceCluster,
      source: vectorSourceCluster
    }))

  })
}

variables.changeStyleDepto = () => {
  let layer = variables.capas['deptos_vt'];
  const style = new Style({
    stroke: new Stroke({
      color: '#7F3872',
      width: 3
    }),
    fill: null
  })

  layer.setStyle(style);
  layer.setZIndex(1);
}

variables.changeStyleMpio = () => {
  let layer = variables.capas['mpios_vt'];
  const style = new Style({
    stroke: new Stroke({
      color: '#808080',
      width: 3
    }),
    fill: null
  })

  layer.setStyle(style);
  layer.setZIndex(1);
}

variables.changeVisualization = (tipo) => {

}

// Nueva función actualizacion visualización de capas MapLibre
const updateLayers = () => {
  let layers = variables.layers;
  Object.keys(layers).map((layer) => {
    let infoLayer = layers[layer];
    if (infoLayer.tipo == 'vt') {
      if (!infoLayer.visible) {
        variables.map.setLayoutProperty(infoLayer.id, 'visibility', 'none');
      } else {
        variables.map.setLayoutProperty(infoLayer.id, 'visibility', 'visible');
      }

    }
  })
}

variables.updateLayers = () => {
  updateLayers();
}


export default Mapa;

