// CONFIGURACION FILTRO DE BUSQUEDA GEOGRAFICA Y POR OPERACION 

import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import municipios from '../../json/mpio-extent.json'
import departamentos from '../../json/dpto-extent.json'
import clase from '../../json/clase-extent.json'
import centros from '../../json/centros_poblados-extent.json'
import Select from 'react-select'
import { boundingExtent } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import { transform } from 'ol/proj';
import { variables } from '../base/variables';
import { servidorQuery } from '../base/request';
import axios from "axios";


function bboxExtent(bbox) {
    bbox = bbox.replace('BOX(', '').replace(')', '')
    bbox = bbox.split(",")
    let bbox1 = bbox[0].split(" ")
    let bbox2 = bbox[1].split(" ")
    var ext = boundingExtent([[bbox1[0], bbox1[1]], [bbox2[0], bbox2[1]]]);
    ext = transformExtent(ext, 'EPSG:4326', 'EPSG:3857');
    variables.map.getView().fit(ext, variables.map.getSize());
}

function groupByFunct(array, key, substring, prop) {
    const groupBy = array.reduce((objectsByKeyValue, obj) => {
        let value = "";
        if (prop != undefined) {
            value = obj.properties[key];
        } else {
            if (substring == undefined) {
                value = obj[key];
            } else {
                value = obj[key].substring(0, substring);
            }
        }
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});
    return groupBy
}

