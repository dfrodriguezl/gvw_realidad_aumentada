// Componente encargado de renderizar el mapa y todas sus herramientas bajo openLayers
// Autor: Diego Rodriguez
// Fecha: 31/03/2021

import 'ol/ol.css';
import { Map, View } from 'ol';
import React, { Component, Fragment, useState } from 'react';
import ReactDOM from 'react-dom';
import Overlay from 'ol/Overlay';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { defaults as defaultControls, Zoom, OverviewMap, ScaleLine } from 'ol/control.js';
import { transform, transformExtent } from 'ol/proj';
import StreetViewControl from '../olsv/ol_sv'
import { get as getProjection, fromLonLat, toLonLat } from 'ol/proj';
import { toStringHDMS } from 'ol/coordinate';
import { Style, Fill, Stroke, Circle as CircleStyle, Icon, Text } from 'ol/style';
import MVT from 'ol/format/MVT';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import TileWMS from 'ol/source/TileWMS';
import TileGrid from 'ol/tilegrid/TileGrid';
import { boundingExtent } from 'ol/extent';

import { Cluster, Vector as VectorSource } from 'ol/source';
import { Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import { variables } from '../base/variables'
import geostats from 'geostats';
import municipios from '../../json/mpio-extent.json'
import departamentos from '../../json/dpto-extent.json'
import { servidorQuery } from '../base/request'
import gps_cyan from '../../img/gps-cyan.png'
import StreetView from 'ol-street-view';
import 'ol-street-view/dist/css/ol-street-view.min.css';
import TipoVisualizacion from '../components/tipoVisualizacion';
import FiltroProductos from '../components/filtroProductos';

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
let zoomActual;
let unidadesAbsolutas;

var resolutions = [];
let max;
let min;
let max2;

const Mapa = () => {

  // const [hideVisualizationSwitch, setHideVisualizationSwitch] = useState("show");


  const Accordion = ({ title, children, data }) => {
    const [isOpen, setOpen] = React.useState(data);
    return (
      <div className="popup__item">
        <div
          className={`popup__itemAccordion ${isOpen ? "open" : ""}`}
          onClick={() => setOpen(!isOpen)}
        >
          {title}
        </div>
        <div className={`popup__panel ${!isOpen ? "collapsed" : ""}`}>
          <div className="popup__content">{children}</div>
        </div>
      </div>
    );
  };

  localStorage.setItem("theme", "light");
  localStorage.setItem("visualization", "symbols");

  closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
  };

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
  var overviewMapControl = new OverviewMap({
    className: 'map__overview',
    layers: [
      new TileLayer({
        source: new XYZ({
          url: variables.baseMaps[variables.baseMapCheck] + key,
          crossOrigin: "Anonymous",
        })
      })],
  });

  var controlEsca = new ScaleLine({
    className: 'map__scale',
    units: 'metric',
    bar: true,
    steps: 4,
    text: true,
    minWidth: 140,
  });

  // Inicializar mapa
  variables.map = new Map({
    target: 'mapa',
    controls: defaultControls().extend([overviewMapControl, controlEsca]),
    overlays: [overlay],
    layers: [
      variables.base
    ],
    view: new View({
      center: transform([-74.1083125, 4.663437], 'EPSG:4326', 'EPSG:3857'),
      zoom: 6,
      multiWorld: false,
      minZoom: 6
    })
  });

  // Adicionar control de zoom al mapa
  var zoom = new Zoom();
  variables.map.addControl(zoom);

  let currZoom = variables.map.getView().getZoom();
  variables.map.on('moveend', function (e) {

    var newZoom = variables.map.getView().getZoom();
    zoomActual = variables.map.getView().getZoom();

    // variables.loadMpioCentroids();

    if (variables.currentZoom != newZoom) {
      variables.deptoSelectedFilter = undefined;
    }

    if (newZoom < 7) {
      // addClusterDepto();
      // variables.loadDeptoCentroids();
      // variables.loadDeptoCentroids();
      // variables.loadMpioCentroids();
      variables.changeTheme("MPIO", 0, "MPIO", "y");
      // if (variables.deptoSelected == undefined) {
      //   // variables.changeTheme("MPIO", null, null, "n");
      //   variables.changeTheme("MPIO", 0, "MPIO", "y");
      // }
    }

    if (newZoom >= 7 && newZoom <= 11) {
      // variables.loadMpioCentroids();
      variables.changeStyleDepto();
      if (variables.deptoSelected == undefined) {
        variables.changeTheme("MPIO", 0, "MPIO", "y");
      } else {
        variables.changeTheme("MPIO", variables.deptoSelected, null, "y");
        variables.deptoSelected = undefined;
      }
    }

    if (newZoom > 11 && newZoom <= 21) {
      variables.changeStyleMpio();
      if (variables.deptoSelected != undefined) {
        // variables.changeTheme("MNZN", variables.deptoSelected, "NM");
      } else {
        let layer = variables.capas['deptos_vt'];
        let extent = variables.map.getView().calculateExtent();
        let f = layer.getSource().getFeaturesInExtent(extent);
        // f.forEach((feature) => {
        //   // let properties = feature.properties_;
        //   // variables.changeTheme("SECC", properties.id, "NSC", "N");
        //   // variables.loadMzCentroids(properties.id);
        //   // variables.changeTheme("MNZN", properties.id, "NM");
        // })
        // let layerMpio = variables.capas['mpios_vt'];
        // let fMpio = layerMpio.getSource().getFeaturesInExtent(extent);
        // fMpio.forEach((feature) => {
        //   let properties = feature.properties_;
        //   // variables.changeTheme("MNZN", properties.id, "NM");
        //   variables.loadUE(properties.id)
        // })
      }
      variables.changeStyleDepto();
    }

    if (newZoom > 11) {

      // if (variables.baseMapCheck != variables.baseMapPrev) {
      //   variables.baseMapPrev = variables.baseMapCheck;
      //   variables.base.setSource(
      //     new XYZ({
      //       url: variables.baseMaps[variables.baseMapCheck] + variables.key,
      //       crossOrigin: "Anonymous"
      //     })
      //   )
      //   if (variables.changeBaseMap != null) {
      //     variables.changeBaseMap();
      //   }
      // }
      // variables.changeTheme("MNZN", "97");
      variables.legendChange(true)


    } else {
      // variables.baseMapCheck = "Gris";
      // if (variables.baseMapCheck != variables.baseMapPrev) {
      //   variables.base.setSource(
      //     new XYZ({
      //       url: variables.baseMaps[variables.baseMapCheck] + variables.key,
      //       crossOrigin: "Anonymous"
      //     })
      //   )
      //   // variables.changeBaseMap();
      //   if (variables.changeBaseMap != null) {
      //     variables.changeBaseMap();
      //   }
      // }
      variables.legendChange(false)
    }
    if (currZoom != newZoom) {
      currZoom = newZoom;
    }
  })

  let streetView = new StreetView(variables.map,
    {
      apiKey: variables.apiGoogle,
      size: 'sm',
      resizable: true,
      sizeToggler: true,
      defaultMapSize: 'expanded',
      target: 'mapa',
      i18n: {
        dragToInit: 'Drag and drop me',
        exit: 'Salir'
      }
    }
  );

  // Adicionar control streetview
  // let sv = new StreetViewControl({
  //   map: variables.map,
  //   update: true,
  //   handleResult: handleResultSuccessStreetView,
  //   onPositionChange: function () { // Esta función es opcional.
  //     // console.log("Cambio de posicion");
  //   }
  // });

  // function handleResultSuccessStreetView() {
  //   let panelToolbar = document.getElementsByClassName("toolBar__container");
  //   panelToolbar[0].style.display = "none";
  //   let resultPanel = document.getElementsByClassName("result__container");
  //   resultPanel[0].style.display = "none";
  //   let legend = document.getElementsByClassName("legend");
  //   legend[0].style.display = "none";
  // }

  const bboxExtent = (bbox) => {
    bbox = bbox.replace('BOX(', '').replace(')', '')
    bbox = bbox.split(",")
    let bbox1 = bbox[0].split(" ")
    let bbox2 = bbox[1].split(" ")
    var ext = boundingExtent([[bbox1[0], bbox1[1]], [bbox2[0], bbox2[1]]]);
    ext = transformExtent(ext, 'EPSG:4326', 'EPSG:3857');
    variables.map.getView().fit(ext, variables.map.getSize());
  }

  // display popup on click
  variables.map.on('click', function (evt) {

    evt.stopPropagation();
    let overlayId = 0
    var annoCoord = evt.coordinate;
    var anno = document.createElement('div');
    anno.className = 'ol-popup anno-popup';
    var popup = overlay
    // console.log('map On Click');
    var feature = variables.map.forEachFeatureAtPixel(evt.pixel, function (feature) {
      // console.log(feature);
      return feature;
    });

    if (feature == undefined) {
      return;
    }

    // console.log("FEATURE", feature)

    // console.log("FEATURE", feature);



    // console.log(feature.values_)
    if (feature.values_ == undefined) {
      let dataField = feature.properties_.layer;
      let ARR = {
        "mgn_2020_dpto_politico": ["id", "DPTO"],
        "mgn_2020_mpio_politico": ["id", "MPIO"],
        "mgn_2018_urb_seccion": ["id", "SECC"]
        // "MGN_2018_URB_MANZANA":["cod_dane", "MNZN"]
      }

      const departamentosFilter = (departamentos).filter(result => (result.cod_dane == (feature.properties_[ARR[dataField][0]]).substring(0, 2)))
      const municipiosFilter = (municipios).filter(result => (result.cod_dane == (feature.properties_[ARR[dataField][0]]).substring(0, 5)))

      // let dataPopup = []
      const dataSubgrupo = variables.tematica["CATEGORIAS"][variables.varVariable][0]["SUBGRUPO"];
      const dataUnidades = variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"];
      const dataCategorias = variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"];
      const tipoVariable = variables.tematica["CATEGORIAS"][variables.varVariable][0]["TIPO_VARIABLE"];

      // const dataPopup = variables.dataArrayDatos[variables.varVariable.substring(0, 5)][ARR[dataField][1]][variables.periodoSeleccionado.value][feature.properties_[ARR[dataField][0]]]
      // console.log("POPUP", variables.dataArrayDatos[variables.varVariable.substring(0, 5)][ARR[dataField][1]][variables.periodoSeleccionado.value])
      const dataPopup = variables.dataArrayDatos[variables.varVariable.substring(0, 5)][ARR[dataField][1]][variables.periodoSeleccionado.value].filter((a) => {
        if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value
          && a["COD_MPIO"] === feature.properties_[ARR[dataField][0]]) {
          return a;
        }
      });

      unidadesAbsolutas = variables.varVariable.includes("284") ? "m<sup>2</sup>" : variables.varVariable.includes("292") ? "licencias" : "$";
      let HTML = "";
      HTML = '<p class="popup__list"><span class="popup__title">' + dataSubgrupo + '</span></p>';
      HTML += '<p class="popup__list"><span class="popup__subtitle">' + dataCategorias + '</span> ' + '</p>';

      if (dataPopup == undefined) {
        HTML += '<p class="popup__list"><span class="popup__thirdtitle">Porcentaje de unidades:</span> No data</p>';
      } else {
        if (tipoVariable === "VC") {
          HTML += '<p class="popup__list">' + 'Participación porcentual (' + parseFloat(dataPopup[variables.alias].replace(",", ".")).toFixed(1) + ' ' + dataUnidades + ')' + '</p>'
          HTML += '<p class="popup__list"><span class="popup__value">' + parseFloat(dataPopup[variables.alias2]).toLocaleString("de-De").replace(",", ".") + '</span><span class="popup__valueItem"> ' + unidadesAbsolutas + '</span></p>';
        } else {
          HTML += '<p class="popup__list"><span class="popup__value">' + parseFloat(dataPopup[0][variables.alias]).toLocaleString("de-De").replace(",", ".") + '</span><span class="popup__valueItem"> ' + dataUnidades + '</span></p>';
          if (dataUnidades === '$') {
            HTML += '<p class="popup__list"><span class="popup__subtitle">Precio promedio anterior: </span><span class="popup__subtitle">' + unidadesAbsolutas + " " + parseFloat(dataPopup[0]["PRECIO_PROMEDIO_ANTERIOR"]).toLocaleString("de-De").replace(",", ".") + '</span></p>';
            HTML += '<p class="popup__list"><span class="popup__subtitle">Tendencia: </span><span class="popup__subtitle">' + dataPopup[0]["TENDENCIA"] + '</span></p>';
            HTML += '<p class="popup__list"><span class="popup__subtitle">Variación: </span><span class="popup__subtitle">' + parseFloat(dataPopup[0]["VARIACION_PP"]).toLocaleString("de-De").replace(",", ".") + ' %</span></p>';
          } else if (dataUnidades === '%') {
            HTML += '<p class="popup__list"><span class="popup__subtitle">Tendencia: </span><span class="popup__subtitle">' + dataPopup[0]["TENDENCIA"] + '</span></p>';
          }


        }
      }

      HTML += '<hr>' + '</hr>';

      HTML += '<p class="popup__list"><span class="popup__thirdtitle"> Departamento:</span> ' + departamentosFilter[0].name + '</p>';

      if (municipiosFilter.length != 0) {
        HTML += '<p class="popup__list"><span class="popup__thirdtitle"> Municipio:</span> ' + municipiosFilter[0].name + '</p>';
      }
      HTML += '<p class="popup__list"><span class="popup__thirdtitle"> Cod. DANE:</span> ' + feature.properties_[ARR[dataField][0]] + '</p>';

      content.innerHTML = HTML;
      variables.map.addOverlay(popup);
      popup.setPosition(annoCoord);
      // console.log("FEATURE PROP", feature);
      if (feature.properties_.layer == "mgn_2020_dpto_politico") {
        let depto = feature.properties_[ARR[dataField][0]];
        // variables.filterGeo("DPTO", depto);
        variables.deptoSelected = depto;
        variables.deptoSelectedFilter = depto;
        variables.deptoVariable = depto;
        // bboxExtent(departamentosFilter[0].bextent)
        if (variables.changeDepto != null) {
          variables.changeDepto("Departamento de " + departamentosFilter[0].name)
        }

        // variables.changeDonuChartData("MPIO", departamentosFilter[0].cod_dane)
        // variables.changePieChartData("MPIO", departamentosFilter[0].cod_dane)
        // variables.changeBarChartData("MPIO", departamentosFilter[0].cod_dane)
        if (variables.changeDonuChartData != null) {
          variables.changeDonuChartData("DPTO", departamentosFilter[0].cod_dane)
        }

        if (variables.changePieChartData != null) {
          variables.changePieChartData("DPTO", departamentosFilter[0].cod_dane)
        }

        if (variables.changeBarChartData != null) {
          variables.changeBarChartData("DPTO", departamentosFilter[0].cod_dane)
        }




      } else if (feature.properties_.layer == "mgn_2020_mpio_politico" && currZoom <= 11) {
        let mpio = feature.properties_.id;
        // variables.filterGeo("MCPIO", mpio);
        // bboxExtent(municipiosFilter[0].bextent)
        if (variables.changeDepto != null) {
          variables.changeDepto("Departamento de " + departamentosFilter[0].name + ", Municipio de " + municipiosFilter[0].name)
        }



        if (variables.changeDonuChartData != null) {
          variables.changeDonuChartData("MPIO", municipiosFilter[0].cod_dane)
        }

        if (variables.changePieChartData != null) {
          variables.changePieChartData("MPIO", municipiosFilter[0].cod_dane)
        }

        if (variables.changeBarChartData != null) {
          variables.changeBarChartData("MPIO", municipiosFilter[0].cod_dane)
        }
        // variables.loadUE(mpio);
        // variables.changeBaseMap("Satelital");
      } else if (feature.properties_.layer == "mgn_2018_urb_seccion" && currZoom > 11) {
        let seccion = feature.properties_.id;

        if (variables.changeDonuChartData != null) {
          variables.changeDonuChartData("SECC", seccion)
        }

        if (variables.changePieChartData != null) {
          variables.changePieChartData("SECC", seccion)
        }

        if (variables.changeBarChartData != null) {
          variables.changeBarChartData("SECC", seccion)
        }
      }
      variables.baseMapPrev = variables.baseMapCheck;
      variables.baseMapCheck = "Satelital";




    } else {
      // console.log(feature.values_.features)
      if ((feature.values_.features).length === 1) {
        let banderin = 0;
        let tipo = Object.keys(feature.values_.features[0]["values_"])
        let plot = Object.values(feature.values_.features[0]["values_"]).map(function (obj, index, arr) {
          // console.log(tipo[index], tipo[index].indexOf('unidad'))
          if (tipo[index].indexOf('unidad_') > -1) {
            let tipoDos = Object.keys(obj)
            let plotdos = Object.values(obj).map(function (objDos, indexDos, arrDos) {
              if (tipoDos[indexDos] != "undefined") {
                if (tipoDos[indexDos].indexOf('unidad_') === -1 && tipoDos[indexDos] != "Unidad") {
                  return (<li key={"abc" + indexDos} className="popup__list">
                    <p className='popup__thirdtitle'>{tipoDos[indexDos] + ":"}</p>{objDos}<br></br>
                  </li>)
                }
              }
            }, [])
            return (
              <Accordion title={tipo[index]} data={true} key={index}>
                {plotdos}
              </Accordion>
            )
          }
          else {

            const featureLayer = feature.values_.features[0];
            const departamentosFilter = (departamentos).filter(result => result.cod_dane === featureLayer["values_"].cod_dane.substring(0, 2));
            const municipiosFilter = (municipios).filter(result => result.cod_dane === featureLayer["values_"].cod_dane);
            const dataSubgrupo = variables.tematica["CATEGORIAS"][variables.varVariable][0]["SUBGRUPO"];
            const dataUnidades = variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"];
            const dataCategorias = variables.tematica["CATEGORIAS"][variables.varVariable][0]["CATEGORIA"];
            const tipoVariable = variables.tematica["CATEGORIAS"][variables.varVariable][0]["TIPO_VARIABLE"];
            const dataPopup = variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["MPIO"][variables.periodoSeleccionado.value].filter((a) => {
              if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value
                && a["COD_MPIO"] === featureLayer["values_"].cod_dane) {
                return a;
              }
            });

            let unidadesAbsolutas = variables.varVariable.includes("284") ? "m<sup>2</sup>" : variables.varVariable.includes("292") ? "licencias" : "$";
            let HTML = "";
            HTML = '<p class="popup__list"><span class="popup__title">' + dataSubgrupo + '</span></p>';
            HTML += '<p class="popup__list"><span class="popup__subtitle">' + dataCategorias + '</span> ' + '</p>';

            if (dataPopup == undefined) {
              HTML += '<p class="popup__list"><span class="popup__thirdtitle">Porcentaje de unidades:</span> No data</p>';
            } else {
              if (tipoVariable === "VC") {
                // console.log("ALIAS", variables.alias);
                // console.log("ALIAS 2", variables.alias2);
                HTML += '<p class="popup__list"><span class="popup__thirdtitle">' + 'Participación porcentual (' + parseFloat(dataPopup[variables.alias].replace(",", ".")).toFixed(1) + ' ' + dataUnidades + ')' + '</span></p>'
                HTML += '<p class="popup__list"><span class="popup__value">' + parseFloat(dataPopup[variables.alias2]).toLocaleString("de-De").replace(",", ".") + '</span><span class="popup__valueItem">' + unidadesAbsolutas + '</span></p>';
              } else {
                HTML += '<p class="popup__list"><span class="popup__value">' + parseFloat(dataPopup[0][variables.alias]).toLocaleString("de-De").replace(",", ".") + '</span><span class="popup__valueItem"> ' + unidadesAbsolutas + '</span></p>';
                HTML += '<p class="popup__list"><span class="popup__subtitle">Precio promedio anterior: </span><span class="popup__subtitle">' + unidadesAbsolutas + " " + parseFloat(dataPopup[0]["PRECIO_PROMEDIO_ANTERIOR"]).toLocaleString("de-De").replace(",", ".") + '</span></p>';
                HTML += '<p class="popup__list"><span class="popup__subtitle">Tendencia: </span><span class="popup__subtitle">' + dataPopup[0]["TENDENCIA"] + '</span></p>';
                HTML += '<p class="popup__list"><span class="popup__subtitle">Variación: </span><span class="popup__subtitle">' + parseFloat(dataPopup[0]["VARIACION_PP"]).toLocaleString("de-De").replace(",", ".") + ' %</span></p>';
              }
            }

            HTML += '<hr>' + '</hr>';

            // HTML += '<p class="popup__list"><span class="popup__thirdtitle"> Departamento:</span> ' + departamentosFilter[0].name + '</p>';

            // if (departamentosFilter.length != 0) {
            //   HTML += '<p class="popup__list"><span class="popup__thirdtitle"> Cod. DANE:</span> ' + departamentosFilter[0].cod_dane + '</p>';
            // }

            HTML += '<p class="popup__list"><span class="popup__thirdtitle"> Departamento:</span> ' + departamentosFilter[0].name + '</p>';

            if (municipiosFilter.length != 0) {
              HTML += '<p class="popup__list"><span class="popup__thirdtitle"> Municipio:</span> ' + municipiosFilter[0].name + '</p>';
            }

            HTML += '<p class="popup__list"><span class="popup__thirdtitle"> Cod. DANE:</span> ' + featureLayer["values_"].cod_dane + '</p>';


            content.innerHTML = HTML;
            variables.map.addOverlay(popup);
            popup.setPosition(annoCoord);

            let depto = departamentosFilter[0].cod_dane;
            // variables.filterGeo("DPTO", depto);
            // variables.deptoSelected = depto;
            // variables.deptoSelectedFilter = depto;
            // variables.deptoVariable = depto;
            // bboxExtent(departamentosFilter[0].bextent)
            if (variables.changeDepto != null) {
              variables.changeDepto("Departamento de " + departamentosFilter[0].name)
            }

            // variables.changeDonuChartData("MPIO", departamentosFilter[0].cod_dane)
            // variables.changePieChartData("MPIO", departamentosFilter[0].cod_dane)
            // variables.changeBarChartData("MPIO", departamentosFilter[0].cod_dane)
            if (variables.changeDonuChartData != null) {
              variables.changeDonuChartData("DPTO", departamentosFilter[0].cod_dane)
            }

            if (variables.changePieChartData != null) {
              variables.changePieChartData("DPTO", departamentosFilter[0].cod_dane)
            }

            if (variables.changeBarChartData != null) {
              variables.changeBarChartData("MPIO", municipiosFilter[0].cod_dane)
            }
            if (banderin === 0) {
              banderin = 1;
              // let plotdos = Object.values(feature.values_.features[0]["values_"]).map(function (objDos, indexDos, arrDos) {

              //   if (tipo[indexDos].indexOf('unidad_') === -1) {
              //     if (tipo[indexDos] != "geometry") {
              //       // console.log(tipoDos[indexDos],objDos)
              //       return (<li key={"abc" + indexDos} className="popup__list">
              //         <p className='popup__thirdtitle'>{tipo[indexDos] + ":"}</p>{objDos}<br></br>
              //       </li>)
              //     }
              //   }
              // }, [])
              // return (
              //   <Accordion title={"Manzana"} data={false} key={index}>
              //     {plotdos}
              //   </Accordion>
              // )
            }

          }
        }, [])

        // ReactDOM.render(plot, content);
        // variables.map.addOverlay(popup);
        // popup.setPosition(annoCoord);
      }
    }
  });

  // change mouse cursor when over marker
  variables.map.on('pointermove', function (e) {
    if (e.dragging) {
      return;
    }

    if (zoomActual <= 11) {
      var popup = overlay
      var pixel = variables.map.getEventPixel(e.originalEvent);
      var coordinates = toLonLat(variables.map.getCoordinateFromPixel(pixel));
      var feature = variables.map.forEachFeatureAtPixel(pixel, function (feature) {
        return feature;
      });

      let hit = variables.map.hasFeatureAtPixel(pixel);
      let idMap = document.getElementById(variables.map.getTarget());
      if (hit) {
        idMap.style.cursor = 'pointer';
      } else {
        idMap.style.cursor = '';
      }
    } else {
      let idMap = document.getElementById(variables.map.getTarget());
      idMap.style.cursor = '';
    }



    coordinates = toStringHDMS(coordinates);
    let c = coordinates.split(" ");
    c.splice(3, 0, " , Long:");
    coordinates = "Lat: " + c.join(" ");
    document.getElementById("coordenates__panel").innerHTML = coordinates;
  });

  // variables.hideVisualizationSwitch = (hide) => {
  //   setHideVisualizationSwitch(hide)
  // }

  fillResolutions();
  loadLayers2();
  // Add clusters
  // addCluster();
  // addClusterDepto();
  // variables.loadDeptoCentroids();
  addClusterMpio();
  variables.loadMpioCentroids();
  return (
    <Fragment>
      <div id="switch_visualization"><TipoVisualizacion /></div>
      <div id="switch_productos"><FiltroProductos /></div>
      <div className="coordenates">
        <div id="coordenates__panel"></div>

        {/* <TipoVisualizacion /> */}

      </div>
    </Fragment>


  )
}
var buttons = document.querySelectorAll(".toggle-button");
var modal = document.querySelector("#modal");



