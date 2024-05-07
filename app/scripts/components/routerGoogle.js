import React, { useState, useEffect, useContext, useLayoutEffect, Component } from "react";
import { variables } from '../base/variables.js';
import 'ol/ol.css';
import axios from "axios";
import { transformExtent, transform } from 'ol/proj';
import { Modal, Button, Image } from 'antd';
import Draggable from 'react-draggable';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'

import maplibregl from 'maplibre-gl';

const RouterGoogle = () => {

    useEffect(() => {
        const input = document.getElementById("ruteoPunto0")
        const searchBox = new google.maps.places.SearchBox(input);
        const inputUno = document.getElementById("ruteoPunto1")
        const searchBoxUno = new google.maps.places.SearchBox(inputUno);
        // Create the search box and link it to the UI element.
        searchBox.addListener("places_changed", () => {
            const places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }
            places.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                const icon = {
                    url: place.icon,
                    title: place.name,
                    position: place.geometry.location,
                    bounds: place.geometry.viewport
                }
                setPtoInicial(icon);
                // console.log(icon.bounds.Ha.hi, icon.bounds.Va.hi, icon.bounds.Ha.lo, icon.bounds.Va.lo);
                // extentResult([icon.bounds.Ha.hi, icon.bounds.Va.hi], [icon.bounds.Ha.lo, icon.bounds.Va.lo], true);
                extentResult([icon.bounds.toJSON().east, icon.bounds.toJSON().north], [icon.bounds.toJSON().west, icon.bounds.toJSON().south], true);

                if (variables.router.start != undefined) {
                    variables.router.start.remove();
                    variables.router.start != undefined
                }
    
                variables.router.start = new maplibregl.Marker()
                .setLngLat([icon.position.lng(), icon.position.lat()])
                .addTo(variables.map);
            });
        });

        searchBoxUno.addListener("places_changed", () => {
            const places = searchBoxUno.getPlaces();

            if (places.length == 0) {
                return;
            }
            places.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                const icon = {
                    url: place.icon,
                    title: place.name,
                    position: place.geometry.location,
                    bounds: place.geometry.viewport
                }
                setPtoFinal(icon);
                // console.log(icon.bounds.Ha.hi, icon.bounds.Va.hi, icon.bounds.Ha.lo, icon.bounds.Va.lo);
                // extentResult([icon.bounds.Ha.hi, icon.bounds.Va.hi], [icon.bounds.Ha.lo, icon.bounds.Va.lo], true);
                extentResult([icon.bounds.toJSON().east, icon.bounds.toJSON().north], [icon.bounds.toJSON().west, icon.bounds.toJSON().south], true);
                
                if (variables.router.finsih != undefined) {
                    variables.router.finsih.remove();
                    variables.router.finsih != undefined
                }

                variables.router.finsih = new maplibregl.Marker()
                .setLngLat([icon.position.lng(), icon.position.lat()])
                .addTo(variables.map);
            
            });
        });
    }, []);

    let opciones = {
        "route__walk": [false, false, "Caminando", "DANE__Geovisor__icon__walk", "WALKING"],
        "route__car": [true, false, "Vehículo", "DANE__Geovisor__icon__car", "DRIVING"],
        "route__bus": [false, false, "Bus", "DANE__Geovisor__icon__bus", "TRANSIT"],
        // "route__bike": [false, false, "Bicicleta", "DANE__Geovisor__icon__bike", "BICYCLING"]
    };

    const geojson = {
        'type': 'FeatureCollection',
        'features': [
            {
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'properties': {},
                    'coordinates': []
                }
            }
        ]
    };

    function extentResult(bbox1, bbox2, transfor) {
        console.log(bbox1[0], bbox1[1]);
        console.log(bbox2[0], bbox2[1]);
        let sw = new maplibregl.LngLat(bbox1[0], bbox1[1]);
        let ne = new maplibregl.LngLat(bbox2[0], bbox2[1]);
        let llb = new maplibregl.LngLatBounds(sw, ne);

        variables.map.fitBounds(llb, {
            padding: 20
        });

        // variables.map.zoomTo((variables.map.getZoom() - 1), {duration: 9000});
    }

    function handleClickDos(e, valor) {
        console.log("epa ", e)
        let origin = variables.map.getCenter();

        if (valor == "ruteoPunto0") {

            setPtoInicial("");

            if (variables.router.start != undefined) {
                variables.router.start.remove();
                variables.router.start != undefined
            }

            variables.router.start = new maplibregl.Marker({ draggable: true })
            .setLngLat([origin.lng, origin.lat])
            .addTo(variables.map);
            variables.router.start.on('dragend', onDragEndStart);
        } else {

            setPtoFinal("");

            if (variables.router.finsih != undefined) {
                variables.router.finsih.remove();
                variables.router.finsih != undefined
            }

            variables.router.finsih = new maplibregl.Marker({ draggable: true })
            .setLngLat([origin.lng, origin.lat])
            .addTo(variables.map);
            variables.router.finsih.on('dragend', onDragEndFinsih);
        }

    }

    function onDragEndStart() {
        let marker = variables.router.start;
        const lngLat = marker.getLngLat();
        console.log(lngLat.lng + " - " + lngLat.lat)
        document.getElementById("ruteoPunto0").value = lngLat.lng + "," + lngLat.lat;
    }
    function onDragEndFinsih() {
        let marker = variables.router.finsih;
        const lngLat = marker.getLngLat();
        console.log(lngLat.lng + " - " + lngLat.lat)
        document.getElementById("ruteoPunto1").value = lngLat.lng + "," + lngLat.lat;
    }

    function handleChange(e) {
        let opcionesTemp = opciones;
        const keys = Object.keys(opcionesTemp);
        for (let index = 0; index < keys.length; index++) {
            // const element = array[index];
            // console.log(keys[index] ,e);
            if (keys[index] == e) {
                // console.log("Es ", opcionesTemp[keys[index]]);
                opcionesTemp[keys[index]][0] = true
                setActive(keys[index]);
            } else {
                // console.log("no Es ", opcionesTemp[keys[index]]);
                opcionesTemp[keys[index]][0] = false
            }
        }
        // console.log("epa ", opcionesTemp);
        setBoton({
            "route__walk": [opcionesTemp["route__walk"][0], false, "Caminando", "DANE__Geovisor__icon__walk", "WALKING"],
            "route__car": [opcionesTemp["route__car"][0], false, "Vehículo", "DANE__Geovisor__icon__car", "DRIVING"],
            "route__bus": [opcionesTemp["route__bus"][0], false, "Bus", "DANE__Geovisor__icon__bus", "TRANSIT"],
            // "route__bike": [opcionesTemp["route__bike"][0], false, "Bicicleta", "DANE__Geovisor__icon__bike", "BICYCLING"]
        });
    }

    function calculateRoute() {
        // console.log(ptoInicial.position.lat());
        // console.log(ptoFinal.position.lat());
        // console.log(ptoInicial.position.lng());
        // console.log(ptoFinal.position.lng());

        let ruteoPunto0;
        let ruteoPunto1;

        if (ptoInicial == "") {
            ruteoPunto0 = document.getElementById("ruteoPunto0").value;
            ruteoPunto0 = ruteoPunto0.split(",");
        } else {
            ruteoPunto0 = [ptoInicial.position.lng(), ptoInicial.position.lat()]
        }

        if (ptoFinal == "") {
            ruteoPunto1 = document.getElementById("ruteoPunto1").value;
            ruteoPunto1 = ruteoPunto1.split(",");
        } else {
            ruteoPunto1 = [ptoFinal.position.lng(), ptoFinal.position.lat()]
        }

        extentResult(ruteoPunto0, ruteoPunto1, true);


        let directionsService = new google.maps.DirectionsService();

        let origin = { lat: parseFloat(ruteoPunto0[1]), lng: parseFloat(ruteoPunto0[0]) };
        let destination = { lat: parseFloat(ruteoPunto1[1]), lng: parseFloat(ruteoPunto1[0]) };

        let perfil = [];
        perfil.push(origin);
        // console.log(active);
        directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: active == "route__bike" ? google.maps.TravelMode.BICYCLING : active == "route__car" ? google.maps.TravelMode.DRIVING :
                active == "route__bus" ? google.maps.TravelMode.TRANSIT : google.maps.TravelMode.WALKING,
        }, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                // console.log(response);
                var myRoute = response.routes[0].legs[0];
                let jvvinnerHTML = "<ul classname='search__list'><li class='search__list__item' style='list-style:none'>";
                jvvinnerHTML += myRoute.start_address + " to ";
                jvvinnerHTML += myRoute.duration.text + " to ";
                jvvinnerHTML += myRoute.distance.text + "</li>";
                let contador = 1;

                let linea = [];
                for (let index = 0; index < myRoute.steps.length; index++) {

                    jvvinnerHTML += "<li class='search__list__item' style='list-style:none'><strong>" + contador + "</strong>. ";
                    jvvinnerHTML += myRoute.steps[index].instructions + " to ";
                    jvvinnerHTML += myRoute.steps[index].distance.text + " to ";
                    jvvinnerHTML += myRoute.steps[index].duration.text + "</li>";
                    // console.log(myRoute.steps[index].instructions);
                    // console.log(myRoute.steps[index].duration.text);
                    // console.log(myRoute.steps[index].distance.text);
                    let latstart = [myRoute.steps[index].start_point][0].lat();
                    let lngstart = [myRoute.steps[index].start_point][0].lng();

                    // console.log("linea :",latstart, lngstart);

                    // linea.push(transform([lngstart, latstart], 'EPSG:4326', 'EPSG:3857'));
                    linea.push([lngstart, latstart]);

                    (myRoute.steps[index].lat_lngs).map(function (objDos, indexDos, arrDos) {
                        console.log("linea :", objDos.lat(), objDos.lng());
                        // linea.push(transform([objDos.lng(), objDos.lat()], 'EPSG:4326', 'EPSG:3857'));
                        linea.push([objDos.lng(), objDos.lat()]);
                    }, [])

                    let latend = [myRoute.steps[index].end_point][0].lat();
                    let lngend = [myRoute.steps[index].end_point][0].lng();

                    // linea.push(transform([lngend, latend], 'EPSG:4326', 'EPSG:3857'));
                    linea.push([lngend, latend]);
                    // console.log("linea :",latend, lngend);
                    // console.log("linea :",linea);
                    contador = contador + 1;
                    perfil.push({ lat: latend, lng: lngend });

                    // calculateElevation(latend, lngend)
                    // var coordinates = [transform([lngstart, latstart], 'EPSG:4326', 'EPSG:3857'), transform([lngend, latend], 'EPSG:4326', 'EPSG:3857')];
                }

                /////////crear markets and lines///////////////////////////////////////
                if (variables.router.line != undefined) {
                    variables.map.removeLayer('route');
                    variables.map.removeSource('route');
                }

                let geojsonTEmp = geojson;
                geojsonTEmp['features'][0]['geometry']['coordinates'] = linea;
                variables.router.line = geojsonTEmp;

                variables.map.addSource('route', {
                    'type': 'geojson',
                    'data': variables.router.line
                });

                variables.map.addLayer({
                    'id': 'route',
                    'source': 'route',
                    'type': 'line',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#AA4A44',
                        'line-width': 8
                    }
                });

                if (variables.router.start != undefined) {
                    variables.router.start.remove();
                    variables.router.start != undefined
                }

                variables.router.start = new maplibregl.Marker()
                    .setLngLat([origin.lng, origin.lat])
                    .addTo(variables.map);


                if (variables.router.finsih != undefined) {
                    variables.router.finsih.remove();
                    variables.router.finsih != undefined
                }

                variables.router.finsih = new maplibregl.Marker()
                    .setLngLat([destination.lng, destination.lat])
                    .addTo(variables.map);
                /////////end crear markets and lines///////////////////////////////////

                perfil.push(destination);
                // Create an ElevationService.
                const elevator = new google.maps.ElevationService();
                // Draw the path, using the Visualization API and the Elevation service.
                displayPathElevation(perfil, elevator);
                function displayPathElevation(path, elevator) {
                    elevator
                        .getElevationAlongPath({
                            path: path,
                            samples: 256,
                        })
                        .then(plotElevation)
                        .catch((e) => {
                        });
                }
                // and plots the elevation profile on a Visualization API ColumnChart.
                function plotElevation({ results }) {

                    let labelTemp = [];
                    let dataTemp = [];
                    results.map(function (obj, index, arr) {
                        labelTemp.push("");
                        dataTemp.push(obj.elevation);
                    }, [])

                    setData({
                        labels: labelTemp,
                        datasets: [
                            {
                                label: 'Perfil',
                                borderColor: "rgb(255, 99, 132)",
                                backgroundColor: "rgba(255, 0, 0)",
                                fill: {
                                    target: "origin", // Set the fill options
                                    above: "rgba(255, 0, 0, 0.3)"
                                },
                                data: dataTemp
                            }
                        ]
                    })
                }
                // console.log(myRoute.end_address);
                jvvinnerHTML += "<li class='search__list__item' style='list-style:none'>" + myRoute.end_address + "</li></ul>";
                setActiveModal(true)
                setHtmlContent(jvvinnerHTML)
            } else {
                alert('Could not display directions due to: ' + status);
            }
        });
    }

    function calculateElevation(lat, long) {
        var config = {
            method: 'get',
            url: 'https://maps.googleapis.com/maps/api/elevation/json?locations=' + lat + '%2C' + long + '&key=AIzaSyAOha4Su8EqOFQfDE8NjrS_KdSHfu50WkA',
            headers: {}
        };
        axios.get(config.url)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    function borrarRoute() {


        if (variables.router.line != undefined) {
            variables.map.removeLayer('route');
            variables.map.removeSource('route');
            variables.router.line = undefined;
        }

        if (variables.router.start != undefined) {
            variables.router.start.remove();
            variables.router.start = undefined;
        }

        if (variables.router.finsih != undefined) {
            variables.router.finsih.remove();
            variables.router.finsih = undefined;
        }

        document.getElementById("ruteoPunto0").value = "";
        document.getElementById("ruteoPunto1").value = "";
    }

    function handleClickTres(field) {
        document.getElementById(field).value = "";

        if (valor == "ruteoPunto0") {
            if (variables.router.start != undefined) {
                variables.router.start.remove();
                variables.router.start != undefined
            }
        } else {
            if (variables.router.finsih != undefined) {
                variables.router.finsih.remove();
                variables.router.finsih != undefined
            }
        }
    }

    const [boton, setBoton] = useState(opciones);
    const [active, setActive] = useState('route__car');
    const [activeModal, setActiveModal] = useState(false);
    const [ptoInicial, setPtoInicial] = useState("");
    const [ptoFinal, setPtoFinal] = useState("");
    const [htmlContent, setHtmlContent] = useState("");
    const [options, setOptions] = useState({
        layout: {
            padding: {
                bottom: 20
            }
        },
        title: {
            display: true,
            text: "Perfil de ruta",
            fontStyle: 'Roboto',
            fontSize: 13,
            // fontColor: '#262626',
        },
        legend: {
            display: false,
        },
        responsive: true,
        tooltips: {
            titleFontSize: 11,
        },
        scales: {
            // xAxes: [
            //     {
            //         ticks: {
            //             beginAtZero: true
            //         },
            //         scaleLabel: {
            //             display: true,
            //             labelString: "mecha dos",
            //             fontStyle: 'Roboto',
            //             fontSize: 11,
            //         }
            //     }
            // ],
            yAxes: [
                {
                    display: true,
                    align: 'start',
                    ticks: {
                        fontSize: 9,
                        callback: function (label) {
                            if (/\s/.test(label)) {
                                return label.split(" ");
                            } else {
                                return label;
                            }
                        }
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Altura (mts)",
                        fontStyle: 'Roboto',
                        fontSize: 11,
                    }
                }
            ]
        }
    });
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: '',
                backgroundColor: [],
                hoverBackgroundColor: [],
                data: []
            }
        ]
    });

    const showResult = () => {
        setActiveModal(true)
    };

    const TempModalWindos = ({ open, html, options, data }) => {
        const [visible, setVisible] = useState(open);
        const [disabled, setDisabled] = useState(true);
        const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
        const [showFooter, setShowFooter] = useState(false);

        let draggleRef = React.createRef();

        const showModal = () => {
            setVisible(true);
        };

        const handleOk = (e) => {
            console.log(e);
            setVisible(false);
            setActiveModal(false)
        };

        const handleCancel = (e) => {
            console.log(e);
            setVisible(false);
            setActiveModal(false)
        };

        const onStart = (event, uiData) => {
            const { clientWidth, clientHeight } = window?.document?.documentElement;
            const targetRect = draggleRef?.current?.getBoundingClientRect();
            setBounds({
                left: -targetRect?.left + uiData?.x,
                right: clientWidth - (targetRect?.right - uiData?.x),
                top: -targetRect?.top + uiData?.y,
                bottom: clientHeight - (targetRect?.bottom - uiData?.y),
            });
        };

        return (
            <>
                <Modal
                    mask={false}
                    maskClosable={false}
                    keyboard={false}
                    wrapClassName="aaa"
                    width={500}
                    style={{
                        position: 'fixed',
                        // transform: 'translateX(-50%)',
                        left: (document.body.clientWidth - 500) / 2,
                    }}
                    // zIndex={-1}
                    title={
                        <div
                            style={{
                                width: '100%',
                                cursor: 'move',
                            }}
                            onMouseOver={() => {
                                if (disabled) {
                                    setDisabled(false);
                                }
                            }}
                            onMouseOut={() => {
                                setDisabled(true);
                            }}
                            // fix eslintjsx-a11y/mouse-events-have-key-events
                            // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
                            onFocus={() => { }}
                            onBlur={() => { }}
                        // end
                        >
                            <div className="flex justify-between items-end">
                                <div>
                                    <div dangerouslySetInnerHTML={{ __html: '<strong>Información Ruta</strong>' }} />
                                </div>
                            </div>
                        </div>
                    }
                    footer={
                        !showFooter
                            ? null
                            : [
                                <Button key="back" onClick={handleCancel}>
                                    Return
                                </Button>,
                            ]
                    }
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    modalRender={(modal) => (
                        <Draggable
                            disabled={disabled}
                            bounds={bounds}
                            onStart={(event, uiData) => onStart(event, uiData)}
                        >
                            <div aa="2" ref={draggleRef}>
                                {modal}
                            </div>
                        </Draggable>
                    )}
                >
                    <div className="toolbar__secondPanelContent">
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                    <Line options={options} data={data} />
                </Modal>
            </>
        );
    };

    return (
        <div>
            <div className="toolBar__container__panel__functionBox__step --active">
                <p className="toolBar__container__panel__functionBox__textCenter">Elija el tipo de ruta que deseas calcular: </p>
                <ul className="measure__list">
                    {
                        Object.keys(boton).map((values, index) => {
                            console.log(values, index);
                            return <li key={'measure1' + `${index + 1}`}
                                className={`measure__item measure__calcular ${boton[values][0] ? "--active" : ""}`}
                                id={values} onClick={() => handleChange(values)}>
                                <div className="measure__item__icon">
                                    <span className={boton[values][3]}></span>
                                </div>
                                <p className="measure__item__name">{boton[values][2]}</p>
                            </li>
                        })
                    }
                </ul>
                <div className="toolBar__container__panel__functionBox__inputContainer">
                    <div className="toolBar__container__panel__functionBox__inputContainer__icon">
                        <span className="DANE__Geovisor__icon__radioButtonFilled"></span>
                    </div>
                    <input type="text" id="ruteoPunto0" name="ruteoPunto0"
                        placeholder="Escriba el punto de partida o realice clic en el mapa"
                        className="toolBar__container__panel__functionBox__inputConainer__textInput pac-target-input"
                        autocomplete="off" />
                    <button className="toolBar__container__panel__functionBox__inputContainer__addPointButton" name="ruteoPunto0" onClick={() => handleClickDos("measure__drawPoint", "ruteoPunto0")}>
                        <span className="DANE__Geovisor__icon__targetPoint"></span>
                    </button>
                    <button className="toolBar__container__panel__functionBox__inputContainer__addPointButton" name="searchPoint" style={{ "right": "33px" }} onClick={() => handleClickTres("ruteoPunto0")}>
                        <span className="DANE__Geovisor__icon__erase"></span>
                    </button>
                </div>
                <div className="toolBar__container__panel__functionBox__inputContainer">
                    <div className="toolBar__container__panel__functionBox__inputContainer__icon">
                        <span className="DANE__Geovisor__icon__location"></span>
                    </div>
                    <input
                        type="text"
                        name="ruteoPunto1"
                        id="ruteoPunto1"
                        placeholder="Clic en este campo de texto y luego en el mapa"
                        className="toolBar__container__panel__functionBox__inputConainer__textInput"
                    />
                    <button className="toolBar__container__panel__functionBox__inputContainer__addPointButton" name="ruteoPunto1" onClick={() => handleClickDos("measure__drawPoint", "ruteoPunto1")}>
                        <span className="DANE__Geovisor__icon__targetPoint"></span>
                    </button>
                    <button className="toolBar__container__panel__functionBox__inputContainer__addPointButton" name="searchPoint" style={{ "right": "33px" }} onClick={() => handleClickTres("ruteoPunto1")}>
                        <span className="DANE__Geovisor__icon__erase"></span>
                    </button>
                    <p className="toolBar__container__panel__functionBox__inputContainer__errorMessage">Debe ingresar un punto de
                        partida. Ejemplo: Cra. 59 #26-60, Bogotá</p>
                </div>
                {/* <button id="addInput__coordenada" className="toolBar__container__panel__functionBox__step__addbtn --invisible" onClick={() => calculateRoute()}>
                    <div className="toolBar__container__panel__functionBox__step__addbtn__icon"  >
                        <span className="DANE__Geovisor__icon__plus"></span>
                    </div>
                    <p className="toolBar__container__panel__functionBox__step__addbtn__name">Calcular ruta</p>
                </button> */}
                <p className="toolBar__container__panel__functionBox__step__errorMessage">Debe ingresar un punto de partida o destino.
                </p>
                <button className="toolBar__container__panel__functionBox__XY__btn" id="ruteoBtn__elevation" onClick={() => calculateRoute()}>
                    <div className="toolBar__container__panel__functionBox__XY__btn__icon">
                        <span className="DANE__Geovisor__icon__plus"></span>
                    </div>
                    {/* <p className="toolBar__container__panel__functionBox__XY__btn__name">Ver mapa de elevación</p> */}
                    <p className="toolBar__container__panel__functionBox__XY__btn__name">Calcular ruta</p>
                </button>
                <button className="toolBar__container__panel__functionBox__XY__btn" id="ruteoBtn__elevation" onClick={() => showResult()}>
                    <div className="toolBar__container__panel__functionBox__XY__btn__icon">
                        <span className="DANE__Geovisor__icon__plus"></span>
                    </div>
                    {/* <p className="toolBar__container__panel__functionBox__XY__btn__name">Ver mapa de elevación</p> */}
                    <p className="toolBar__container__panel__functionBox__XY__btn__name">Resultados</p>
                </button>
                <button className="toolBar__container__panel__functionBox__XY__btn" id="ruteoBtn__Borrar" onClick={() => borrarRoute()}>
                    <div className="toolBar__container__panel__functionBox__XY__btn__icon">
                        <span className="DANE__Geovisor__icon__erase"></span>
                    </div>
                    <p className="toolBar__container__panel__functionBox__XY__btn__name">Borrar ruta</p>
                </button>
            </div>
            <TempModalWindos open={activeModal} html={htmlContent} options={options} data={data} />
        </div>
    );
}
export default RouterGoogle;



// ujustes Router

// zoom a la linea y a los puntos de inicio y final
// efecto de la linea prende y apaga
// desactivar boton de Bicicleta
// tilulo y ejes para la grafica perfil de terreno
// enviar instrucciones de incorporación de componente