const FilterDos = (props) => {
    useEffect(() => {
        const consultaAPI = async () => {
            // console.log("params ",variables.oes);
            // console.log("params ",variables.mpio);
            let one = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/recuentos/servicios/operacion_estadistica.php?ce=si";
            let two = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/investigacion_clases.php?encuesta=true&datos=true";
            const requestOne = axios.get(one);
            const requestTwo = axios.get(two);
            // const requestThree = axios.get(three);
            axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {

                variables.investigaciones["filtroTres"] = (responses[0].data.resultado).map((item, index) => {
                    return ({ "ID_INVESTIGACION": parseInt(item.ID), "INVESTIGACION": item.NOMBRE })
                }, []).sort((a, b) => (a.ID > b.ID) ? 1 : -1).map((item, index) => {
                    console.log(item)
                    return ({ "ID_INVESTIGACION": item.ID_INVESTIGACION.toString(), "INVESTIGACION": item.INVESTIGACION })
                }, [])

                // console.log(variables.investigaciones["filtroTres"])
                // console.log(responses[1].data.respuesta)

                variables.investigaciones["filtroCuatro"] = responses[1].data.respuesta;
                variables.estadosFiltrosDos.investigacionesEst = variables.investigaciones["filtroTres"];
                setInvestigacionesEst(variables.investigaciones["filtroTres"]);
                console.log("params ", variables.oes);
                console.log("params ", variables.mpio);

                console.log(variables.investigaciones["filtroTres"])
                console.log(variables.investigaciones["filtroCuatro"])

                if (variables.oes != undefined && variables.mpio != undefined) {
                    const filtroCuatro = (variables.investigaciones["filtroTres"]).filter((o) => o.ID_INVESTIGACION == variables.oes)
                    variables.cargaInicial[0] = filtroCuatro[0];
                    let dptoFilter = dptoGeo.filter((o) => o.cod_dane == (variables.mpio).substring(0, 2))
                    variables.cargaInicial[1] = dptoFilter[0];
                    let filteredOptions = mpios.filter((o) => (o.cod_dane).substring(0, 5) == (variables.mpio).substring(0, 5))
                    variables.cargaInicial[2] = filteredOptions[0];
                    cargaInicial();

                } else {
                    cargaInicial();
                }

            }))
            // const consulta = axios({ method: "GET", url: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/investigacion_clases.php" });
            // consulta.then(function (response) {
            //     variables.investigaciones["filtroTres"] = response.data.resultadoUno;
            //     variables.investigaciones["filtroCuatro"] = response.data.resultadoDos;
            //     variables.estadosFiltrosDos.investigacionesEst = response.data.resultadoUno;
            //     setInvestigacionesEst(response.data.resultadoUno);
            //     cargaInicial();
            // });
        }
        // const consultaAPI = async () => {
        //     const consulta = axios({ method: "GET", url: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/investigacion_clases.php" });
        //     consulta.then(function (response) {
        //         variables.investigaciones["filtroTres"] = response.data.resultadoUno;
        //         variables.investigaciones["filtroCuatro"] = response.data.resultadoDos;
        //         variables.estadosFiltrosDos.investigacionesEst = response.data.resultadoUno;
        //         setInvestigacionesEst(response.data.resultadoUno);
        //         cargaInicial();
        //     });
        // }
        if (variables.investigaciones["filtroTres"] == undefined &&
            variables.investigaciones["filtroCuatro"] == undefined) {
            consultaAPI();
        }
    }, []);

    //option dataset
    const dptoGeo = departamentos
    const mpios = municipios
    const clases = [
        { value: '1', label: '1. Cabecera' },
        { value: '2', label: '2. Centro Poblado' },
        { value: '3', label: '3. Rural Disperso' }
    ]
    //botones 
    let claseActiva = "upload__item --active";
    let claseInactiva = "upload__item";
    let claseActivaPanel = "upload__panel --active";
    let claseInactivaPanel = "upload__panel";
    const [activePanel, setActivePanel] = useState(variables.activePanel);
    const [inactivePanel, setInactivePanel] = useState("geo");

    //estados de los values de los selects est
    const [selectedInvEst, setSelectedInvEst] = useState(variables.estadosFiltrosDos.selectedInvEst);
    const [selectedDptoEst, setSelectedDptoEst] = useState(variables.estadosFiltrosDos.selectedDptoEst);
    const [selectedMpioEst, setSelectedMpioEst] = useState(variables.estadosFiltrosDos.selectedMpioEst);
    const [selectedClaseEst, setSelectedClaseEst] = useState(variables.estadosFiltrosDos.selectedClaseEst);
    const [selectedCpobladoEst, setSelectedCpobladoEst] = useState(variables.estadosFiltrosDos.selectedCpobladoEst);
    const [selectedPeriodoEst, setSelectedPeriodoEst] = useState(variables.estadosFiltrosDos.selectedPeriodoEst);
    const [selectedSegmentoEst, setSelectedSegmentoEst] = useState(variables.estadosFiltrosDos.selectedSegmentoEst);
    const [selectedMznEst, setSelectedMznEst] = useState(variables.estadosFiltrosDos.selectedMznEst);
    //estados de los selects est
    const [investigacionesEst, setInvestigacionesEst] = useState(variables.estadosFiltrosDos.investigacionesEst);
    const [dptoEst, setDptoEst] = useState(variables.estadosFiltrosDos.dptoEst);
    const [mpioEst, setMpioEst] = useState(variables.estadosFiltrosDos.mpioEst);
    const [claseEst, setClaseEst] = useState(variables.estadosFiltrosDos.claseEst);
    const [cpobladoEst, setCpobladoEst] = useState(variables.estadosFiltrosDos.cpobladoEst);
    const [periodoEst, setPeriodoEst] = useState(variables.estadosFiltrosDos.periodoEst);
    const [segmentoEst, setSegmentoEst] = useState(variables.estadosFiltrosDos.segmentoEst);
    const [mznEst, setMznEst] = useState(variables.estadosFiltrosDos.mznEst);
    //estados de los selects geo
    const [selectedDptoGeo, setSelectedDptoGeo] = useState(variables.estadosFiltrosDos.selectedDptoGeo);
    const [selectedMpioGeo, setSelectedMpioGeo] = useState(variables.estadosFiltrosDos.selectedMpioGeo);
    const [selectedClaseGeo, setSelectedClaseGeo] = useState(variables.estadosFiltrosDos.selectedClaseGeo);
    const [selectedCpobladoGeo, setSelectedCpobladoGeo] = useState(variables.estadosFiltrosDos.selectedCpobladoGeo);
    const [selectedInvGeo, setSelectedInvGeo] = useState(variables.estadosFiltrosDos.selectedInvGeo);
    const [selectedPeriodoGeo, setSelectedPeriodoGeo] = useState(variables.estadosFiltrosDos.selectedPeriodoGeo);
    const [selectedSegmentoGeo, setSelectedSegmentoGeo] = useState(variables.estadosFiltrosDos.selectedSegmentoGeo);
    const [selectedMznGeo, setSelectedMznGeo] = useState(variables.estadosFiltrosDos.selectedMznGeo);
    //estados de los values de los selects geo
    const [mpioGeo, setMpioGeo] = useState(variables.estadosFiltrosDos.mpioGeo);
    const [claseGeo, setClaseGeo] = useState(variables.estadosFiltrosDos.claseGeo);
    const [investigacionesGeo, setInvestigacionesGeo] = useState(variables.estadosFiltrosDos.investigacionesGeo);
    const [cpobladoGeo, setCpobladoGeo] = useState(variables.estadosFiltrosDos.cpobladoGeo);
    const [periodoGeo, setPeriodoGeo] = useState(variables.estadosFiltrosDos.periodoGeo);
    const [segmentoGeo, setSegmentoGeo] = useState(variables.estadosFiltrosDos.segmentoGeo);
    const [mznGeo, setMznGeo] = useState(variables.estadosFiltrosDos.mznGeo);
    //estado para controlar la visualización del botón de seguimiento RUE
    const [seguimientoRUE, setSeguimientoRUE] = useState(true);

    //function carga inicial
    function cargaInicial() {
        //carga investigaciones
        variables.estadosFiltrosDos.selectedInvEst = variables.cargaInicial[0];
        setSelectedInvEst(variables.cargaInicial[0]);

        //carga dpto
        const filtreInv = (variables.investigaciones["filtroCuatro"]).filter((o) => (o.COD_ENC) == variables.cargaInicial[0].ID_INVESTIGACION)
            .map((filteredResult, index) => {
                return ((filteredResult.DANE).substring(0, 2))
            })
        variables.estadosFiltrosDos.dptoEst = dptoGeo.filter((o) => filtreInv.indexOf(o.cod_dane) != -1)
        setDptoEst(variables.estadosFiltrosDos.dptoEst);
        variables.estadosFiltrosDos.selectedDptoEst = variables.cargaInicial[1]
        setSelectedDptoEst(variables.cargaInicial[1]);

        //carga mpio
        const filteredOptio = (variables.investigaciones["filtroCuatro"]).filter((o) => (o.DANE).substring(0, 2) == variables.cargaInicial[1].cod_dane && (o.COD_ENC) == variables.cargaInicial[0].ID_INVESTIGACION)
            .map((filteredResult, index) => {
                return (filteredResult.DANE).substring(0, 5)
            })
        const filteredOptions = mpios.filter((o) => (o.cod_dane).substring(0, 2) == variables.cargaInicial[1].cod_dane && filteredOptio.indexOf(o.cod_dane) != -1)
        variables.estadosFiltrosDos.mpioEst = filteredOptions
        setMpioEst(variables.estadosFiltrosDos.mpioEst);
        variables.estadosFiltrosDos.selectedMpioEst = variables.cargaInicial[2]
        setSelectedMpioEst(variables.cargaInicial[2]);

        //carga clase
        const filteredOptioDos = (variables.investigaciones["filtroCuatro"]).filter((o) => (o.DANE).substring(0, 5) == variables.cargaInicial[2].cod_dane && (o.COD_ENC) == variables.cargaInicial[0].ID_INVESTIGACION)
            .map((filteredResult, index) => {
                return (filteredResult.DANE).substring(5, 6)
            })
        const filtroDos = clases.filter((o) => filteredOptioDos.indexOf(o.value) != -1)
        variables.estadosFiltrosDos.claseEst = filtroDos
        setClaseEst(variables.estadosFiltrosDos.claseEst);
        variables.estadosFiltrosDos.selectedClaseEst = variables.cargaInicial[3]
        setSelectedClaseEst(variables.cargaInicial[3]);

        //bbox y consulta
        variables.changeHeader(variables.cargaInicial[0], "")
        variables.changeHeader(variables.cargaInicial[2], "")
        variables.changeHeader(variables.cargaInicial[3], "")
        const extentInit = clase.filter((o) => o.cod_dane == [variables.cargaInicial[2]["cod_dane"] + variables.cargaInicial[3]["value"]])
        let bbox = extentInit[0].bextent;
        bboxExtent(bbox);
        variables.pintarInvestigacion(variables.cargaInicial[0]["ID_INVESTIGACION"], variables.cargaInicial[1]["cod_dane"], variables.cargaInicial[2]["cod_dane"], variables.cargaInicial[3]["value"], []);
        variables.querysDos(variables.cargaInicial[0]["ID_INVESTIGACION"], variables.cargaInicial[1]["cod_dane"], variables.cargaInicial[2]["cod_dane"], variables.cargaInicial[3]["value"], "est", true);
    }

    function updateDateSet(index, values) {
        console.log(index, values)
        if (index === 0) {
            if (values <= 1) {
                variables.estadosFiltrosDos.selectedDptoEst = 0;
                setSelectedDptoEst(null);
                variables.estadosFiltrosDos.dptoEst = [];
                setDptoEst(variables.estadosFiltrosDos.dptoEst);
            }
            if (values <= 2) {
                variables.estadosFiltrosDos.selectedMpioEst = 0;
                setSelectedMpioEst(null);
                variables.estadosFiltrosDos.mpioEst = [];
                setMpioEst(variables.estadosFiltrosDos.mpioEst);
            }
            if (values <= 3) {
                variables.estadosFiltrosDos.selectedClaseEst = 0;
                setSelectedClaseEst(null);
                variables.estadosFiltrosDos.claseEst = [];
                setClaseEst(variables.estadosFiltrosDos.claseEst);
            }
            if (values <= 5) {
                variables.estadosFiltrosDos.selectedPeriodoEst = 0;
                setSelectedPeriodoEst(null);
                variables.estadosFiltrosDos.periodoEst = [];
                setPeriodoEst(variables.estadosFiltrosDos.periodoEst);
                // console.log(periodoEst);
            }
            if (values <= 6) {
                variables.estadosFiltrosDos.selectedSegmentoEst = 0;
                setSelectedSegmentoEst(null);
                variables.estadosFiltrosDos.segmentoEst = [];
                setSegmentoEst(variables.estadosFiltrosDos.segmentoEst);
            }
        } else {
            if (values <= 1) {
                variables.estadosFiltrosDos.selectedMpioGeo = 0;
                setSelectedMpioGeo(null);
                variables.estadosFiltrosDos.mpioGeo = [];
                setMpioGeo(variables.estadosFiltrosDos.mpioGeo);
            }
            if (values <= 2) {
                variables.estadosFiltrosDos.selectedClaseGeo = 0;
                setSelectedClaseGeo(null);
                variables.estadosFiltrosDos.claseGeo = [];
                setClaseGeo(variables.estadosFiltrosDos.claseGeo);
            }
            if (values <= 3) {
                variables.estadosFiltrosDos.selectedInvGeo = 0;
                setSelectedInvGeo(null);
                variables.estadosFiltrosDos.setInvestigacionesGeo = [];
                setInvestigacionesGeo(variables.estadosFiltrosDos.setInvestigacionesGeo);
            }
            if (values <= 5) {
                variables.estadosFiltrosDos.selectedPeriodoGeo = 0;
                setSelectedPeriodoGeo(null);
                variables.estadosFiltrosDos.periodoGeo = [];
                setPeriodoGeo(variables.estadosFiltrosDos.periodoGeo);
            }
            if (values <= 6) {
                variables.estadosFiltrosDos.selectedSegmentoGeo = 0;
                setSelectedSegmentoGeo(null);
                variables.estadosFiltrosDos.segmentoGeo = [];
                setSegmentoGeo(variables.estadosFiltrosDos.segmentoGeo);
            }
        }
    }

    function stylosMapa(invest, dpto, mpio, clase, tipo, change) {
        if (change == undefined) {
            // variables.daneSelect = groupByFunct(variables.responseOne.data.resultadopuntos.features, "CDANE", "", true);
            // variables.anomes = groupByFunct(variables.responseOne.data.resultadopuntos.features, "PTOTAL", "", true);
            // variables.segmento = groupByFunct(variables.responseOne.data.resultadopuntos.features, "P11", "", true);

            variables.daneSelect = variables.responseOne.data.resultadomanzana;
            variables.anomes = variables.responseOne.data.resultadoanio;
            variables.segmento = variables.responseOne.data.resultadoag;

            let anomesDos = Object.keys(variables.anomes).map((item, index) => {
                return ({ "value": item, "label": item, "data": variables.anomes[item], "data-info": "anomes" })
            }, []).sort((a, b) => (a.value > b.value) ? -1 : 1)
            let segmentoDos = Object.keys(variables.segmento).map((item, index) => {
                // console.log(variables.segmento)
                return ({ "value": item, "label": item, "data": variables.segmento[item], "data-info": "segmento" })
            }, []).sort((a, b) => (a.value > b.value) ? -1 : 1)
            let codDaneDos = Object.keys(variables.daneSelect).map((item, index) => {
                return { "value": item.substring(0, 22), "label": item.substring(0, 22), "data": variables.daneSelect[item], "data-info": "cDane" }
            }, []).sort((a, b) => (a.value > b.value) ? 1 : -1)
            // console.log("año filtro", anomesDos[0]["value"])
            variables.mgnWms(anomesDos[0]["value"]);
            if (tipo == "est") {
                variables.estadosFiltrosDos.periodoEst = anomesDos;
                setPeriodoEst(anomesDos);
                // console.log(anomesDos)
                variables.estadosFiltrosDos.selectedPeriodoEst = anomesDos[0];
                // console.log(parseInt(anomesDos[0].value));
                // if (parseInt(anomesDos[0].value) >= 202008) {
                //     setSeguimientoRUE(true)
                // }
                setSelectedPeriodoEst(anomesDos[0]);
                variables.estadosFiltrosDos.segmentoEst = segmentoDos;
                setSegmentoEst(segmentoDos);
                variables.estadosFiltrosDos.mznEst = codDaneDos;
                setMznEst(codDaneDos);
                // console.log(anomesDos[0]);
            } else {
                variables.estadosFiltrosDos.periodoGeo = anomesDos;
                setPeriodoGeo(anomesDos);
                // console.log(anomesDos)
                variables.estadosFiltrosDos.selectedPeriodoGeo = anomesDos[0];
                // console.log(parseInt(anomesDos[0].value));
                // console.log(anomesDos[0]);
                // if (parseInt(anomesDos[0].value) >= 202008) {
                //     setSeguimientoRUE(true)
                // }
                setSelectedPeriodoGeo(anomesDos[0]);
                variables.estadosFiltrosDos.segmentoGeo = segmentoDos;
                setSegmentoGeo(segmentoDos);
                variables.estadosFiltrosDos.mznGeo = codDaneDos;
                setMznGeo(codDaneDos);

            }
            // console.log("tres", Object.keys(variables.daneSelect).length); //agrupacion por manzana
            // console.log("cuatro", variables.anomes); // agrupacion por año
            // console.log("cinco", variables.segmento); // agrupacion por segmento
            // console.log("siete", anomesDos); // array select año
            // console.log("ocho", segmentoDos); // array segmentos
            // console.log("nueve", codDaneDos);  // array manzana


            let leyenda = [];
            leyenda.push([anomesDos[0]["value"], variables.colores[0]]);
            // console.log("jvvtres", leyenda)
            variables.changeHeader("", anomesDos[0])
            variables.changeLegend(leyenda);
            variables.pintarInvestigacion(invest, dpto, mpio, clase, leyenda);
            variables.anioSelect = [anomesDos[0]["value"]]
            variables.pintarInvestigacion(0, 0, 0, 0, [1], "meses");
            if (invest == '45') {
                variables.pintarManzana(invest, mpio)
            }
            updateCluster([anomesDos[0]["value"]], invest)

            // variables.changeLoader(false);


            // }
        } else {
            let selectedPeriodoEstTemp;
            if (activePanel == "est") {
                selectedPeriodoEstTemp = variables.estadosFiltrosDos.selectedPeriodoEst;
            } else {
                selectedPeriodoEstTemp = variables.estadosFiltrosDos.selectedPeriodoGeo;
            }
            let segmentosVal = (selectedPeriodoEstTemp).map((result, index) => {
                return result.value;
            })

            variables.anioSelect = segmentosVal;
            variables.anomes = groupByFunct((variables.responseOne.data.resultadopuntos.features).filter((o) => segmentosVal.indexOf((o.properties.PTOTAL)) != -1), "PTOTAL", "", true)
            variables.segmento = groupByFunct((variables.responseOne.data.resultadopuntos.features).filter((o) => segmentosVal.indexOf((o.properties.PTOTAL)) != -1), "P11", "", true)
            let segmentoDos = Object.keys(variables.segmento).map((item, index) => {
                // console.log(variables.segmento)
                return ({ "value": item, "label": item, "data": variables.segmento[item], "data-info": "segmento" })
            }, []).sort((a, b) => (a.value > b.value) ? -1 : 1)
            if (activePanel == "est") {
                variables.estadosFiltrosDos.segmentoEst = segmentoDos;
                // console.log(segmentoDos);
                setSegmentoEst(segmentoDos);
                setMznEst(segmentoDos);
            } else {
                variables.estadosFiltrosDos.segmentoGeo = segmentoDos;
                // console.log(segmentoDos);
                setSegmentoGeo(segmentoDos);
            }
            // console.log("anomes ", variables.anomes)
            // console.log("anioSelect ", variables.anioSelect)
            let anomesDos = Object.keys(variables.anomes).map((item, index) => {
                return ({ "value": item, "label": item, "data": variables.anomes[item], "data-info": "anomes" })
            }, [])
            let leyenda = anomesDos.map(function (obj, i, array) {
                return [obj.value, variables.colores[i]]
            }, [])
            variables.changeLegend(leyenda);
            variables.pintarInvestigacion(invest, dpto, mpio, clase, leyenda, (selectedPeriodoEstTemp).value);
            variables.pintarInvestigacion(0, 0, 0, 0, [1], "meses");
            updateCluster(segmentosVal, invest)

        }
    }

    function updateCluster(arregloFiltrar, investigacion) {
        if (investigacion == "45") {
            if (variables.responseTwo.data.resultadoManual != undefined) {
                variables.pintarCluster(2, (variables.responseTwo.data.resultadoManual), 0);
            }
            if (variables.responseTwo.data.resultadoGps != undefined) {
                variables.pintarCluster(2, (variables.responseTwo.data.resultadoGps), 1);
            }
            if (variables.responseOne.data.resultadopuntos != undefined) {
                variables.pintarCluster(0, (variables.responseOne.data.resultadopuntos), 1);
            }
            if (variables.responseOne.data.resultadogeoshape != undefined) {
                variables.pintarCluster(0, (variables.responseOne.data.resultadogeoshape), 0);
            }
        } else {
            variables.resultadopuntosTemp = groupByFunct(variables.responseOne.data.resultadopuntos.features, "PTOTAL", "", true);
            variables.resultadogeoshapeTemp = groupByFunct(variables.responseOne.data.resultadogeoshape.features, "PTOTAL", "", true);
            if (variables.responseTwo.data.resultadoManual != undefined) {
                variables.resultadoManualTemp = groupByFunct(variables.responseTwo.data.resultadoManual.features, "PTOTAL", "", true);
            } else {
                variables.resultadoManualTemp = []
            }
            if (variables.responseTwo.data.resultadoGps != undefined) {
                variables.resultadoGpsTemp = groupByFunct(variables.responseTwo.data.resultadoGps.features, "PTOTAL", "", true);
            } else {
                variables.resultadoGpsTemp = []
            }

            let resultadopuntosTempDos = {
                type: "FeatureCollection",
                features: [],
            };
            let resultadogeoshapeTempDos = {
                type: "FeatureCollection",
                features: [],
            };
            let resultadoManualTempDos = {
                type: "FeatureCollection",
                features: [],
            };
            let resultadoGpsTempDos = {
                type: "FeatureCollection",
                features: [],
            };

            arregloFiltrar.map(function (item, key) {
                if (variables.resultadopuntosTemp[item] != undefined) {
                    resultadopuntosTempDos.features = resultadopuntosTempDos.features.concat(variables.resultadopuntosTemp[item]);
                }
                if (variables.resultadogeoshapeTemp[item] != undefined) {
                    resultadogeoshapeTempDos.features = resultadogeoshapeTempDos.features.concat(variables.resultadogeoshapeTemp[item]);
                }
                if (variables.resultadoManualTemp[item] != undefined) {
                    resultadoManualTempDos.features = resultadoManualTempDos.features.concat(variables.resultadoManualTemp[item]);
                }
                if (variables.resultadoGpsTemp[item] != undefined) {
                    resultadoGpsTempDos.features = resultadoGpsTempDos.features.concat(variables.resultadoGpsTemp[item]);
                }
            }, [])

            if (variables.responseTwo.data.resultadoManual != undefined) {
                variables.pintarCluster(2, (resultadoManualTempDos), 0);
            }
            if (variables.responseTwo.data.resultadoGps != undefined) {
                variables.pintarCluster(2, (resultadoGpsTempDos), 1);
            }
            if (variables.responseOne.data.resultadopuntos != undefined) {
                variables.pintarCluster(0, (resultadopuntosTempDos), 1);
            }
            if (variables.responseOne.data.resultadogeoshape != undefined) {
                variables.pintarCluster(0, (resultadogeoshapeTempDos), 0);
            }

        }
        variables.changeLoader(false);
    }

    const abrirRUE = (evt) => {
        console.log("Entre a RUE");
        // variables.loadRecuentosRUEGPS();
        variables.loadRecuentosRUEGPS(selectedMpioEst);
        variables.loadRecuentosRUEManual(selectedMpioEst);
        // variables.updateRUEChecks(false, true);
    }

    const handleChange1 = (evt) => {
        // console.log(evt);
        // si el evento es investigacion 
        if (evt.ID_INVESTIGACION != undefined && evt.length == undefined) {
            console.log("UNOA");
            // console.log(activePanel)
            if (activePanel == "geo") {
                console.log("DOSA");
                // console.log("eventos")
                variables.estadosFiltrosDos.selectedInvGeo = evt;
                setSelectedInvGeo(evt);
                variables.changeHeader(evt, "1")
                variables.querysDos(evt.ID_INVESTIGACION, selectedDptoGeo.cod_dane, selectedMpioGeo.cod_dane, selectedClaseGeo.value, "geo")
            } else {
                console.log("TRESA");
                updateDateSet(0, 1);
                variables.estadosFiltrosDos.selectedInvEst = evt;
                setSelectedInvEst(evt)
                const filtreInv = (variables.investigaciones["filtroCuatro"]).filter((o) => (o.COD_ENC) == evt.ID_INVESTIGACION)
                    .map((filteredResult, index) => {
                        return ((filteredResult.DANE).substring(0, 2))
                    })
                const filtreDpto = dptoGeo.filter((o) => filtreInv.indexOf(o.cod_dane) != -1)
                // console.log(filtreDpto)
                variables.estadosFiltrosDos.dptoEst = filtreDpto;
                setDptoEst(filtreDpto)
                // variables.updateRUEChecks(false, false);
                variables.changeHeader(variables.estadosFiltrosDos.selectedInvEst, "2")
            }
        } else {
            // console.log(activePanel)
            //si es o no es una capa geografica (dpto , mpio, clase, c poblado)
            if ((evt.cod_dane) == undefined) {
                console.log("DOS");
                if (activePanel == "geo") {
                    console.log("UNOB");
                    //si es o no un filtro con atrr data-info (dpto , mpio, clase, c poblado)
                    if (evt["data-info"] == undefined && evt.length == undefined) {
                        if (evt.value != "2") {
                            console.log("DOSB");
                            updateDateSet(1, 3);
                            const filtroTres = clase.filter((o) => (o.cod_dane).indexOf(selectedMpioGeo.cod_dane + evt.value) != -1)
                            variables.estadosFiltrosDos.selectedClaseGeo = evt;
                            setSelectedClaseGeo(evt)
                            variables.changeHeader(evt, "");
                            let bbox = filtroTres[0].bextent
                            bboxExtent(bbox)
                        }
                        const filteredOptio = (variables.investigaciones["filtroCuatro"]).filter((o) => (o.DANE) == selectedMpioGeo.cod_dane + evt.value)
                            .map((filteredResult, index) => {
                                return (filteredResult.COD_ENC)
                            })
                        // console.log(filteredOptio)
                        // console.log(investigacionesEst)
                        const filtroCuatro = (variables.investigaciones["filtroTres"]).filter((o) => filteredOptio.indexOf(o.ID_INVESTIGACION) != -1)
                        variables.estadosFiltrosDos.investigacionesGeo = filtroCuatro;
                        setInvestigacionesGeo(filtroCuatro)
                    } else {
                        console.log("CINCOF");
                        if (evt.length > 0) {
                            console.log(evt);
                            let anomesDos = evt.sort((a, b) => (a.value > b.value) ? -1 : 1)
                            // console.log("año filtro", anomesDos[0]["value"])
                            variables.mgnWms(anomesDos[0]["value"])
                            updateDateSet(1, 6)
                            console.log("SEISF");
                            variables.estadosFiltrosDos.selectedPeriodoGeo = evt;
                            // console.log(evt)
                            setSelectedPeriodoGeo(evt)
                            // setSeguimientoRUE(false)
                            // for (let i = 0; i < evt.length; i++) {
                            //     // console.log(evt[i])
                            //     if (parseInt(evt[i].value) >= 202008) {
                            //         setSeguimientoRUE(true)
                            //         break
                            //     }
                            // }
                            variables.changeHeader("", variables.estadosFiltrosDos.selectedPeriodoGeo)
                            stylosMapa(0, 0, 0, 0, 0, true)
                        }
                        if (evt["data-info"] == "segmento") {
                            updateDateSet(1, 7)
                            console.log("SIETEF");
                            variables.estadosFiltrosDos.selectedSegmentoGeo = evt;
                            setSelectedSegmentoGeo(evt)
                            let coordMzn = (evt.data.PCOOR_MANZ).split(",")
                            variables.map.getView().setCenter(transform([coordMzn[1], coordMzn[0]], 'EPSG:4326', 'EPSG:3857'))
                            variables.map.getView().setZoom(18)
                            variables.pintarManzanaCyan("cod_ag-" + evt.data.P11);

                        }
                        if (evt["data-info"] == "mes") {
                            console.log("OCHOB");
                        }
                        if (evt["data-info"] == "cDane") {
                            variables.estadosFiltrosDos.selectedMznGeo = evt;
                            setSelectedMznGeo(evt)
                            let coordMzn = (evt.data.PCOOR_MANZ).split(",")
                            variables.map.getView().setCenter(transform([coordMzn[1], coordMzn[0]], 'EPSG:4326', 'EPSG:3857'))
                            variables.map.getView().setZoom(18)
                            variables.pintarManzanaCyan("manz_ccnct-" + (evt.data.CDANE).substring(0, 22));

                        }
                    }
                } else {
                    console.log("TRESB");
                    //si es o no un filtro con atrr data-info (segmento , etapa)
                    if (evt["data-info"] == undefined && evt.length == undefined) {
                        updateDateSet(0, 4)
                        console.log("CUATROB");
                        if (evt.value != "2") {
                            const filtroTres = clase.filter((o) => (o.cod_dane).indexOf(selectedMpioEst.cod_dane + evt.value) != -1)
                            let bbox = filtroTres[0].bextent
                            bboxExtent(bbox)
                        }
                        variables.changeHeader(evt, "")
                        variables.estadosFiltrosDos.selectedClaseEst = evt;
                        // console.log(evt);
                        setSelectedClaseEst(evt);
                        variables.querysDos(selectedInvEst.ID_INVESTIGACION, selectedDptoEst.cod_dane, selectedMpioEst.cod_dane, evt.value, "est")
                    } else {
                        console.log("CINCOB");
                        if (evt.length > 0) {
                            console.log(evt);
                            let anomesDos = evt.sort((a, b) => (a.value > b.value) ? -1 : 1)
                            console.log("año filtro", anomesDos[0]["value"])
                            variables.mgnWms(anomesDos[0]["value"])
                            updateDateSet(0, 6)
                            console.log("SEISB");
                            variables.estadosFiltrosDos.selectedPeriodoEst = evt;
                            setSelectedPeriodoEst(evt);
                            variables.changeHeader("", variables.estadosFiltrosDos.selectedPeriodoEst);
                            stylosMapa(0, 0, 0, 0, 0, true);
                        }
                        if (evt["data-info"] == "segmento") {
                            updateDateSet(0, 7)
                            console.log("SIETEB");
                            variables.estadosFiltrosDos.selectedSegmentoEst = evt;
                            setSelectedSegmentoEst(evt)
                            let coordMzn = (evt.data.PCOOR_MANZ).split(",")
                            variables.map.getView().setCenter(transform([coordMzn[1], coordMzn[0]], 'EPSG:4326', 'EPSG:3857'))
                            variables.map.getView().setZoom(18)
                            variables.pintarManzanaCyan("cod_ag-" + evt.data.P11);
                        }
                        if (evt["data-info"] == "mes") {
                            console.log("OCHOB");
                        }
                        if (evt["data-info"] == "cDane") {
                            // console.log("cDane");
                            variables.estadosFiltrosDos.selectedMznEst = evt;
                            setSelectedMznEst(evt)
                            let coordMzn = (evt.data.PCOOR_MANZ).split(",")
                            variables.map.getView().setCenter(transform([coordMzn[1], coordMzn[0]], 'EPSG:4326', 'EPSG:3857'))
                            variables.map.getView().setZoom(18)
                            variables.pintarManzanaCyan("manz_ccnct-" + (evt.data.CDANE).substring(0, 22));
                        }
                    }
                }
            } else {
                console.log("UNOC");
                let tipoDato = (evt.cod_dane).length
                let cantidad = (tipoDato == 2 ? [0, 5] : [5, 6])
                if (activePanel == "geo") {
                    // updateDateSet(0, 2)
                    console.log("DOSC");
                    const filteredOptio = (variables.investigaciones["filtroCuatro"]).filter((o) => (o.DANE).substring(0, tipoDato) == evt.cod_dane)
                        .map((filteredResult, index) => {
                            return (filteredResult.DANE).substring(cantidad[0], cantidad[1])
                        })
                    // console.log(filteredOptio)
                    if ((evt.cod_dane).length === 2) {
                        console.log("TRESC");
                        updateDateSet(1, 1);
                        const filteredOptions = mpios.filter((o) => (o.cod_dane).substring(0, tipoDato) == evt.cod_dane && filteredOptio.indexOf(o.cod_dane) != -1)
                        // console.log(filteredOptions)
                        variables.estadosFiltrosDos.selectedDptoGeo = evt;
                        setSelectedDptoGeo(evt);
                        // variables.updateRUEChecks(false, false);
                        variables.estadosFiltrosDos.mpioGeo = filteredOptions;
                        setMpioGeo(filteredOptions)
                        variables.changeHeader(variables.estadosFiltrosDos.selectedDptoGeo, "1")
                    } else {
                        updateDateSet(1, 2);
                        console.log("CUATROC");
                        const filtroDos = clases.filter((o) => filteredOptio.indexOf(o.value) != -1)
                        // console.log(filtroDos)
                        variables.estadosFiltrosDos.selectedMpioGeo = evt;
                        setSelectedMpioGeo(evt)
                        variables.estadosFiltrosDos.claseGeo = filtroDos;
                        setSeguimientoRUE(true)
                        setClaseGeo(filtroDos)
                        variables.changeHeader(variables.estadosFiltrosDos.selectedMpioGeo, "")
                    }
                } else {
                    console.log("UNOD");
                    const filteredOptio = (variables.investigaciones["filtroCuatro"]).filter((o) => (o.DANE).substring(0, tipoDato) == evt.cod_dane && (o.COD_ENC) == selectedInvEst.ID_INVESTIGACION)
                        .map((filteredResult, index) => {
                            return (filteredResult.DANE).substring(cantidad[0], cantidad[1])
                        })
                    // console.log(filteredOptio);
                    if ((evt.cod_dane).length === 2) {
                        console.log("DOSD");
                        updateDateSet(0, 2)
                        const filteredOptions = mpios.filter((o) => (o.cod_dane).substring(0, tipoDato) == evt.cod_dane && filteredOptio.indexOf(o.cod_dane) != -1)
                        // console.log(filteredOptions)
                        variables.estadosFiltrosDos.selectedDptoEst = evt;
                        setSelectedDptoEst(evt);
                        // variables.updateRUEChecks(false, false);
                        variables.estadosFiltrosDos.mpioEst = filteredOptions;
                        setMpioEst(filteredOptions);
                        setSeguimientoRUE(true)
                        variables.changeHeader(variables.estadosFiltrosDos.selectedDptoEst, "2")
                    } else {
                        console.log("TRESD");
                        updateDateSet(0, 3)
                        const filtroDos = clases.filter((o) => filteredOptio.indexOf(o.value) != -1)
                        variables.estadosFiltrosDos.selectedMpioEst = evt;
                        // console.log(evt)
                        // console.log(filtroDos)
                        setSelectedMpioEst(evt);
                        setSeguimientoRUE(true)
                        variables.estadosFiltrosDos.claseEst = filtroDos;
                        setClaseEst(filtroDos);
                        variables.changeHeader(variables.estadosFiltrosDos.selectedMpioEst, "")
                    }
                }
                // console.log(evt);
                let bbox = evt.bextent
                bboxExtent(bbox)
            }
        }
    };

    variables.querysDos = function (invest, dpto, mpio, clase, tipo, inicial) {
        variables.changeLoader(true);
        let leyenda = []
        if (inicial == undefined) {
            variables.pintarInvestigacion(invest, dpto, mpio, clase, leyenda);
        }
        if ((invest == '101' || invest == '45') && variables.oes != undefined) {
            console.log(variables.activePanel);
            if (variables.activePanel == "est") {
                variables.loadRecuentosRUEGPS(variables.estadosFiltrosDos.selectedMpioEst, invest);
                variables.loadRecuentosRUEManual(variables.estadosFiltrosDos.selectedMpioEst, invest);
            } else {
                variables.loadRecuentosRUEGPS(variables.estadosFiltrosDos.selectedMpioGeo, invest);
                variables.loadRecuentosRUEManual(variables.estadosFiltrosDos.selectedMpioGeo, invest);
            }
            let uri = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/recuentos/servicios/esperados.php?codigo_municipio=" + mpio;
            servidorQuery(uri).then(function (response) {
                variables.responseThree = response.data.resultado
                variables.pintarManzana(invest, mpio)

                let arrayPintada = {
                    '#008500': [0, 'Manz con UContadas sin UE'],
                    '#32cb32': [0, 'UC > 100% UE'],
                    '#CAFF00': [0, 'UC entre 75-100% UE'],
                    '#ffeab2': [0, 'UC entre 50-75% UE'],
                    '#FF7100': [0, 'UC entre 25-50% UE'],
                    '#ff2208': [0, 'UC < 25% UE'],
                    '#f0bcff': [0, 'Sin información'],
                }
                Object.values(variables.responseThree).map(function (obj, i, array) {
                    let esperado = obj.ESPERADOS;
                    let porcentaje = obj.PORCENTAJE;
                    if (esperado == 0) {
                        arrayPintada['#008500'][0] = arrayPintada['#008500'][0] + 1;
                    } else if (porcentaje > 100) {
                        arrayPintada['#32cb32'][0] = arrayPintada['#32cb32'][0] + 1;
                    }
                    else if (porcentaje >= 75 && porcentaje <= 100) {
                        arrayPintada['#CAFF00'][0] = arrayPintada['#CAFF00'][0] + 1;
                    }
                    else if (porcentaje >= 50 && porcentaje <= 75) {
                        arrayPintada['#ffeab2'][0] = arrayPintada['#ffeab2'][0] + 1;
                    }
                    else if (porcentaje >= 25 && porcentaje <= 50) {
                        arrayPintada['#FF7100'][0] = arrayPintada['#FF7100'][0] + 1;
                    }
                    else if (porcentaje < 25) {
                        arrayPintada['#ff2208'][0] = arrayPintada['#ff2208'][0] + 1;
                    } else {
                        arrayPintada['#f0bcff'][0] = arrayPintada['#f0bcff'][0] + 1;
                        console.log("uno")
                    }
                }, [])
                console.log(arrayPintada);
                variables.changeChart(arrayPintada);
            });
            variables.mgnWms("2018")
            variables.updateRUEChecks(true, true);
        } else {
            let one = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/ptoencuesta.php?dpto=" + dpto + "&mpio=" + mpio.substring(2, 5) + "&investi=" + invest + "&tipo=recuentos";
            let two = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/ptoencuesta.php?dpto=" + dpto + "&mpio=" + mpio.substring(2, 5) + "&investi=" + invest + "&tipo=Encuestas";
            let three = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/manzanasColores.php?cdane=" + mpio;
            // let three = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/esperados_rec.php?mpio=" + mpio;
            const requestOne = axios.get(one);
            const requestTwo = axios.get(two);
            let querys = [requestOne, requestTwo]
            if (invest == '45') {
                const requestThree = axios.get(three);
                querys = [requestOne, requestTwo, requestThree]
            }

            // const requestThree = axios.get(three);
            axios.all(querys).then(axios.spread((...responses) => {
                variables.responseOne = responses[0]
                variables.responseTwo = responses[1]
                if (invest == '45') {

                    variables.responseThree = responses[2].data.respuesta
                    let arrayPintada = {}
                    Object.values(variables.legengMznTres).map(function (obj, i, array) {
                        arrayPintada[obj[0]] = [0, obj[2]]
                    }, [])
                    console.log(arrayPintada)
                    Object.values(variables.responseThree).map(function (obj, i, array) {
                        let color = Object.keys(arrayPintada)[parseInt(obj.COLOR_VISOR) - 1]
                        arrayPintada[color][0] = arrayPintada[color][0] + 1
                    }, [])
                    console.log(arrayPintada)
                    variables.changeChart(arrayPintada);

                    // console.log(responses[2].data.respuesta)
                    // console.log(responses[0].data.viviendas)
                    // let jvv = responses[2].data.respuesta;
                    // let jvvuno = responses[0].data.viviendas;
                    // console.log(jvv)
                    // let arrayPintada = {
                    //     '#008500': [0, 'Manz con UContadas sin UE'],
                    //     '#32cb32': [0, 'UC > 100% UE'],
                    //     '#CAFF00': [0, 'UC entre 75-100% UE'],
                    //     '#ffeab2': [0, 'UC entre 50-75% UE'],
                    //     '#FF7100': [0, 'UC entre 25-50% UE'],
                    //     '#ff2208': [0, 'UC < 25% UE'],
                    //     '#f0bcff': [0, 'Sin información'],
                    // }
                    // let pintarManzana = {};
                    // Object.keys(jvvuno).map(function (obj, i, array) {
                    //     // console.log(jvvuno[obj] / jvv[obj]["VIV_CNPV_2018"], jvv[obj]["VIV_CNPV_2018"], jvvuno[obj]);
                    //     let esperado = parseInt(jvv[obj]["VIV_CNPV_2018"]);
                    //     let porcentaje = Number((parseInt(jvvuno[obj]) / parseInt(jvv[obj]["VIV_CNPV_2018"]))*100).toFixed(1);
                    //     let totales= jvvuno[obj];
                    //     pintarManzana[obj] = {
                    //         "COD_DANE": obj,
                    //         "ESPERADOS": esperado,
                    //         "PORCENTAJE": porcentaje,
                    //         "UNIDADES": totales
                    //     }
                    //     if (esperado == 0) {
                    //         arrayPintada['#008500'][0] = arrayPintada['#008500'][0] + 1;
                    //     } else if (porcentaje > 100) {
                    //         arrayPintada['#32cb32'][0] = arrayPintada['#32cb32'][0] + 1;
                    //     }
                    //     else if (porcentaje >= 75 && porcentaje <= 100) {
                    //         arrayPintada['#CAFF00'][0] = arrayPintada['#CAFF00'][0] + 1;
                    //     }
                    //     else if (porcentaje >= 50 && porcentaje <= 75) {
                    //         arrayPintada['#ffeab2'][0] = arrayPintada['#ffeab2'][0] + 1;
                    //     }
                    //     else if (porcentaje >= 25 && porcentaje <= 50) {
                    //         arrayPintada['#FF7100'][0] = arrayPintada['#FF7100'][0] + 1;
                    //     }
                    //     else if (porcentaje < 25) {
                    //         arrayPintada['#ff2208'][0] = arrayPintada['#ff2208'][0] + 1;
                    //     } else {
                    //         arrayPintada['#f0bcff'][0] = arrayPintada['#f0bcff'][0] + 1;
                    //     }
                    // }, [])
                    // console.log(arrayPintada);
                    // variables.responseThree = pintarManzana
                    stylosMapa(invest, dpto, mpio, clase, tipo, undefined);
                    // variables.changeChart(arrayPintada);
                } else {
                    variables.updateAcoordiones(false);
                    stylosMapa(invest, dpto, mpio, clase, tipo, undefined);
                }



                // console.log(variables.responseThree)

                // if ((responses[2].data.respuesta).length > 0) {
                //     variables.responseThree = groupByFunct(responses[2].data.respuesta, "CDANE")
                // } else {
                //     variables.responseThree = {}
                // }
                if (clase == "2") {
                    let centrosP = centros.filter((o) => (o.cod_dane).substring(0, 5) == mpio);
                    // console.log(centrosP)
                    if (tipo = "est") {
                        setCpobladoEst(centrosP)

                    } else {
                        setSelectedCpobladoGeo(centrosP)
                    }
                }
                console.log("llegaron los datos");
                // console.log(extent);
                // console.log(response);
                // use/access the results 
            })).catch(errors => {
                // react on errors.
            })
        }
    }

    const dataSelect = [
        [
            [investigacionesEst, "ID_INVESTIGACION", "INVESTIGACION", selectedInvEst, 1, false],
            [dptoEst, "cod_dane", "name", selectedDptoEst, 1, false],
            [mpioEst, "cod_dane", "name", selectedMpioEst, 1, false],
            [claseEst, "value", "label", selectedClaseEst, 1, false],
            [cpobladoEst, "cod_dane", "name", selectedCpobladoEst, 1, false],
            [periodoEst, "value", "label", selectedPeriodoEst, 2, true],
            [segmentoEst, "value", "label", selectedSegmentoEst, 2, false],
            [mznEst, "value", "label", selectedMznEst, 2, false],
            ["Operación Estadística", "Departamento", "Municipio", "Clase", "Centro Poblado", "Año", "Área geográfica", "Manzana"]
        ],
        [
            [dptoGeo, "cod_dane", "name", selectedDptoGeo, 1, false],
            [mpioGeo, "cod_dane", "name", selectedMpioGeo, 1, false],
            [claseGeo, "value", "label", selectedClaseGeo, 1, false],
            [investigacionesGeo, "ID_INVESTIGACION", "INVESTIGACION", selectedInvGeo, 1, false],
            [cpobladoGeo, "cod_dane", "name", selectedCpobladoGeo, 1, false],
            [periodoGeo, "value", "label", selectedPeriodoGeo, 2, true],
            [segmentoGeo, "value", "label", selectedSegmentoGeo, 2, false],
            [mznGeo, "value", "label", selectedMznGeo, 2, false],
            ["Departamento", "Municipio", "Clase", "Operación Estadística", "Centro Poblado", "Año", "Área geográfica", "Manzana"]
        ]
    ]

    const selectsList =
        (subgrupo) => {
            // console.log(subgrupo);
            // console.log(dptoGeo, "cod_dane", "name");
            return (
                (dataSelect[subgrupo][8])
                    .map((select, index) => {
                        // console.log(filteredResult.CATEGORIA, termDos)
                        // console.log(filteredResult)
                        // console.log((dataSelect[subgrupo][index][0]), (dataSelect[subgrupo][index][3]))
                        let selectData = "form-field-name " + index;
                        return (
                            <div className="toolbar__secondPanelContent" key={index}>
                                {(dataSelect[subgrupo][index][0]).length > 0 && <div className="selectBox" key={index}>
                                    <p className="selectBox__name">{select}</p>
                                    <Select
                                        styles={{
                                            navBar: provided => ({ zIndex: 9999, position: absolute })
                                        }}
                                        isMulti={dataSelect[subgrupo][index][5]}
                                        id={selectData}
                                        name={selectData}
                                        value={(dataSelect[subgrupo][index][3])}
                                        onChange={handleChange1}
                                        className="select2-container"
                                        options={dataSelect[subgrupo][index][0]}
                                        // isClearable={true}
                                        getOptionValue={(option) => option[dataSelect[subgrupo][index][1]]}
                                        // getOptionLabel={(option) => option[dataSelect[subgrupo][index][1]] + " - " + option[dataSelect[subgrupo][index][2]]}
                                        getOptionLabel={(option) => dataSelect[subgrupo][index][4] === 1 ?
                                            option[dataSelect[subgrupo][index][1]] + " - " + option[dataSelect[subgrupo][index][2]] :
                                            option[dataSelect[subgrupo][index][1]]
                                        }
                                    />
                                </div>}
                            </div>
                        )
                    })
            );
        }

    const handleClickPanel = (evt) => {
        let target = evt.currentTarget.id;
        if (target == "upload__est") {
            setActivePanel("est");
            variables.activePanel = "est";
            setInactivePanel("geo");
        } else if (target == "upload__geo") {
            setActivePanel("geo");
            variables.activePanel = "geo";
            setInactivePanel("est");
        }
    }

    return (
        <div className="tools__panel">
            {/* <div className="toolbar__secondPanelContent"> */}
            {/* <h3 className="toolBar__container__panel__functionBox__title"> Filtrar </h3> */}
            <p className="tools__text">Seleccione el tipo de búsqueda que desea realizar</p>
            {/* </div> */}
            <ul className="upload__list">
                <li className={activePanel === 'est' ? claseActiva : claseInactiva} id="upload__est" onClick={handleClickPanel} style={{ width: "100%" }}>
                    <p className="upload__item__name">Operación estadística</p>
                </li>
                <li className={activePanel === 'geo' ? claseActiva : claseInactiva} id="upload__geo" onClick={handleClickPanel} style={{ width: "100%" }}>
                    <p className="upload__item__name"> Búsqueda geográfica</p>
                </li>
            </ul>
            <div className={activePanel === 'est' ? claseActivaPanel : claseInactivaPanel} id="upload__est">
                {selectsList(0)}
            </div>
            <div className={activePanel === 'geo' ? claseActivaPanel : claseInactivaPanel} id="upload__geo">
                {selectsList(1)}
            </div>
        </div>
    );
}

export default FilterDos;