[].forEach.call(buttons, function (button) {
  button.addEventListener("click", function () {
    modal.classList.toggle("off");
  })
});
function addVtLayer3(maxZoom, minZoom, tileUrl) {
  // console.log(resolutions);
  return new VectorTileLayer({
    source: new VectorTileSource({
      format: new MVT(),
      tileGrid: new TileGrid({
        extent: getProjection('EPSG:3857').getExtent(),
        resolutions: resolutions,
        tileSize: 512,
      }),
      // url: tilefunct,
      tileUrlFunction: tileUrl,
    }),
    maxZoom: maxZoom,
    minZoom: minZoom
  });
}
function styleLayer(style) {
  let fill = null;
  let stroke = null;

  if (style.fill) {
    fill = new Fill({
      color: style.fill.color
    });
  }

  if (style.stroke) {
    stroke = new Stroke({
      color: style.stroke.color,
      width: style.stroke.width
    })
  }
  return [fill, stroke];
}
function loadLayers2() {
  let layers = variables.layers;
  // console.log(layers);
  Object.keys(layers).map((layer, idx) => {
    let infoLayer = layers[layer];
    if (infoLayer.tipo == 'vt') {
      let styles = styleLayer(infoLayer.style);
      let styleFill = styles[0];
      let styleStroke = styles[1];
      let styleLyr = new Style({
        stroke: styleStroke,
        fill: styleFill
      });
      const tileUrl = (tileCoord) => {
        return (
          infoLayer.url
        )
          .replace('{z}', String(tileCoord[0] * 2 - 1))
          .replace('{x}', String(tileCoord[1]))
          .replace('{y}', String(tileCoord[2]))
          .replace(
            '{a-d}',
            'abcd'.substr(((tileCoord[1] << tileCoord[0]) + tileCoord[2]) % 4, 1)
          );
      }
      variables.capas[infoLayer.id] = addVtLayer3(infoLayer.maxZoom, infoLayer.minZoom, tileUrl);
      variables.map.addLayer(variables.capas[infoLayer.id]);
      variables.capas[infoLayer.id].set('id', infoLayer.id);
      if (!infoLayer.visible) {
        // variables.capas[infoLayer.id].setVisible(false);
        variables.map.removeLayer(variables.capas[infoLayer.id]);
      }

      variables.capas[infoLayer.id].setStyle(styleLyr);

      let ident = infoLayer.id;
      let elementLyr = {};
      elementLyr[ident] = variables.capas[infoLayer.id];
      variables.layersInMap.push(elementLyr);
    } else if (infoLayer.tipo == 'wms') {
      // console.log(infoLayer)
      let wmsCapa = addLayerWms(infoLayer.url, infoLayer.layer)
      let ident = infoLayer.id;
      variables.map.addLayer(wmsCapa);
      let elementLyr = {};
      elementLyr[ident] = wmsCapa;
      variables.layersInMap.push(elementLyr);
      if (infoLayer.checked == false) {
        variables.map.removeLayer(wmsCapa);
      }
    }
  })
}
function fillResolutions() {
  for (var i = 0; i <= 8; ++i) {
    resolutions.push(156543.03392804097 / Math.pow(2, i * 2));
  }
}
function addLayerWms(url, layer) {
  let wmsLyr = new TileLayer({
    source: new TileWMS({
      url: url,
      params: {
        'LAYERS': layer,
        transparent: 'true',
        FORMAT: 'image/png'
      },
      crossOrigin: 'anonymous'
    })

  })

  return wmsLyr
}

