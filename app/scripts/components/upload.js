// Componente para añadir datos externos kml/kzm o cargar servicios web de tipo WMS
// Diego Rodriguez
// 30/03/2021

import React, { Component, Fragment, useState } from 'react';
import { KML } from 'ol/format'
import { Vector } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import JSZip from 'jszip'
import axios from 'axios'
import TileLayer from 'ol/layer/Tile';
import TileWMS from 'ol/source/TileWMS';
import { variables } from '../base/variables'

const Upload = () => {

    let claseActiva = "upload__item --active";
    let claseInactiva = "upload__item";
    let claseActivaPanel = "upload__panel --active";
    let claseInactivaPanel = "upload__panel";
    const [activePanel, setActivePanel] = useState("kml");
    const [inactivePanel, setInactivePanel] = useState("wms");
    const [activePanelCapas, setActivePanelCapas] = useState(false);

    // Manejo del panel activo
    function handleClickPanel(e) {
        let target = e.currentTarget.id;

        if (target == "upload__kml") {
            setActivePanel("kml");
            setInactivePanel("wms");
        } else if (target == "upload__wms") {
            setActivePanel("wms");
            setInactivePanel("kml");
        }
    }

    // Leer KML/KMZ
    const getFile = (e) => {
        e.preventDefault()
        let fileName = e.target.files[0].name.split(".")[0];
        let extension = e.target.files[0].name.split(".")[1];
        let file = e.target.files[0];

        const reader = new FileReader()
        reader.onload = async (e) => {

            let file_content = e.target.result;

            if (extension == 'kmz') {
                var zip = new JSZip();
                zip.loadAsync(file)
                    .then(function (zip) {
                        Object.keys(zip.files).forEach(function (filename) {
                            zip.files[filename].async('string').then(function (fileData) {
                                file_content = fileData;
                                //   console.log(file_content)
                                loadLayer(file_content, fileName);
                            })
                        })
                    });
            } else if (extension == 'kml') {
                loadLayer(file_content, fileName)
            } else {
                alert("La extensión del archivo no es válida, debe comprobar que sea .kmz o .kml")
            }
        };
        reader.readAsText(e.target.files[0]);
    }

    const getLayersfromWMS = (e) => {
        let target = e.currentTarget;
        // console.log(target);
        setActivePanelCapas(true);
        let url = document.getElementById("enlaceWms").value;
        let capa = document.getElementById("nombreWms").value;
        let wmsLyrExternal = new TileLayer({
            source: new TileWMS({
                url: url,
                params: {
                    'LAYERS': capa,
                    transparent: 'true',
                    FORMAT: 'image/png'
                },
                crossOrigin: 'anonymous'
            })

        })

        variables.map.addLayer(wmsLyrExternal)
        // let layerExtent = wmsLyrExternal.getSource().getExtent();

        // if (layerExtent) {
        //     variables.map.getView().fit(layerExtent);
        // }


        variables.layers[capa] = {

            tipo: "wms",  // Tipos vt: Vector Tile, wms, wfs
            id: capa,
            url: "",
            title: capa + " (WMS)",
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
        jsonObj[capa] = wmsLyrExternal;

        variables.layersInMap.push(jsonObj)
    }

    return (
        <Fragment>
            <div className="tools__panel">
                <h3 className="tools__title"> Cargar</h3>
                <p className="tools__text">Seleccione el modo de carga</p>
                <div className="upload__container">
                </div>
                <ul className="upload__list">
                    <li className={activePanel === 'kml' ? claseActiva : claseInactiva} id="upload__kml" onClick={handleClickPanel}>
                        <p className="upload__item__name"> .KML / .KMZ </p>
                    </li>
                    <li className={activePanel === 'wms' ? claseActiva : claseInactiva} id="upload__wms" onClick={handleClickPanel}>
                        <p className="upload__item__name"> WMS </p>
                    </li>
                </ul>
                <div className={activePanel === 'kml' ? claseActivaPanel : claseInactivaPanel} id="upload__kml">
                    <input type="file" accept=".kml, .kmz" id="upload__form" onChange={getFile} />
                    <div className="btnContainer">
                        <button className="btnContainer__btn" id="upload__link">
                            <div className="btnContainer__icon">
                                <span className="DANE__Geovisor__icon__upload"></span>
                            </div>
                            <p className="btnContainer__name">Cargar .KML / .KMZ</p>
                        </button>
                    </div>
                </div>
                <div className={activePanel === 'wms' ? claseActivaPanel : claseInactivaPanel} id="upload__wms">
                    <div className="inputBox" id="upload__wmsUrl">
                        <p className="inputBox__name">Ingrese el enlace WMS (URL)</p>
                        <input className="inputBox__input" placeholder="https://www.enlacewms.com/" id="enlaceWms" />
                    </div>
                    <div className="inputBox" id="upload__wmsName">
                        <p className="inputBox__name">Ingrese el nombre de la capa</p>
                        <input className="inputBox__input" placeholder="Nombre capa" id="nombreWms" />
                    </div>
                    <div className="btnContainer">
                        <button className="btnContainer__btn" id="upload__linkBtn" onClick={getLayersfromWMS}>
                            <div className="btnContainer__icon">
                                <span className="DANE__Geovisor__icon__upload"></span>
                            </div>
                            <p className="btnContainer__name">Cargar enlace</p>
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

function loadLayer(text, fileName) {

    let features = new KML().readFeatures(text, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
    })


    let KMLvectorSource = new VectorSource({
        features: features
    });

    let KMLvector = new Vector({ source: KMLvectorSource });

    variables.map.addLayer(KMLvector)

    let layerExtent = KMLvector.getSource().getExtent();

    if (layerExtent) {
        variables.map.getView().fit(layerExtent);
    }


    variables.layers[fileName] = {

        tipo: "kml",  // Tipos vt: Vector Tile, wms, wfs
        id: fileName,
        url: "",
        title: fileName + " (KML/KMZ)",
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
    jsonObj[fileName] = KMLvector;

    variables.layersInMap.push(jsonObj)

}


export default Upload;