//VARIABLES PARA PINTAR MAPA
variables.changeMap = function (nivel, dpto, table) {
  unidadesAbsolutas = variables.varVariable.includes("284") ? "m<sup>2</sup>" : variables.varVariable.includes("292") ? "licencias" : "$";
  // let campos1 = ((variables.queryText[variables.varVariable.substring(0, 5)]).replace('SELECT', '')).split("FROM")
  // let campos = campos1[0].split(",")
  let tipoVariable = variables.tematica["CATEGORIAS"][variables.varVariable][0]["TIPO_VARIABLE"];

  // for (let index = 0; index < campos.length; index++) {
  //   if (tipoVariable === "VC") {
  //     // console.log("CAMPOS", campos);
  //     // console.log("TABLA 2", variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA2"]);
  //     // console.log("TABLA 1", variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA"]);
  //     if (campos[index].indexOf(variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA2"]) != "-1") {
  //       let arrField = (campos[index]).split(" ")
  //       arrField = cleanArray(arrField)

  //       if ((variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA2"]).trim() == arrField[0].trim()) {
  //         variables.alias = (arrField[arrField.length - 1]).trim() // definir el tipo de variable que se debe previsualizar
  //         variables.valorTotal = variables.alias.replace('PP', 'V')
  //       }
  //     }
  //     else if (campos[index].indexOf(variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA"]) != "-1") {
  //       let arrField = (campos[index]).split(" ")
  //       arrField = cleanArray(arrField)
  //       console.log("ARR FIELD 2", arrField);
  //       if ((variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA"]).trim() == arrField[0].trim()) {
  //         variables.alias2 = (arrField[arrField.length - 1]).trim() //definir el tipo de variable que se debe previsualizar
  //         variables.valorTotal = variables.alias2.replace('V', 'PP')
  //       }
  //     }
  //   }
  //   else {
  //     if (campos[index].indexOf(variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA"]) != "-1") {
  //       let arrField = (campos[index]).split(" ")
  //       arrField = cleanArray(arrField)
  //       if ((variables.tematica["CATEGORIAS"][variables.varVariable][0]["CAMPO_TABLA"]).trim() == arrField[0].trim()) {
  //         variables.alias = (arrField[arrField.length - 1]).trim() // definir el tipo de variable que se debe previsualizar
  //         variables.valorTotal = variables.alias.replace('V', 'PP')
  //       }
  //     }
  //   }
  // }

  if (1 === 1) {
    variables.alias = variables.variablesCampos[variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"]];
    // console.log("ME FUI POR CHANGE MAP");

    if (nivel == "DPTO") {
      let valor2Array = [];
      var integrado = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).map(function (a, b) {
        let valor, valor2
        c
        if (a["G"] === variables.periodoSeleccionado.value) {
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
            return valor
          } else if (valor2 != undefined && !isNaN(valor2)) {
            return valor2
          } else {
            return 0
          }
        }

      }, []);

      max = Math.max(...integrado);
      min = Math.min(...integrado);
      max2 = Math.max(...valor2Array);
      variables.max = valor2Array.length === 0 ? max : max2;

      let list = integrado.filter((x, i, a) => a.indexOf(x) == i)
      // console.log(integrado)

      // LEYENDA NIVEL DPTO
      var serie = new geostats(list);
      let dataUnidades = variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"];

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
        }
      }

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
      var labels = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).map(function (a, b) {

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
      variables.changeChart();
      variables.legenTheme();
      if (table == "y") {
        let orderData = dataTable.sort((a, b) => {
          if (parseFloat(a.valor) > parseFloat(b.valor)) {
            return -1;
          } else if (parseFloat(a.valor) < parseFloat(b.valor)) {
            return 1;
          }
          return 0;
        })
        // console.log("ORDER",orderData)
        variables.updateData(orderData, colsTable);
      }

      // console.log(variables.deptoSelected);
      if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined) {
        variables.filterGeo("DPTO", variables.deptoSelectedFilter)
      } else {
        let layer = variables.capas['deptos_vt'];
        layer.setStyle(function (feature) {
          var layer = feature.get("id");
          return changeSymbologi(layer, nivel, feature)
        })

        localStorage.getItem("visualization") === "symbols" ? layer.setVisible(false) : layer.setVisible(true);

        // if(layer.getVisible()){
        //   layer.setVisible(false);
        // }



        variables.unidadesDepto.setStyle(function (feature) {
          const id = feature.values_.features[0].values_.cod_dane;
          return changeSymbologiCluster(id, nivel, min, max, max2);
          // return changeSymbologi(layer, nivel, feature)
        })
      }

    }
    else if (nivel == "MPIO") {
      let valor2Array = [];

      var integrado = Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).map(function (a, b) {
        let valor, valor2;

        if (dpto !== 0) {
          if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value && a["COD_DPTO"] === dpto) {
            if (a[variables.alias].includes(",")) {
              // console.log("VALOR",a[variables.alias]);
              // if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined && a[nivel].substring(0,2) === variables.deptoSelectedFilter) {
              valor = parseFloat(a[variables.alias].replace(",", ".")).toFixed(2).toLocaleString("de-De")

              // console.log("VALOR PROCESADO",valor);
              // }
              // else{
              //   valor = parseFloat(a[variables.alias]).toFixed(2).toLocaleString("de-De").replace(",", ".")
              // }
            } else {
              // if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined && a[nivel].substring(0,2) === variables.deptoSelectedFilter) {
              valor = parseFloat(a[variables.alias]).toFixed(2)
              // }
              // else {
              //   valor = parseFloat(a[variables.alias]).toFixed(2)
              // }

            }


            if (a[variables.alias2] != undefined) {

              if (a[variables.alias2].includes(",")) {
                // if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined && a[nivel].substring(0,2) === variables.deptoSelectedFilter) {
                valor2 = parseFloat(a[variables.alias2]).toFixed(2).toLocaleString("de-De").replace(",", ".")
                // }

              } else {
                // if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined && a[nivel].substring(0,2) === variables.deptoSelectedFilter) {
                valor2 = parseFloat(a[variables.alias2])
                // }

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


            // console.log("VALOR 11", valor);
            // console.log("VALOR 22", valor2);

            if (valor != undefined && !isNaN(valor)) {
              // if (variables.deptoSelectedFilter != undefined) {
              //   // console.log("A NIVEL", a);
              //   if (a[nivel].substring(0, 2) === variables.deptoSelectedFilter) {
              //     return valor
              //   } else {
              //     return 0;
              //   }
              // } else {
              //   return valor
              // }

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
              // console.log("VALOR",a[variables.alias]);
              // if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined && a[nivel].substring(0,2) === variables.deptoSelectedFilter) {
              valor = parseFloat(a[variables.alias].replace(",", ".")).toFixed(2).toLocaleString("de-De")
              // console.log("VALOR PROCESADO",valor);
              // }
              // else{
              //   valor = parseFloat(a[variables.alias]).toFixed(2).toLocaleString("de-De").replace(",", ".")
              // }
            } else {
              // if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined && a[nivel].substring(0,2) === variables.deptoSelectedFilter) {
              valor = parseFloat(a[variables.alias]).toFixed(2)
              // }
              // else {
              //   valor = parseFloat(a[variables.alias]).toFixed(2)
              // }

            }


            if (a[variables.alias2] != undefined) {

              if (a[variables.alias2].includes(",")) {
                // if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined && a[nivel].substring(0,2) === variables.deptoSelectedFilter) {
                valor2 = parseFloat(a[variables.alias2]).toFixed(2).toLocaleString("de-De").replace(",", ".")
                // }

              } else {
                // if (variables.deptoSelected == undefined && variables.deptoSelectedFilter != undefined && a[nivel].substring(0,2) === variables.deptoSelectedFilter) {
                valor2 = parseFloat(a[variables.alias2])
                // }

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


            // console.log("VALOR 11", valor);
            // console.log("VALOR 22", valor2);

            if (valor != undefined && !isNaN(valor)) {
              // if (variables.deptoSelectedFilter != undefined) {
              //   // console.log("A NIVEL", a);
              //   if (a[nivel].substring(0, 2) === variables.deptoSelectedFilter) {
              //     return valor
              //   } else {
              //     return 0;
              //   }
              // } else {
              //   return valor
              // }

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

      // console.log("INTEGRADO", integrado);
      if (tipoVariable !== "DV") {
        integrado = integrado.filter(o => o !== 0);
      }

      max = Math.max(...integrado);
      min = Math.min(...integrado);
      max2 = Math.max(...valor2Array);
      variables.max = valor2Array.length === 0 ? max : max2;
      variables.min = min;
      // console.log("MAX", max);
      // console.log("MIN", min);
      // console.log("MAX2ARRAY", valor2Array);
      // console.log("MAX2", max2);

      let list = integrado.filter((x, i, a) => a.indexOf(x) == i)
      // console.log("LIST", list);
      let dataUnidades = variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"];
      // console.log(integrado)
      // console.log("LIST", list)
      const rangeNumber = list.length < 5 ? list.length : 5;
      var serie = new geostats(list);
      // console.log("SERIES", serie.getClassJenks(rangeNumber))
      if (serie.getClassJenks(rangeNumber) != undefined) {
        for (let index = 0; index < (serie.ranges).length; index++) {
          const searchRegExp = /\./g;
          let rangeSplit = serie.ranges[(serie.ranges).length - (index + 1)].split(" - ");
          // console.log("RANGO 1", rangeSplit)
          let newRange = parseFloat(rangeSplit[0]).toLocaleString("de", "DE") + " - " + parseFloat(rangeSplit[1]).toLocaleString("de", "DE");
          let rango = newRange + " (" + dataUnidades + ")";
          // console.log("RANGO", rango)
          // let rango = serie.ranges[(serie.ranges).length - (index + 1)].replace(searchRegExp, ",") + " (" + dataUnidades + ")"
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
          // {
          //   title: "Distribución (Cantidad)", field: "valor2", hozAlign: "left", formatter: "progress", formatterParams: {
          //     color: variables.coloresLeyend[variables.varVariable][nivel][2][0]
          //   }
          // }
        ]
      }

      Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).map(function (a, b) {

        if (dpto !== 0) {
          if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value && a["COD_DPTO"] === dpto) {
            // console.log("A DATA", a);
            let valor = parseFloat(a[variables.alias]).toFixed(2)
            let valor2 = parseFloat(a[variables.alias2])
            // let valor3 = (valor * 100)
            // console.log(a)
            let mpio = (municipios).filter(result => (result.cod_dane == a["COD_MPIO"]))
            let depto = (departamentos).filter(result => (result.cod_dane == a["COD_MPIO"].substring(0, 2)))
            // console.log(depto)


            // console.log(dpto)
            if (dpto != null) {
              depto = (departamentos).filter(result => (result.cod_dane == dpto))
              if (mpio[0].cod_dane.substring(0, 2) == dpto) {
                dataTable.push({ depto: depto[0].name, mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor, valor2: valor2 });
              }

              // mpio = (municipios).filter(result => (result.cod_dane.substring(0,2) == dpto))

            } else {
              let shouldSkipp = false;
              labelsData.push(mpio[0].name);
              data.push(valor);
              dataTable.push({ depto: depto[0].name, mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor });
              // console.log("LABELS DATA", labelsData);
              // console.log("DATA", data);
              // f.forEach((m) => {
              //   if (shouldSkipp) {
              //     return;
              //   }
              //   // console.log(m)

              //   if (m.properties_.id == mpio[0].cod_dane) {
              //     // console.log(valor)
              //     // console.log(depto)
              //     labelsData.push(mpio[0].name)
              //     data.push(valor);
              //     dataTable.push({ depto: depto[0].name, mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor });

              //     let shouldSkip = false;
              //     (variables.coloresLeyend[variables.varVariable][nivel]).forEach((value) => {
              //       // console.log(value)
              //       let element = value[2].split("-")
              //       let colour

              //       if (shouldSkip) {
              //         return;
              //       }

              //       if (element.length == 1) {
              //         if (parseFloat(valor) >= parseFloat((element[0].replace(">", "").trim()))) {
              //           colour = value[0];
              //           colors.push(colour)
              //           shouldSkip = true
              //         }
              //       } else {
              //         if (parseFloat(valor) >= parseFloat(element[0]) && parseFloat(valor) <= parseFloat(element[1])) {
              //           colour = value[0];
              //           colors.push(colour)
              //           shouldSkip = true
              //         }
              //       }
              //     })

              //     shouldSkipp = true;
              //   }
              // })
            }
          }
        } else {
          // console.log("A DATA", a);
          if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value) {

            let valor = parseFloat(a[variables.alias]).toFixed(2)
            let valor2 = parseFloat(a[variables.alias2])
            // let valor3 = (valor * 100)
            // console.log(a)
            let mpio = (municipios).filter(result => (result.cod_dane == a["COD_MPIO"]))
            let depto = (departamentos).filter(result => (result.cod_dane == a["COD_MPIO"].substring(0, 2)))
            // console.log("MPIO", mpio)
            // console.log("DPTO", depto)

            // console.log("DPTO", dpto)
            if (dpto != 0) {
              depto = (departamentos).filter(result => (result.cod_dane == dpto))
              if (mpio[0].cod_dane.substring(0, 2) == dpto) {
                dataTable.push({ depto: depto[0].name, mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor, valor2: valor2 });
              }

              // mpio = (municipios).filter(result => (result.cod_dane.substring(0,2) == dpto))

            } else {
              let shouldSkipp = false;
              labelsData.push(mpio[0].name);
              data.push(valor);
              dataTable.push({ depto: depto[0].name, mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor });
              // console.log("LABELS DATA", labelsData);
              // console.log("DATA", data);
              // console.log("VALOR", valor);
              // console.log("F", f);
              // f.forEach((m) => {
              //   if (shouldSkipp) {
              //     return;
              //   }
              //   console.log("M", m)

              //   if (m.properties_.id == mpio[0].cod_dane) {
              //     // console.log(valor)
              //     // console.log(depto)
              //     labelsData.push(mpio[0].name)
              //     data.push(valor);
              //     dataTable.push({ depto: depto[0].name, mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor });

              //     let shouldSkip = false;
              //     (variables.coloresLeyend[variables.varVariable][nivel]).forEach((value) => {
              //       // console.log(value)
              //       let element = value[2].split("-")
              //       let colour

              //       if (shouldSkip) {
              //         return;
              //       }

              //       if (element.length == 1) {
              //         if (parseFloat(valor) >= parseFloat((element[0].replace(">", "").trim()))) {
              //           colour = value[0];
              //           colors.push(colour)
              //           shouldSkip = true
              //         }
              //       } else {
              //         if (parseFloat(valor) >= parseFloat(element[0]) && parseFloat(valor) <= parseFloat(element[1])) {
              //           colour = value[0];
              //           colors.push(colour)
              //           shouldSkip = true
              //         }
              //       }
              //     })

              //     shouldSkipp = true;
              //   }
              // })
            }
          }
        }




        // console.log(mpio)

      }, []);

      // variables.changeLegend(nivel);

      // console.log(variables.coloresLeyend[variables.varVariable]["MPIO"])
      // variables.changeChart();

      variables.changeChart();
      variables.legenTheme();

      if (table == "y") {
        variables.updateData(dataTable, colsTable);
      }

      variables.changeLegend(nivel);
      // console.log(variables.coloresLeyend[variables.varVariable]), "Colores";

      // console.log(variables.coloresLeyend[variables.varVariable]);
      // variables.changeLegend();
      // variables.legenTheme();

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
          // return changeSymbologi(layer, nivel, feature)
        })
        if (dpto == null) {
          layer.setStyle(function (feature) {
            var layer = feature.get("id");
            return changeSymbologi(layer, nivel, feature)
          })
        }
      }

      localStorage.getItem("visualization") === "symbols" ? layer.setVisible(false) : layer.setVisible(true);

      // console.log(layer)
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
      // console.log(integrado)
      // console.log(list)
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
          // console.log(rango)
          // console.log(variables.coloresLeyend[variables.varVariable]["MPIO"][index][2])
          // console.log(rango, "Rango")
          // variables.coloresLeyend[variables.varVariable]["DPTO"][index][2] = rango;
          variables.coloresLeyend[variables.varVariable]["SECC"][index][2] = rango;

        }
      }

      // console.log(variables.coloresLeyend)

      // let layer = variables.capas['mpios_vt'];

      // let extent = variables.map.getView().calculateExtent();
      // let features = layer.getSource().forEachFeatureInExtent(extent, function(feature){
      //   console.log(Feature);
      // });
      // let f = layer.getSource().getFeaturesInExtent(extent);
      // console.log(f)



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

        // }

        // console.log(mpio)

      }, []);

      // console.log(variables.coloresLeyend[variables.varVariable]["MPIO"])
      // variables.changeChart();

      variables.changeLegend(nivel);
      variables.changeChart();
      variables.legenTheme();

      let layer = variables.capas["secc_vt"];







      // variables.legenTheme();

      // console.log(variables.coloresLeyend[variables.varVariable]);

      layer.setStyle(function (feature) {

        // console.log(feature)

        var field = feature.get("id");
        return changeSymbologi(field, nivel, feature, layer)

      })


      // console.log(layer)
    } else if (nivel == "MNZN") {

      // let integrado_mnzn;



      // Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel]).forEach(function (a) {

      //   if (a != undefined) {

      //     integrado_mnzn = Object.values(a).map((value, b) => {

      //       let valor = parseFloat(value[variables.alias].replace(",", "."))

      //       if (valor != undefined && !isNaN(valor)) {

      //         return valor;

      //       } else {

      //         return 0;

      //       }

      //     }, [])

      //   }

      // });

      // let list = integrado_mnzn.filter((x, i, a) => a.indexOf(x) == i)

      // var serie = new geostats(list);

      // if (serie.getClassJenks(5) != undefined) {


      //   for (let index = 0; index < (serie.ranges).length; index++) {

      //     let rango = serie.ranges[(serie.ranges).length - (index + 1)]

      //     if (index == 0) {

      //       rango = rango.split("-")

      //       rango = " > " + rango[0].trim()

      //     }

      //     variables.coloresLeyend[variables.varVariable]["MNZN"][index][2] = rango;
      //     // variables.coloresLeyend[variables.varVariable]["DPTO"][index][2] = rango;

      //   }

      // }





      // let layer = variables.capas["mzn_vt"];

      // variables.changeLegend(nivel);



      // // variables.legenTheme();

      // // console.log(variables.coloresLeyend[variables.varVariable]);

      // layer.setStyle(function (feature) {

      //   // console.log(feature)

      //   var field = feature.get("cod_dane");
      //   return changeSymbologi(field, nivel, feature, layer)

      // })

    }

    if (variables.updateLegendProportional !== null && localStorage.getItem("visualization") === "symbols") {
      variables.updateLegendProportional();
    }
  }




  // variables.changeLoader(true);
}

const updateRangeSimbology = (valorCampo, nivel, colorInput) => {
  let color = colorInput;
  const tipoVariable = variables.tematica["CATEGORIAS"][variables.varVariable][0]["TIPO_VARIABLE"];

  if (tipoVariable === "DV") {
    if (valorCampo.length > 0) {
      (variables.coloresLeyend[variables.varVariable][nivel]).map(function (obj, j, k) {
        let element = obj[2];
        element = String(element).split(' - ');
        if (element.length == 1) {
          if (parseFloat(valorCampo[0][variables.alias]).toFixed(2)
            >= parseFloat(element[0].replace(">", "").replaceAll('.', '').replace("%", "").trim())) {
            color = variables.coloresDivergentes[j];
          }
        } else {
          if (parseFloat(valorCampo[0][variables.alias]).toFixed(2) >= parseFloat(element[0].replaceAll('.', '').replace("%", ""))
            && parseFloat(valorCampo[0][variables.alias]).toFixed(2) <= parseFloat(element[1].replaceAll('.', '').replace("%", ""))) {
            color = variables.coloresDivergentes[j];
          }
        }
      })
    }
  } else {
    if (valorCampo.length > 0) {
      (variables.coloresLeyend[variables.varVariable][nivel]).map(function (obj, j, k) {
        let element = obj[2];
        element = String(element).split(' - ');
        if (element.length == 1) {
          if (parseFloat(valorCampo[0][variables.alias]).toFixed(2)
            >= parseFloat(element[0].replace(">", "").replaceAll('.', '').replace("%", "").trim())) {
            color = obj[0];
          }
        } else {
          if (parseFloat(valorCampo[0][variables.alias]).toFixed(2) >= parseFloat(element[0].replaceAll('.', '').replace("%", ""))
            && parseFloat(valorCampo[0][variables.alias]).toFixed(2) <= parseFloat(element[1].replaceAll('.', '').replace("%", ""))) {
            color = obj[0];
          }
        }
      }, []);
    }
  }



  return color === undefined ? colorInput : color;
}

function changeSymbologi(cluster, nivel, feature, layer) {
  let color = "#FFFFFF1A";
  // let valorCampo = "";

  if (variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][cluster.substring(0, 2)] !== undefined && nivel === "MNZN") {
    const valorCampo = variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][cluster.substring(0, 2)][cluster];
    color = updateRangeSimbology(valorCampo, nivel, color);
  } else {
    // console.log("VALOR CAMPO", variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][cluster])
    const valorCampo = variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value].filter((a) => {
      if (a["FECHA"] === variables.periodoSeleccionado.value && a["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value
        && a["COD_MPIO"] === cluster) {
        return a;
      }
    });
    // const valorCampo = variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value][cluster];
    // console.log("VALOR CAMPO", valorCampo);
    if (valorCampo.length > 0) {
      if (valorCampo[0]["FECHA"] === variables.periodoSeleccionado.value && valorCampo[0]["PRODUCTOS_ESPECIE_PUBLI"] === variables.productoSeleccionado.value) {
        color = updateRangeSimbology(valorCampo, nivel, color);
      }
    }

    // console.log("CLUSTER", cluster)

    // if (nivel === "DPTO") {
    //   let prevStyle = variables.unidadesDepto.getStyle();
    //   console.log("PREV STYLE", prevStyle);
    //   variables.unidadesDepto.setStyle(function (feature) {
    //     const id = feature.values_.features[0].values_.cod_dane;
    //     console.log("ID", id);
    //     // console.log("CLUSTER", cluster);
    //     // console.log("COD_DANE", feature.get("cod_dane"));
    //     let styleCircle;
    //     if (id === cluster) {
    //       console.log("VALOR CAMPO", 10 + 40 * (valorCampo[variables.alias] - 5));
    //       styleCircle = new Style({
    //         image: new CircleStyle({
    //           radius: 50,
    //           fill: new Fill({
    //             color: color
    //           }),
    //           stroke: new Stroke({
    //             color: "#FFFFFF",
    //             width: 1
    //           })
    //         })
    //       })

    //       // return styleCircle;
    //     } else {
    //       styleCircle = prevStyle;
    //     }

    //     return styleCircle;

    //     // else{
    //     //   let styleCircle = new Style({
    //     //     image: new CircleStyle({
    //     //       radius: 50,
    //     //       fill: new Fill({
    //     //         color: "#000000"
    //     //       }),
    //     //       stroke: new Stroke({
    //     //         color: "#FFFFFF",
    //     //         width: 1
    //     //       })
    //     //     })
    //     //   })

    //     //   return styleCircle;
    //     // }


    //   })
    // }

    // console.log("VALOR CAMPO", valorCampo["G"])
    // color = updateRangeSimbology(valorCampo, nivel, color);

  }





  // color = updateRangeSimbology(valorCampo, nivel, color);

  let strokeColor

  let layerName = feature.properties_.layer;
  // console.log(layerName)
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



  // console.log(styleLyr);
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
    // console.log("VALOR CAMPO", variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][cluster])
    // const valorCampo = variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value][cluster];
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
        radioValor = ((valor.replace(",", ".") - variables.min) / (maxValor - variables.min)) * 30;
        // radioValor = (valor.replace(",", ".") * 30) / maxValor;
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

  // console.log("RADIO", radioValor);

  if (radioValor > 0) {
    // color = updateRangeSimbology(valorCampo, nivel, color);

    let strokeColor = '#adaba3'

    // let layerName = feature.properties_.layer;
    // // console.log(layerName)
    // layerName == 'mgn_2020_dpto_politico' ? strokeColor = '#FFFFFF' : layerName == 'MGN_2018_URB_MANZANA' ? strokeColor = '#FFFFFF00' : strokeColor = '#adaba3'
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


  // console.log(nivel);
  // console.log(value);
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
      // return changeSymbologi(layer, nivel, feature)
    })
    variables.changeStyleDepto();

  } else if (nivel == 'MCPIO') {
    layer = variables.capas["mpios_vt"];
    layer.setStyle(function (feature) {
      var field = feature.get("id");
      return changeSymbologyGeo(field, "MCPIO", feature, layer, value)
    })
    // layer.setVisible(false);
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

const updateDataInTableGeo = (nivel) => {
  let dataTable = []
  let colsTable = []
  colsTable = [
    { title: "Departamento", field: "depto", width: 150 },
    { title: "Código", field: "codigo" },
    { title: "Municipio", field: "mpio" },
    { title: "Valor (%)", field: "valor" },
    {
      title: "Distribución entidad territorial", field: "valor", hozAlign: "left", formatter: "progress", formatterParams: {
        color: variables.coloresLeyend[variables.varVariable][nivel][2][0]
      }
    }
  ]

  Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel]).map(function (a, b) {

    let valor = parseFloat(a[variables.alias])
    // console.log(a)
    let mpio = (municipios).filter(result => (result.cod_dane == a[nivel]))
    let depto = (departamentos).filter(result => (result.cod_dane == a[nivel].substring(0, 2)))
    // console.log(depto)

    let shouldSkipp = false;
    f.forEach((m) => {
      if (shouldSkipp) {
        return;
      }
      // console.log(m)

      if (m.properties_.id == mpio[0].cod_dane) {
        // console.log(valor)
        // console.log(depto)
        labelsData.push(mpio[0].name)
        data.push(valor);
        dataTable.push({ depto: depto[0].name, mpio: mpio[0].name, codigo: mpio[0].cod_dane, valor: valor });

        let shouldSkip = false;
        (variables.coloresLeyend[variables.varVariable][nivel]).forEach((value) => {
          // console.log(value)
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

        shouldSkipp = true;
      }
    })

  }, []);
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

  // variables.changeLoader(true);
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

  // variables.changeLoader(true);
  return geoObj;

}

const addCluster = () => {
  var styleCache = {};
  var gpsIcon1 = new Icon({
    anchor: [0.5, 12],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: gps_cyan
  });

  variables.unidadesMz = new VectorLayer({
    title: 'Unidades económicas',
    maxZoom: 21,
    minZoom: 11,
    source: new Cluster({
      distance: variables.distanceCluster,
      source: new VectorSource({
        features: []
      }),
    }),
    style: function (feature) {

      var size = feature.get('features').length;
      var style;
      if (size == 1) {
        style = new Style({
          image: gpsIcon1,
          // text: new Text({
          //   text: m.toString(),
          //   font: 'bold 13px / 1 Arial',
          //   textBaseline: 'bottom',
          //   offsetX: 5,
          //   offsetY: -13,
          //   fill: new Fill({
          //     color: '#21b5eb',
          //   }),
          //   stroke: new Stroke({ color: '#fff', width: 2 }),
          //   padding: [2, 2, 2, 2],
          // })
        });
        // let k = Object.keys(feature.getProperties().features[0].getProperties()).filter(p => p.indexOf("unidad_") >= 0);
        // // console.log(k[0])
        // let m = parseInt(k[0].substr(k[0].lastIndexOf("_") + 1, k[0].length));
        // if (k.length > 1) {
        //   k.forEach(x => {
        //     if (m < parseInt(x.substr(x.lastIndexOf("_") + 1, x.length))) {
        //       m = parseInt(x.substr(x.lastIndexOf("_") + 1, x.length));
        //     }
        //   })
        //   style = new Style({
        //     image: gpsIcon1,
        //     // text: new Text({
        //     //   text: m.toString(),
        //     //   font: 'bold 13px / 1 Arial',
        //     //   textBaseline: 'bottom',
        //     //   offsetX: 5,
        //     //   offsetY: -13,
        //     //   fill: new Fill({
        //     //     color: '#21b5eb',
        //     //   }),
        //     //   stroke: new Stroke({ color: '#fff', width: 2 }),
        //     //   padding: [2, 2, 2, 2],
        //     // })
        //   });
        // } else {
        //   style = new Style({
        //     image: gpsIcon1,
        //   });

        // }


      } else {

        style = new Style({
          image: new CircleStyle({
            radius: 17,
            stroke: new Stroke({
              color: '#2FC2DF',
            }),
            fill: new Fill({
              color: '#2FC2DF',
            }),
          }),
          text: new Text({
            text: size.toString(),
            font: 'bold',
            fill: new Fill({
              color: '#FFFFFF',
            }),
          }),
        });

      }
      styleCache[size] = style;
      //}
      return style;
    },
  });

  variables.map.addLayer(variables.unidadesMz);

  variables.layers["ue"] = {

    tipo: "cluster",  // Tipos vt: Vector Tile, wms, wfs
    id: "ue",
    url: "",
    title: "Unidades económicas",
    visible: true,
    minZoom: 9,
    maxZoom: 13,
    style: {
      stroke: {
        color: '#931127',
        width: 1
      }
    },
    ol: null
  }

  let jsonObj = {}
  jsonObj["ue"] = variables.unidadesMz;

  variables.layersInMap.push(jsonObj)

}

const addClusterDepto = () => {
  var styleCache = {};
  var gpsIcon1 = new Icon({
    anchor: [0.5, 12],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: gps_cyan
  });

  variables.unidadesDepto = new VectorLayer({
    title: 'Centroides departamentos',
    maxZoom: 7,
    minZoom: 1,
    source: new Cluster({
      distance: variables.distanceCluster,
      source: new VectorSource({
        features: []
      }),
    }),
    style: function (feature) {

      var size = feature.get('features').length;
      var style;
      if (size == 1) {
        style = new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({
              color: '#2FC2DF'
            })
          })
        });

      } else {

        style = new Style({
          image: new CircleStyle({
            radius: 17,
            stroke: new Stroke({
              color: '#2FC2DF',
            }),
            fill: new Fill({
              color: '#2FC2DF',
            }),
          }),
          text: new Text({
            text: size.toString(),
            font: 'bold',
            fill: new Fill({
              color: '#FFFFFF',
            }),
          }),
        });

      }
      styleCache[size] = style;
      //}
      return style;
    },
  });

  variables.map.addLayer(variables.unidadesDepto);

  variables.layers["centroides_depto"] = {

    tipo: "cluster",  // Tipos vt: Vector Tile, wms, wfs
    id: "centroides_depto",
    url: "",
    title: "Centroides departamentos",
    visible: true,
    checked: true,
    minZoom: 7,
    maxZoom: 11,
    style: {
      stroke: {
        color: '#931127',
        width: 1
      }
    },
    ol: null
  }

  let jsonObj = {}
  jsonObj["centroides_depto"] = variables.unidadesDepto;

  variables.layersInMap.push(jsonObj)

}

const addClusterMpio = () => {
  var styleCache = {};
  var gpsIcon1 = new Icon({
    anchor: [0.5, 12],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: gps_cyan
  });

  variables.unidadesMpio = new VectorLayer({
    title: 'Centroides municipios',
    maxZoom: 21,
    minZoom: 4,
    source: new Cluster({
      distance: variables.distanceCluster,
      source: new VectorSource({
        features: []
      }),
    }),
    style: function (feature) {

      var size = feature.get('features').length;
      var style;
      if (size == 1) {
        style = new Style({
          image: new CircleStyle({
            radius: 10,
            fill: new Fill({
              color: '#2FC2DF'
            })
          })
        });

      } else {

        style = new Style({
          image: new CircleStyle({
            radius: 17,
            stroke: new Stroke({
              color: '#2FC2DF',
            }),
            fill: new Fill({
              color: '#2FC2DF',
            }),
          }),
          text: new Text({
            text: size.toString(),
            font: 'bold',
            fill: new Fill({
              color: '#FFFFFF',
            }),
          }),
        });

      }
      styleCache[size] = style;
      //}
      return style;
    },
  });

  variables.map.addLayer(variables.unidadesMpio);

  variables.layers["centroides_mpio"] = {

    tipo: "cluster",  // Tipos vt: Vector Tile, wms, wfs
    id: "centroides_mpio",
    url: "",
    title: "Centroides municipios",
    visible: true,
    minZoom: 9,
    maxZoom: 13,
    style: {
      stroke: {
        color: '#931127',
        width: 1
      }
    },
    ol: null
  }

  let jsonObj = {}
  jsonObj["centroides_mpio"] = variables.unidadesMpio;

  variables.layersInMap.push(jsonObj)

}

variables.loadUE = (mpio) => {

  getCountUE(mpio).then((count) => {
    let conteo = count.data.resultado[0]["C"];
    let jump = 20000;
    let jumps = conteo / jump;
    // let jumps = 3;
    let geojsonObj;
    let offset = 0;
    // geojsonObj = crearJson(response, mpio)

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
    console.log(JSON.parse(resultado));

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
    // console.log(JSON.parse(resultado));

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
    // console.log(JSON.parse(resultado));

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


export default Mapa;

