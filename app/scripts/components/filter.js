// CONFIGURACION FILTRO DE BUSQUEDA GEOGRAFICA Y POR OPERACION 

import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import municipios from '../../json/mpio-extent.json'
import departamentos from '../../json/dpto-extent.json';
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
/*
const Selects = (props) {
    return (
        (props.dataSelect[subgrupo][(dataSelect[subgrupo]).length - 1])
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
*/
const Filter = (props) => {
    /*
    useEffect(() => {
        cargaInicial();
    },[]);
    */
   
            // console.log("params ",variables.oes);
            // console.log("params ",variables.mpio);
            //let one = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/recuentos/servicios/oe_transmision.php?ce=si"; //filtro 1 no va
            //let two = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/recuentos/servicios/oe_transmision.php?ce=lista";
            // let one = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/investigacion_clases.php?encuesta=true";
            // let two = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/investigacion_clases.php?encuesta=true&datos=true";
            //const requestOne = axios.get(one);
            //const requestTwo = axios.get(two);
            // const requestThree = axios.get(three);
           
            
            // const consulta = axios({ method: "GET", url: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/investigacion_clases.php" });
            // consulta.then(function (response) {
            //     variables.investigaciones["filtroUno"] = response.data.resultadoUno;
            //     variables.investigaciones["filtroDos"] = response.data.resultadoDos;
            //     variables.estadosFiltros.investigacionesEst = response.data.resultadoUno;
            //     setInvestigacionesEst(response.data.resultadoUno);
            //     cargaInicial();
            // });
        
        // const consultaAPI = async () => {
        //     const consulta = axios({ method: "GET", url: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/investigacion_clases.php" });
        //     consulta.then(function (response) {
        //         variables.investigaciones["filtroUno"] = response.data.resultadoUno;
        //         variables.investigaciones["filtroDos"] = response.data.resultadoDos;
        //         variables.estadosFiltros.investigacionesEst = response.data.resultadoUno;
        //         setInvestigacionesEst(response.data.resultadoUno);
        //         cargaInicial();
        //     });
        // }
 
    
    

    //option dataset
    const dptoGeo = departamentos
    const mpios = municipios
    const clases = [
        { value: '1', label: '1. Cabecera' },
        { value: '2', label: '2. Centro Poblado' },
        { value: '3', label: '3. Rural Disperso' }
    ]
    //botones 
    // let claseActiva = "upload__item --active";
    // let claseInactiva = "upload__item";
    // let claseActivaPanel = "upload__panel --active";
    // let claseInactivaPanel = "upload__panel";
    // const [activePanel, setActivePanel] = useState(variables.activePanel);
    // const [inactivePanel, setInactivePanel] = useState("geo");

    //estados de los values de los selects est
    
    const [selectedDptoEst, setSelectedDptoEst] = useState(variables.estadosFiltros.selectedDptoEst);
    const [selectedMpioEst, setSelectedMpioEst] = useState(variables.estadosFiltros.selectedMpioEst);
    const [selectedClaseEst, setSelectedClaseEst] = useState(variables.estadosFiltros.selectedClaseEst);
    const [selectedCpobladoEst, setSelectedCpobladoEst] = useState(variables.estadosFiltros.selectedCpobladoEst);
    const [selectedPeriodoEst, setSelectedPeriodoEst] = useState(variables.estadosFiltros.selectedPeriodoEst);
    const [selectedSegmentoEst, setSelectedSegmentoEst] = useState(variables.estadosFiltros.selectedSegmentoEst);
    const [selectedMznEst, setSelectedMznEst] = useState(variables.estadosFiltros.selectedMznEst);
    const [selectedSectUrbEst, setSelectedSectUrbEst] = useState(variables.estadosFiltros.selectedSectUrbEst);
    const [selectedSeccUrbEst, setSelectedSeccUrbEst] = useState(variables.estadosFiltros.selectedSeccUrbEst);
    const [selectedSectRurEst, setSelectedSectRurEst] = useState(variables.estadosFiltros.selectedSectRurEst);
    const [selectedSeccRurEst, setSelectedSeccRurEst] = useState(variables.estadosFiltros.selectedSeccRurEst);
    //estados de los selects est
    const [investigacionesEst, setInvestigacionesEst] = useState(variables.estadosFiltros.investigacionesEst);
    const [dptoEst, setDptoEst] = useState(variables.estadosFiltros.dptoEst);
    const [mpioEst, setMpioEst] = useState(variables.estadosFiltros.mpioEst);
    const [claseEst, setClaseEst] = useState(variables.estadosFiltros.claseEst);
    const [cpobladoEst, setCpobladoEst] = useState(variables.estadosFiltros.cpobladoEst);
    const [periodoEst, setPeriodoEst] = useState(variables.estadosFiltros.periodoEst);
    const [segmentoEst, setSegmentoEst] = useState(variables.estadosFiltros.segmentoEst);
    const [mznEst, setMznEst] = useState(variables.estadosFiltros.mznEst);
    const [sectUrbEst, setSectUrbEst] = useState(variables.estadosFiltros.sectUrbEst);
    const [seccUrbEst, setSeccUrbEst] = useState(variables.estadosFiltros.seccUrbEst);
    const [sectRurEst, setSectRurEst] = useState(variables.estadosFiltros.sectRurEst);
    const [seccRurEst, setSeccRurEst] = useState(variables.estadosFiltros.seccRurEst);
    //estados de los selects geo
    const [selectedDptoGeo, setSelectedDptoGeo] = useState(variables.estadosFiltros.selectedDptoGeo);
    const [selectedMpioGeo, setSelectedMpioGeo] = useState(variables.estadosFiltros.selectedMpioGeo);
    const [selectedClaseGeo, setSelectedClaseGeo] = useState(variables.estadosFiltros.selectedClaseGeo);
    const [selectedCpobladoGeo, setSelectedCpobladoGeo] = useState(variables.estadosFiltros.selectedCpobladoGeo);
    const [selectedInvGeo, setSelectedInvGeo] = useState(variables.estadosFiltros.selectedInvGeo);
    const [selectedPeriodoGeo, setSelectedPeriodoGeo] = useState(variables.estadosFiltros.selectedPeriodoGeo);
    const [selectedSegmentoGeo, setSelectedSegmentoGeo] = useState(variables.estadosFiltros.selectedSegmentoGeo);
    const [selectedMznGeo, setSelectedMznGeo] = useState(variables.estadosFiltros.selectedMznGeo);
    const [selectedSectUrbGeo, setSelectedSectUrbGeo] = useState(variables.estadosFiltros.selectedSectUrbGeo);
    const [selectedSeccUrbGeo, setSelectedSeccUrbGeo] = useState(variables.estadosFiltros.selectedSeccUrbGeo);
    const [selectedSectRurGeo, setSelectedSectRurGeo] = useState(variables.estadosFiltros.selectedSectRurGeo);
    const [selectedSeccRurGeo, setSelectedSeccRurGeo] = useState(variables.estadosFiltros.selectedSeccRurGeo);
    //estados de los values de los selects geo
    const [mpioGeo, setMpioGeo] = useState(variables.estadosFiltros.mpioGeo);
    const [claseGeo, setClaseGeo] = useState(variables.estadosFiltros.claseGeo);
    const [investigacionesGeo, setInvestigacionesGeo] = useState(variables.estadosFiltros.investigacionesGeo);
    const [cpobladoGeo, setCpobladoGeo] = useState(variables.estadosFiltros.cpobladoGeo);
    const [periodoGeo, setPeriodoGeo] = useState(variables.estadosFiltros.periodoGeo);
    const [segmentoGeo, setSegmentoGeo] = useState(variables.estadosFiltros.segmentoGeo);
    const [mznGeo, setMznGeo] = useState(variables.estadosFiltros.mznGeo);
    const [sectUrbGeo, setSectUrbGeo] = useState(variables.estadosFiltros.sectUrbGeo);
    const [seccUrbGeo, setSeccUrbGeo] = useState(variables.estadosFiltros.seccUrbGeo);
    const [sectRurGeo, setSectRurGeo] = useState(variables.estadosFiltros.sectRurGeo);
    const [seccRurGeo, setSeccRurGeo] = useState(variables.estadosFiltros.seccRurGeo);
    //estado para controlar la visualización del botón de seguimiento RUE
    const [seguimientoRUE, setSeguimientoRUE] = useState(true);



    //function carga inicial
    /*
    function cargaInicial() {
        //carga investigaciones
    

        //carga dpto
        // const filtreInv = (variables.investigaciones["filtroDos"]).filter((o) => (o.COD_ENC) == variables.cargaInicial[0].ID_INVESTIGACION)
        //     .map((filteredResult, index) => {
        //         return ((filteredResult.DANE).substring(0, 2))
        //     })
        variables.estadosFiltros.dptoEst = dptoGeo;
        setDptoEst(variables.estadosFiltros.dptoEst);
        variables.estadosFiltros.selectedDptoEst = variables.cargaInicial[1]
        setSelectedDptoEst(variables.cargaInicial[1]);

        
        const filteredOptions = mpios //.filter((o) => (o.cod_dane).substring(0, 2) == variables.cargaInicial[1].cod_dane)
        variables.estadosFiltros.mpioEst = filteredOptions
        setMpioEst(variables.estadosFiltros.mpioEst);
        variables.estadosFiltros.selectedMpioEst = variables.cargaInicial[2]
        setSelectedMpioEst(variables.cargaInicial[2]);

        //carga clase
        
        const filtroDos = clases
        variables.estadosFiltros.claseEst = filtroDos
        setClaseEst(variables.estadosFiltros.claseEst);
        variables.estadosFiltros.selectedClaseEst = variables.cargaInicial[3]
        setSelectedClaseEst(variables.cargaInicial[3]);

        //bbox y consulta
        variables.changeHeader(variables.cargaInicial[0], "")
        variables.changeHeader(variables.cargaInicial[2], "")
        variables.changeHeader(variables.cargaInicial[3], "")
        const extentInit = clase.filter((o) => o.cod_dane == [variables.cargaInicial[2]["cod_dane"] + variables.cargaInicial[3]["value"]])
        console.log(extentInit[0].bextent)
        let bbox = extentInit[0].bextent;
        bboxExtent(bbox);
        // variables.pintarInvestigacion(variables.cargaInicial[0]["ID_INVESTIGACION"], variables.cargaInicial[1]["cod_dane"], variables.cargaInicial[2]["cod_dane"], variables.cargaInicial[3]["value"], []);

        //variables.querySave = variables.cargaInicial[0]["ID_INVESTIGACION"] + "-" + variables.cargaInicial[1]["cod_dane"] + "-" + variables.cargaInicial[2]["cod_dane"]
        console.log(variables.cargaInicial[2]["cod_dane"])
        variables.querys(variables.cargaInicial[2]["cod_dane"]);
        loadBboxAndData('URB_SECTOR')
    }
    */

    // variables.estadosFiltros.dptoEst = dptoGeo;
    // variables.estadosFiltros.selectedDptoEst = variables.cargaInicial[1]
    
    // const filteredOptions = mpios.filter((o) => (o.cod_dane).substring(0, 2) == variables.cargaInicial[1].cod_dane)
    // variables.estadosFiltros.mpioEst = filteredOptions
    // variables.estadosFiltros.selectedMpioEst = variables.cargaInicial[2]

    // const filtroDos = clases
    // variables.estadosFiltros.claseEst = filtroDos
    // variables.estadosFiltros.selectedClaseEst = variables.cargaInicial[3]

    // const extentInit = clase.filter((o) => o.cod_dane == [variables.cargaInicial[2]["cod_dane"] + variables.cargaInicial[3]["value"]])
    

    function updateDateSet(index, values) {
        console.log("si entro esto");

        console.log(index, values)
        if (index === 0) {
            if (values <= 1) {
                variables.estadosFiltros.selectedDptoEst = 0;
                setSelectedDptoEst(null);
                variables.estadosFiltros.dptoEst = [];
                setDptoEst(variables.estadosFiltros.dptoEst);
            }
            if (values <= 2) {
                variables.estadosFiltros.selectedMpioEst = 0;
                setSelectedMpioEst(null);
                variables.estadosFiltros.mpioEst = [];
                setMpioEst(variables.estadosFiltros.mpioEst);
            }
            if (values <= 3) {
                variables.estadosFiltros.selectedClaseEst = 0;
                setSelectedClaseEst(null);
                variables.estadosFiltros.claseEst = [];
                setClaseEst(variables.estadosFiltros.claseEst);
            }
            if (values <= 3) {
                variables.estadosFiltros.selectedcpobladoEst = 0;
                setSelectedCpobladoEst(null);
                variables.estadosFiltros.cpobladoEst = [];
                setCpobladoEst(variables.estadosFiltros.cpobladoEst);

                variables.estadosFiltros.selectedSectUrbEst = 0;
                setSelectedSectUrbEst(null);
                variables.estadosFiltros.sectUrbEst = [];
                setSectUrbEst(variables.estadosFiltros.sectUrbEst);
                variables.estadosFiltros.selectedSeccUrbEst = 0;
                setSelectedSeccUrbEst(null);
                variables.estadosFiltros.seccUrbEst = [];
                setSeccUrbEst(variables.estadosFiltros.seccUrbEst);
                variables.estadosFiltros.selectedSectRurEst = 0;
                setSelectedSectRurEst(null);
                variables.estadosFiltros.sectRurEst = [];
                setSectUrbEst(variables.estadosFiltros.sectRurEst);
                variables.estadosFiltros.selectedSeccRurEst = 0;
                setSelectedSeccRurEst(null);
                variables.estadosFiltros.seccRurEst = [];
                setSeccRurEst(variables.estadosFiltros.seccRurEst);
            }
            if (values <= 5) {
                variables.estadosFiltros.selectedPeriodoEst = 0;
                setSelectedPeriodoEst(null);
                variables.estadosFiltros.periodoEst = [];
                setPeriodoEst(variables.estadosFiltros.periodoEst);
                // console.log(periodoEst);
            }
            if (values <= 6) {
                variables.estadosFiltros.selectedSegmentoEst = 0;
                setSelectedSegmentoEst(null);
                variables.estadosFiltros.segmentoEst = [];
                setSegmentoEst(variables.estadosFiltros.segmentoEst);
            }
            if (values <= 7) {
                variables.estadosFiltros.selectedMznEst = 0;
                setSelectedMznEst(null);
                variables.estadosFiltros.mznEst = [];
                setMznEst(variables.estadosFiltros.mznEst);
            }
        } else {
            if (values <= 1) {
                variables.estadosFiltros.selectedMpioGeo = 0;
                setSelectedMpioGeo(null);
                variables.estadosFiltros.mpioGeo = [];
                setMpioGeo(variables.estadosFiltros.mpioGeo);
            }
            if (values <= 2) {
                variables.estadosFiltros.selectedClaseGeo = 0;
                setSelectedClaseGeo(null);
                variables.estadosFiltros.claseGeo = [];
                setClaseGeo(variables.estadosFiltros.claseGeo);
            }
            if (values <= 3) {
                variables.estadosFiltros.selectedInvGeo = 0;
                setSelectedInvGeo(null);
                variables.estadosFiltros.setInvestigacionesGeo = [];
                setInvestigacionesGeo(variables.estadosFiltros.setInvestigacionesGeo);
            }
            if (values <= 3) {
                variables.estadosFiltros.selectedcpobladoGeo = 0;
                setSelectedCpobladoGeo(null);
                variables.estadosFiltros.cpobladoGeo = [];
                setCpobladoGeo(variables.estadosFiltros.cpobladoGeo);

                variables.estadosFiltros.selectedSectUrbGeo = 0;
                setSelectedSectUrbGeo(null);
                variables.estadosFiltros.sectUrbGeo = [];
                setSectUrbGeo(variables.estadosFiltros.sectUrbGeo);
                variables.estadosFiltros.selectedSeccUrbGeo = 0;
                setSelectedSeccUrbGeo(null);
                variables.estadosFiltros.seccUrbGeo = [];
                setSeccUrbGeo(variables.estadosFiltros.seccUrbGeo);
                variables.estadosFiltros.selectedSectRurGeo = 0;
                setSelectedSectRurGeo(null);
                variables.estadosFiltros.sectRurGeo = [];
                setSectRurGeo(variables.estadosFiltros.sectRurGeo);
                variables.estadosFiltros.selectedSeccRurGeo = 0;
                setSelectedSeccRurGeo(null);
                variables.estadosFiltros.seccRurGeo = [];
                setSeccRurGeo(variables.estadosFiltros.seccRurGeo);
            }
            if (values <= 5) {
                variables.estadosFiltros.selectedPeriodoGeo = 0;
                setSelectedPeriodoGeo(null);
                variables.estadosFiltros.periodoGeo = [];
                setPeriodoGeo(variables.estadosFiltros.periodoGeo);
            }
            if (values <= 6) {
                variables.estadosFiltros.selectedSegmentoGeo = 0;
                setSelectedSegmentoGeo(null);
                variables.estadosFiltros.segmentoGeo = [];
                setSegmentoGeo(variables.estadosFiltros.segmentoGeo);
            }
            if (values <= 7) {
                variables.estadosFiltros.selectedMznGeo = 0;
                setSelectedMznGeo(null);
                variables.estadosFiltros.mznGeo = [];
                setMznGeo(variables.estadosFiltros.mznGeo);
            }
        }
    }

    function stylosMapa(mpio, tipo, change) {
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
                variables.estadosFiltros.periodoEst = anomesDos;
                setPeriodoEst(anomesDos);
                // console.log(anomesDos)
                variables.estadosFiltros.selectedPeriodoEst = anomesDos[0];
                // console.log(parseInt(anomesDos[0].value));
                // if (parseInt(anomesDos[0].value) >= 202008) {
                //     setSeguimientoRUE(true)
                // }
                setSelectedPeriodoEst(anomesDos[0]);
                variables.estadosFiltros.segmentoEst = segmentoDos;
                setSegmentoEst(segmentoDos);
                variables.estadosFiltros.mznEst = codDaneDos;
                setMznEst(codDaneDos);
                // console.log(anomesDos[0]);
            } else {
                variables.estadosFiltros.periodoGeo = anomesDos;
                setPeriodoGeo(anomesDos);
                // console.log(anomesDos)
                variables.estadosFiltros.selectedPeriodoGeo = anomesDos[0];
                // console.log(parseInt(anomesDos[0].value));
                // console.log(anomesDos[0]);
                // if (parseInt(anomesDos[0].value) >= 202008) {
                //     setSeguimientoRUE(true)
                // }
                setSelectedPeriodoGeo(anomesDos[0]);
                variables.estadosFiltros.segmentoGeo = segmentoDos;
                setSegmentoGeo(segmentoDos);
                variables.estadosFiltros.mznGeo = codDaneDos;
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
            //variables.changeHeader("", anomesDos[0])
            variables.changeLegend(leyenda);
            // variables.pintarInvestigacion(invest, dpto, mpio, clase, leyenda);
            // variables.anioSelect = [anomesDos[0]["value"]]
            // variables.pintarInvestigacion(0, 0, 0, 0, [1], "meses");
            // if (invest == '45') {
            variables.pintarManzana(mpio)
            // }
            updateCluster([anomesDos[0]["value"]])

            // variables.changeLoader(false);


            // }
        } else {
            let selectedPeriodoEstTemp;
            
            selectedPeriodoEstTemp = variables.estadosFiltros.selectedPeriodoEst;
            
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
        
            variables.estadosFiltros.segmentoEst = segmentoDos;
                // console.log(segmentoDos);
            setSegmentoEst(segmentoDos);
            setMznEst(segmentoDos);
            
            // console.log("anomes ", variables.anomes)
            // console.log("anioSelect ", variables.anioSelect)
            let anomesDos = Object.keys(variables.anomes).map((item, index) => {
                return ({ "value": item, "label": item, "data": variables.anomes[item], "data-info": "anomes" })
            }, [])
            let leyenda = anomesDos.map(function (obj, i, array) {
                return [obj.value, variables.colores[i]]
            }, [])
            variables.changeLegend(leyenda);
            // variables.pintarInvestigacion(invest, dpto, mpio, clase, leyenda, (selectedPeriodoEstTemp).value);
            // variables.pintarInvestigacion(0, 0, 0, 0, [1], "meses");
            updateCluster(segmentosVal)

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
            
                console.log("TRESA");
                updateDateSet(0, 1);
                variables.estadosFiltros.selectedInvEst = evt;
                // console.log("este ",variables.estadosFiltros.selectedInvEst)
                // if (variables.estadosFiltros.selectedInvEst == "45") {
                //     variables.updateAcoordiones(true)
                // } else {
                //     variables.updateAcoordiones(false)
                // }
                Object.keys(variables.capas).map((item, index) => {
                    if (variables.capas[item] != undefined) {
                        variables.capas[item].setVisible(false)
                        console.log(item, variables.capas[item].getVisible());
                    }
                }, [])
                // setSelectedInvEst(evt)
                // const filtreInv = (variables.investigaciones["filtroDos"]).filter((o) => (o.COD_ENC) == evt.ID_INVESTIGACION)
                //     .map((filteredResult, index) => {
                //         return ((filteredResult.DANE).substring(0, 2))
                //     })
                // const filtreDpto = dptoGeo.filter((o) => filtreInv.indexOf(o.cod_dane) != -1)
                // // console.log(filtreDpto)
                // variables.estadosFiltros.dptoEst = filtreDpto;
                setDptoEst(filtreDpto)
                // // variables.updateRUEChecks(false, false);
                //variables.changeHeader(variables.estadosFiltros.selectedInvEst, "2")
            
        } else {
            // console.log(activePanel)
            //si es o no es una capa geografica (dpto , mpio, clase, c poblado)
            if ((evt.cod_dane) == undefined) {
                console.log("DOS");
                /*
                if (activePanel == "geo") {
                    console.log("UNOB");
                    //si es o no un filtro con atrr data-info (dpto , mpio, clase, c poblado)
                    if (evt["data-info"] == undefined && evt.length == undefined) {
                        if (evt.value != "2") {
                            console.log("DOSB");
                            updateDateSet(1, 3);
                            const filtroTres = clase.filter((o) => (o.cod_dane).indexOf(selectedMpioGeo.cod_dane + evt.value) != -1)
                            variables.estadosFiltros.selectedClaseGeo = evt;
                            setSelectedClaseGeo(evt)
                            variables.changeHeader(evt, "");
                            let bbox = filtroTres[0].bextent
                            bboxExtent(bbox)
                        }
                        // const filteredOptio = (variables.investigaciones["filtroDos"]).filter((o) => (o.DANE) == selectedMpioGeo.cod_dane + evt.value)
                        //     .map((filteredResult, index) => {
                        //         return (filteredResult.COD_ENC)
                        //     })
                        // console.log(filteredOptio)
                        // console.log(investigacionesEst)
                        //const filtroCuatro = (variables.investigaciones["filtroUno"]).filter((o) => filteredOptio.indexOf(o.ID_INVESTIGACION) != -1)
                        variables.estadosFiltros.investigacionesGeo = filtroCuatro;
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
                            variables.estadosFiltros.selectedPeriodoGeo = evt;
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
                            variables.changeHeader("", variables.estadosFiltros.selectedPeriodoGeo)
                            stylosMapa(0, 0, 0, 0, 0, true)
                        }
                        if (evt["data-info"] == "segmento") {
                            updateDateSet(1, 7)
                            console.log("SIETEF");
                            variables.estadosFiltros.selectedSegmentoGeo = evt;
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
                            variables.estadosFiltros.selectedMznGeo = evt;
                            setSelectedMznGeo(evt)
                            let coordMzn = (evt.data.PCOOR_MANZ).split(",")
                            variables.map.getView().setCenter(transform([coordMzn[1], coordMzn[0]], 'EPSG:4326', 'EPSG:3857'))
                            variables.map.getView().setZoom(18)
                            variables.pintarManzanaCyan("manz_ccnct-" + (evt.data.CDANE).substring(0, 22));

                        }
                    }
                } 
                */
                
                
                    console.log("TRESB");
                    //si es o no un filtro con atrr data-info (segmento , etapa)
                    if (evt["data-info"] == undefined && evt.length == undefined) {
                        console.log("CUATROB");
                        //variables.changeHeader(evt, "")
                        variables.estadosFiltros.selectedClaseEst = evt;
                        setSelectedClaseEst(evt);

                        variables.estadosFiltros.selectedSectRurEst = 0;
                        setSelectedSectRurEst(null);
                        variables.estadosFiltros.sectRurEst = [];
                        setSectRurEst(variables.estadosFiltros.sectRurEst);

                        variables.estadosFiltros.selectedSeccRurEst = 0;
                        setSelectedSeccRurEst(null);
                        variables.estadosFiltros.seccRurEst = [];
                        setSeccRurEst(variables.estadosFiltros.seccRurEst);

                        variables.estadosFiltros.selectedSectUrbEst = 0;
                        setSelectedSectUrbEst(null);
                        variables.estadosFiltros.sectUrbEst = [];
                        setSectUrbEst(variables.estadosFiltros.sectUrbEst);

                        variables.estadosFiltros.selectedSeccUrbEst = 0;
                        setSelectedSeccUrbEst(null);
                        variables.estadosFiltros.seccUrbEst = [];
                        setSeccUrbEst(variables.estadosFiltros.seccUrbEst);

                        if (evt.value != "2") {
                            const filtroTres = clase.filter((o) => (o.cod_dane).indexOf(selectedMpioEst.cod_dane + evt.value) != -1)
                            let bbox = filtroTres[0].bextent
                            bboxExtent(bbox)
                            variables.estadosFiltros.selectedCpobladoEst = 0;
                            setSelectedCpobladoEst(null);
                            variables.estadosFiltros.cpobladoEst = [];
                            setCpobladoEst(variables.estadosFiltros.cpobladoEst);
                            if (evt.value != "1") {
                                loadBboxAndData('RUR_SECTOR')
                            } else {
                                loadBboxAndData('URB_SECTOR')
                            }
                        }

                        if (evt.value == "2") {
                            let centrosP = centros.filter((o) => (o.cod_dane).substring(0, 5) == selectedMpioEst.cod_dane);
                            setCpobladoEst(centrosP)
                        }

                        
                    } else {
                        console.log("CINCOB");
                        if (evt.length > 0) {
                            console.log(evt);
                            let anomesDos = evt.sort((a, b) => (a.value > b.value) ? -1 : 1)
                            console.log("año filtro", anomesDos[0]["value"])
                            variables.mgnWms(anomesDos[0]["value"])
                            updateDateSet(0, 6)
                            console.log("SEISB");
                            variables.estadosFiltros.selectedPeriodoEst = evt;
                            setSelectedPeriodoEst(evt);
                            variables.changeHeader("", variables.estadosFiltros.selectedPeriodoEst);
                            stylosMapa(0, 0, 0, 0, 0, true);
                        }
                        if (evt["data-info"] == "segmento") {
                            updateDateSet(0, 7)
                            console.log("SIETEB");
                            variables.estadosFiltros.selectedSegmentoEst = evt;
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
                            variables.estadosFiltros.selectedMznEst = evt;
                            setSelectedMznEst(evt)
                            let coordMzn = (evt.data.PCOOR_MANZ).split(",")
                            variables.map.getView().setCenter(transform([coordMzn[1], coordMzn[0]], 'EPSG:4326', 'EPSG:3857'))
                            variables.map.getView().setZoom(18)
                            variables.pintarManzanaCyan("manz_ccnct-" + (evt.data.CDANE).substring(0, 22));
                        }
                        if (evt["data-info"] == "RUR_SECTOR") {
                            variables.estadosFiltros.selectedSectRurEst = evt;
                            setSelectedSectRurEst(evt);
                            variables.estadosFiltros.selectedSeccRurEst = 0;
                            setSelectedSeccRurEst(null);
                            loadBboxAndData('RUR_SECCION')
                        }
                        if (evt["data-info"] == "URB_SECTOR") {
                            variables.estadosFiltros.selectedSectUrbEst = evt;
                            setSelectedSectUrbEst(evt);
                            variables.estadosFiltros.selectedSeccUrbEst = 0;
                            setSelectedSeccUrbEst(null);
                            loadBboxAndData('URB_SECCION', evt.value)
                        }
                        if (evt["data-info"] == "RUR_SECCION") {
                            variables.estadosFiltros.selectedSeccRurEst = evt;
                            setSelectedSeccRurEst(evt);
                            loadBboxAndData('ZOOM_RUR_SECCION')
                        }
                        if (evt["data-info"] == "URB_SECCION") {
                            variables.estadosFiltros.selectedSeccUrbEst = evt;
                            setSelectedSeccUrbEst(evt);
                            variables.estadosFiltros.selectedMznEst = 0;
                            setSelectedMznEst(null);
                            loadBboxAndData('URB_MANZANA', evt.value)
                        }
                        if (evt["data-info"] == "URB_MANZANA") {
                            variables.estadosFiltros.selectedMznEst = evt;
                            setSelectedMznEst(evt);
                            loadBboxAndData('ZOOM_UC', evt.value); //ZOOM_URB_SECCION
                        }
                    }
                
            } else {
                console.log("UNOC");
                let tipoDato = (evt.cod_dane).length
                let cantidad = (tipoDato == 2 ? [0, 5] : [5, 6])
                /*
                if (activePanel == "geo") {
                    // updateDateSet(0, 2)
                    console.log("DOSC");
                    // const filteredOptio = (variables.investigaciones["filtroDos"]).filter((o) => (o.DANE).substring(0, tipoDato) == evt.cod_dane)
                    //     .map((filteredResult, index) => {
                    //         return (filteredResult.DANE).substring(cantidad[0], cantidad[1])
                    //     })
                    // console.log(filteredOptio)
                    if ((evt.cod_dane).length === 2) {
                        console.log("TRESC");
                        updateDateSet(1, 1);
                        const filteredOptions = mpios.filter((o) => (o.cod_dane).substring(0, tipoDato) == evt.cod_dane && filteredOptio.indexOf(o.cod_dane) != -1)
                        // console.log(filteredOptions)
                        variables.estadosFiltros.selectedDptoGeo = evt;
                        setSelectedDptoGeo(evt);
                        // variables.updateRUEChecks(false, false);
                        variables.estadosFiltros.mpioGeo = filteredOptions;
                        setMpioGeo(filteredOptions)
                        variables.changeHeader(variables.estadosFiltros.selectedDptoGeo, "1")
                    } else {
                        updateDateSet(1, 2);
                        console.log("CUATROC");
                        const filtroDos = clases.filter((o) => filteredOptio.indexOf(o.value) != -1)
                        // console.log(filtroDos)
                        variables.estadosFiltros.selectedMpioGeo = evt;
                        setSelectedMpioGeo(evt)
                        variables.estadosFiltros.claseGeo = filtroDos;
                        setSeguimientoRUE(true)
                        setClaseGeo(filtroDos)
                        variables.changeHeader(variables.estadosFiltros.selectedMpioGeo, "")
                    }
                } 
                */
                
                
                    console.log("UNOD");
                    //yeiner
                    // const filteredOptio = (variables.investigaciones["filtroDos"]).filter((o) => (o.DANE).substring(0, tipoDato) == evt.cod_dane && (o.COD_ENC) == selectedInvEst.ID_INVESTIGACION)
                    //     .map((filteredResult, index) => {
                    //         return (filteredResult.DANE).substring(cantidad[0], cantidad[1])
                    //     })
                    // console.log(filteredOptio);
                    if ((evt.cod_dane).length === 2) {
                        variables.changeLocation (`${evt.cod_dane} - ${evt.name}`,"");
                        console.log("DOSD");
                        updateDateSet(0, 2)
                        const filteredOptions = mpios.filter((o) => (o.cod_dane).substring(0, tipoDato) == evt.cod_dane)
                        // console.log(filteredOptions)
                        variables.estadosFiltros.selectedDptoEst = evt;
                        setSelectedDptoEst(evt);
                        // variables.updateRUEChecks(false, false);
                        variables.estadosFiltros.mpioEst = filteredOptions;
                        setMpioEst(filteredOptions);
        
                        //variables.changeHeader(variables.estadosFiltros.selectedDptoEst, "2") este depronto si
                    } else {
                        console.log("TRESD");
                        if ((evt.ref).indexOf("Municipio") != -1) {
                            updateDateSet(0, 3)
                            const filtroDos = clases;
                            variables.estadosFiltros.selectedMpioEst = evt;
                            variables.changeLocation ("",`${evt.cod_dane} - ${evt.name}`);
                            console.log(evt)
                            console.log(filtroDos)
                            setSelectedMpioEst(evt);
                            variables.querys(evt.cod_dane);
                            variables.estadosFiltros.claseEst = filtroDos;
                            setClaseEst(filtroDos);
                            //variables.changeHeader(variables.estadosFiltros.selectedMpioEst, "")
                        } else {
                            variables.estadosFiltros.selectedCpobladoEst = evt;
                            setSelectedCpobladoEst(evt);

                            variables.estadosFiltros.selectedSectUrbEst = 0;
                            setSelectedSectUrbEst(null);
                            variables.estadosFiltros.sectUrbEst = [];
                            setSectUrbEst(variables.estadosFiltros.sectUrbEst);

                            variables.estadosFiltros.selectedSeccUrbEst = 0;
                            setSelectedSeccUrbEst(null);
                            variables.estadosFiltros.seccUrbEst = [];
                            setSeccUrbEst(variables.estadosFiltros.seccUrbEst);
                            loadBboxAndData("URB_SECTOR")
                        }
                    }
                
                // console.log(evt);
                let bbox = evt.bextent
                bboxExtent(bbox)
            }
        }
    };

    //funcion bbox
    function loadBboxAndData(tipo) { // 'RUR_SECTOR'
        console.log(variables.estadosFiltros.selectedMpioEst.cod_dane);
        console.log(variables.estadosFiltros.selectedClaseEst.value);
        console.log(variables.estadosFiltros.selectedCpobladoEst.cod_dane);//3
        console.log(variables.estadosFiltros.selectedSectUrbEst);//4
        console.log(variables.estadosFiltros.selectedSeccUrbEst);//2
        console.log(variables.estadosFiltros.selectedSectRurEst);//3
        console.log(variables.estadosFiltros.selectedSeccRurEst);//2

        let tempMpio = variables.estadosFiltros.selectedMpioEst.cod_dane
        let tempClase = variables.estadosFiltros.selectedClaseEst.value
        let tempCpoblado = variables.estadosFiltros.selectedCpobladoEst.cod_dane//3
        let tempSectUrb = variables.estadosFiltros.selectedSectUrbEst.value//4
        let tempSeccUrb = variables.estadosFiltros.selectedSeccUrbEst.value//2
        let tempSectRur = variables.estadosFiltros.selectedSectRurEst.value//3
        let tempSeccRur = variables.estadosFiltros.selectedSeccRurEst.value//2
        let tempUC = variables.estadosFiltros.selectedMznEst.value;

        let busqueda, numero, bBox = false, query = true;
        switch (tipo) {
            case 'RUR_SECTOR':
                numero = 0
                busqueda = tempMpio.substring(0, 2) + "-" + tempMpio.substring(2, 5) + "-" + tempClase
                console.log('RUR_SECTOR ' + busqueda);
                break;
            case 'RUR_SECCION':
                numero = 1
                busqueda = tempMpio + tempClase + tempSectRur
                bBox = true
                console.log('RUR_SECCION ' + busqueda);
                break;
            case 'ZOOM_RUR_SECCION':
                numero = 1
                busqueda = tempMpio + tempClase + tempSectRur + tempSeccRur
                bBox = false;
                query = false;
                console.log('RUR_SECCION ' + busqueda);
                break;
            case 'URB_SECTOR':
                numero = 2
                if (tempCpoblado != undefined) {
                    busqueda = tempMpio.substring(0, 2) + "-" + tempMpio + "-" + tempCpoblado
                } else {
                    busqueda = tempMpio.substring(0, 2) + "-" + tempMpio.substring(2, 5)  + "-" + tempClase;
                }
                console.log('URB_SECTOR ' + busqueda);
                break;
            case 'URB_SECCION':
                numero = 3
                if (tempCpoblado != undefined) {
                    busqueda = tempMpio + "-" + tempCpoblado.substring(5) + tempSectUrb
                } else {
                    busqueda = tempMpio.substring(0, 2) + "-" + tempMpio.substring(2, 5)  + "-" + tempClase + "-" + tempSectUrb;
                }
                bBox = true
                console.log('URB_SECCION ' + busqueda);
                break;
            /*
            case 'ZOOM_URB_SECCION':
                numero = 3
                if (tempCpoblado != undefined) {
                    busqueda = tempMpio + "-" + tempCpoblado.substring(5) + tempSectUrb + tempSeccUrb
                } else {
                    busqueda = tempMpio.substring(0, 2) + "-" + tempMpio.substring(2, 5)  + "-" + tempClase + "-" + tempSectUrb + "-" + tempSeccUrb;
                }
                bBox = false;
                query = false;
                console.log('URB_SECCION ' + busqueda);
                break;
            */
            case 'ZOOM_UC':
                numero = 4
                if (tempCpoblado != undefined) {
                    busqueda = tempMpio + "-" + tempCpoblado.substring(5) + tempSectUrb + tempSeccUrb
                } else {
                    busqueda = tempMpio.substring(0, 2) + "-" + tempMpio.substring(2, 5)  + "-" + tempClase + "-" + tempSectUrb + "-" + tempSeccUrb + "-" + tempUC;
                }
                bBox = false;
                query = false;
                console.log('UC ' + busqueda);
                break;
            case 'URB_MANZANA':
                numero = 4
                if (tempCpoblado != undefined) {
                    busqueda = tempMpio + "-" + tempCpoblado.substring(5) + tempSectUrb
                } else {
                    busqueda = tempMpio.substring(0, 2) + "-" + tempMpio.substring(2, 5)  + "-" + tempClase + "-" + tempSectUrb + "-" + tempSeccUrb;
                }
                bBox = true
                console.log('URB_MANZANA ' + busqueda);
                break;
            default:
                console.log('Lo lamentamos, por el momento no disponemos de ' + expr + '.');
        }

        console.log(!bBox, query);
        let querys;
        if (bBox && query) {
            let urlTemas;
            let urlTemasDos;
            if (numero == 3) {
                urlTemas = "https://geoportal.dane.gov.co/ceexp/censoexperimental/ao";
                urlTemas += `/${tempMpio.substring(0, 2)}/${tempMpio.substring(2, 5)}/${tempClase}/${tempSectUrb}`;
                urlTemasDos = "https://geoportal.dane.gov.co/ceexp/censoexperimental/bboxPostgis";
                urlTemasDos += '?tabla=uc';
            } else if (numero == 4) {
                urlTemas = "https://geoportal.dane.gov.co/ceexp/censoexperimental/uc";
                urlTemas += `/${tempMpio.substring(0, 2)}/${tempMpio.substring(2, 5)}/${tempClase}/${tempSectUrb}/${tempSeccUrb}`;
                urlTemasDos = "https://geoportal.dane.gov.co/ceexp/censoexperimental/bboxPostgis";
                urlTemasDos += '?tabla=uc';
            }else {
                urlTemas = 'https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/bboxPostgis.php';
                urlTemas += '?tabla=' + variables.consultas[numero][0];
                urlTemas += '&campos=' + variables.consultas[numero][1];
                urlTemas += '&valores=' + busqueda;
                urlTemas += '&columna=' + variables.consultas[numero][2];  
                urlTemasDos = 'https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/bboxPostgis.php';
                urlTemasDos += '?tabla=' + variables.consultas[numero - 1][0];
            }
            urlTemasDos += '&campos=' + variables.consultas[numero - 1][3];
            urlTemasDos += '&valores=' + busqueda;
            const requestOne = axios.get(urlTemas);
            const requestTwo = axios.get(urlTemasDos);
            querys = [requestOne, requestTwo]
        } else if (query) {
            let urlTemas;
            if (numero == 2) {
                urlTemas = "https://geoportal.dane.gov.co/ceexp/censoexperimental/co";
                urlTemas += `/${tempMpio.substring(0, 2)}/${tempMpio.substring(2, 5)}/${tempClase}`;
            } else {
                urlTemas = 'https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/bboxPostgis.php';
                urlTemas += '?tabla=' + variables.consultas[numero][0];
                urlTemas += '&campos=' + variables.consultas[numero][1];
                urlTemas += '&valores=' + busqueda;
                urlTemas += '&columna=' + variables.consultas[numero][2];
            }             
            const requestOne = axios.get(urlTemas);
            querys = [requestOne]
        } else if (bBox == false && query == false) {
            let urlTemasDos;
            if (numero == 4) {
                urlTemasDos = "https://geoportal.dane.gov.co/ceexp/censoexperimental/bboxPostgis";
                urlTemasDos += '?tabla=uc';
            } else {
                urlTemasDos = 'https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/bboxPostgis.php';
                urlTemasDos += '?tabla=' + variables.consultas[numero][0];
            }            
            urlTemasDos += '&campos=' + variables.consultas[numero][3];
            urlTemasDos += '&valores=' + busqueda;
            const requestOne = axios.get(urlTemasDos);
            querys = [requestOne]
        }
        // console.log(urlTemasDos)
        axios.all(querys).then(axios.spread((...responses) => {
            console.log(responses[0])
            if (query) {
                let resultado = (responses[0].data.resultado).map((item, index) => {
                    return ({ "value": item[variables.consultas[numero][2]], "label": item[variables.consultas[numero][2]], "data-info": tipo, })
                }, [])
                console.log(resultado)
                switch (tipo) {
                    case 'RUR_SECTOR':
                        variables.estadosFiltros.sectRurEst = resultado;
                        setSectRurEst(resultado)
                        break;
                    case 'RUR_SECCION':
                        variables.estadosFiltros.seccRurEst = resultado;
                        setSeccRurEst(resultado)
                        break;
                    case 'URB_SECTOR':
                        variables.estadosFiltros.sectUrbEst = resultado;
                        setSectUrbEst(resultado)
                        break;
                    case 'URB_SECCION':
                        variables.estadosFiltros.seccUrbEst = resultado;
                        setSeccUrbEst(resultado)
                        break;
                    case 'URB_MANZANA':
                        variables.estadosFiltros.mznEst = resultado;
                        setMznEst(resultado);
                        //console.log('URB_MANZANA ' + busqueda);
                        break;
                    default:
                        console.log('Lo lamentamos, por el momento no disponemos de ' + expr + '.');
                }
            } else {
                bboxExtent(responses[0].data.resultado[0]["bextent"])
            }
            if (bBox) {
                // console.log(responses[1].data.resultado[0]["bextent"])
                bboxExtent(responses[1].data.resultado[0]["bextent"])
            }
        })).catch(errors => {
            // react on errors.
        })
    }

    /*
    variables.querys = function (mpio) {
        variables.changeLoader(true);
        let leyenda = []
        // if (inicial == undefined) {
        //     variables.pintarInvestigacion(invest, dpto, mpio, clase, leyenda);
        // }
        // if ((invest == '101' || invest == '45') && variables.oes != undefined) {
        
        variables.loadRecuentosRUEGPS(variables.estadosFiltros.selectedMpioEst);
        //variables.loadRecuentosRUEManual(variables.estadosFiltros.selectedMpioEst);
      
      
        let uri = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/censo_economico_exp/servicios/esperados.php?codigo_municipio=" + mpio;
        servidorQuery(uri).then(function (response) {
            if (response.data.estado) {
                variables.responseThree = response.data.resultado
                if (Object.values(variables.responseThree).length > 0) {
                    variables.pintarManzana(mpio);
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
                }
            }
        });
        //variables.mgnWms("2018")
        variables.updateRUEChecks(true, true);
        // } else {
        //     let one = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/ptoencuesta.php?dpto=" + dpto + "&mpio=" + mpio.substring(2, 5) + "&investi=" + invest + "&tipo=recuentos";
        //     let two = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/ptoencuesta.php?dpto=" + dpto + "&mpio=" + mpio.substring(2, 5) + "&investi=" + invest + "&tipo=Encuestas";
        //     let three = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/manzanasColores.php?cdane=" + mpio;
        //     // let three = "https://geoportal.dane.gov.co/laboratorio/serviciosjson/operativo_eh/esperados_rec.php?mpio=" + mpio;
        //     const requestOne = axios.get(one);
        //     const requestTwo = axios.get(two);
        //     let querys = [requestOne, requestTwo]
        //     if (invest == '45') {
        //         const requestThree = axios.get(three);
        //         querys = [requestOne, requestTwo, requestThree]
        //     }

        //     // const requestThree = axios.get(three);
        //     axios.all(querys).then(axios.spread((...responses) => {
        //         variables.responseOne = responses[0]
        //         variables.responseTwo = responses[1]
        //         if (invest == '45') {

        //             variables.responseThree = responses[2].data.respuesta
        //             let arrayPintada = {}
        //             Object.values(variables.legengMznTres).map(function (obj, i, array) {
        //                 arrayPintada[obj[0]] = [0, obj[2]]
        //             }, [])
        //             console.log(arrayPintada)
        //             Object.values(variables.responseThree).map(function (obj, i, array) {
        //                 let color = Object.keys(arrayPintada)[parseInt(obj.COLOR_VISOR) - 1]
        //                 arrayPintada[color][0] = arrayPintada[color][0] + 1
        //             }, [])
        //             console.log(arrayPintada)
        //             variables.changeChart(arrayPintada);

        //             // console.log(responses[2].data.respuesta)
        //             // console.log(responses[0].data.viviendas)
        //             // let jvv = responses[2].data.respuesta;
        //             // let jvvuno = responses[0].data.viviendas;
        //             // console.log(jvv)
        //             // let arrayPintada = {
        //             //     '#008500': [0, 'Manz con UContadas sin UE'],
        //             //     '#32cb32': [0, 'UC > 100% UE'],
        //             //     '#CAFF00': [0, 'UC entre 75-100% UE'],
        //             //     '#ffeab2': [0, 'UC entre 50-75% UE'],
        //             //     '#FF7100': [0, 'UC entre 25-50% UE'],
        //             //     '#ff2208': [0, 'UC < 25% UE'],
        //             //     '#f0bcff': [0, 'Sin información'],
        //             // }
        //             // let pintarManzana = {};
        //             // Object.keys(jvvuno).map(function (obj, i, array) {
        //             //     // console.log(jvvuno[obj] / jvv[obj]["VIV_CNPV_2018"], jvv[obj]["VIV_CNPV_2018"], jvvuno[obj]);
        //             //     let esperado = parseInt(jvv[obj]["VIV_CNPV_2018"]);
        //             //     let porcentaje = Number((parseInt(jvvuno[obj]) / parseInt(jvv[obj]["VIV_CNPV_2018"]))*100).toFixed(1);
        //             //     let totales= jvvuno[obj];
        //             //     pintarManzana[obj] = {
        //             //         "COD_DANE": obj,
        //             //         "ESPERADOS": esperado,
        //             //         "PORCENTAJE": porcentaje,
        //             //         "UNIDADES": totales
        //             //     }
        //             //     if (esperado == 0) {
        //             //         arrayPintada['#008500'][0] = arrayPintada['#008500'][0] + 1;
        //             //     } else if (porcentaje > 100) {
        //             //         arrayPintada['#32cb32'][0] = arrayPintada['#32cb32'][0] + 1;
        //             //     }
        //             //     else if (porcentaje >= 75 && porcentaje <= 100) {
        //             //         arrayPintada['#CAFF00'][0] = arrayPintada['#CAFF00'][0] + 1;
        //             //     }
        //             //     else if (porcentaje >= 50 && porcentaje <= 75) {
        //             //         arrayPintada['#ffeab2'][0] = arrayPintada['#ffeab2'][0] + 1;
        //             //     }
        //             //     else if (porcentaje >= 25 && porcentaje <= 50) {
        //             //         arrayPintada['#FF7100'][0] = arrayPintada['#FF7100'][0] + 1;
        //             //     }
        //             //     else if (porcentaje < 25) {
        //             //         arrayPintada['#ff2208'][0] = arrayPintada['#ff2208'][0] + 1;
        //             //     } else {
        //             //         arrayPintada['#f0bcff'][0] = arrayPintada['#f0bcff'][0] + 1;
        //             //     }
        //             // }, [])
        //             // console.log(arrayPintada);
        //             // variables.responseThree = pintarManzana
        //             // variables.changeChart(arrayPintada);
        //             variables.updateAcoordiones(true);
        //             stylosMapa(invest, dpto, mpio, clase, tipo, undefined);

        //         } else {
        //             variables.updateAcoordiones(false);
        //             stylosMapa(invest, dpto, mpio, clase, tipo, undefined);
        //         }
        //         // console.log(variables.responseThree)
        //         // if ((responses[2].data.respuesta).length > 0) {
        //         //     variables.responseThree = groupByFunct(responses[2].data.respuesta, "CDANE")
        //         // } else {
        //         //     variables.responseThree = {}
        //         // }
        //         console.log("llegaron los datos");
        //         // console.log(extent);
        //         // console.log(response);
        //         // use/access the results 
        //     })).catch(errors => {
        //         // react on errors.
        //     })
        // }
    }
    */

    const dataSelect = [
        [
            //[investigacionesEst, "ID_INVESTIGACION", "INVESTIGACION", selectedInvEst, 1, false],
            [dptoGeo, "cod_dane", "name", selectedDptoEst, 1, false],
            [mpioEst, "cod_dane", "name", selectedMpioEst, 1, false],
            [claseEst, "value", "label", selectedClaseEst, 1, false],
            [cpobladoEst, "cod_dane", "name", selectedCpobladoEst, 1, false],
            [sectUrbEst, "value", "label", selectedSectUrbEst, 1, false],
            [seccUrbEst, "value", "label", selectedSeccUrbEst, 1, false],
            [sectRurEst, "value", "label", selectedSectRurEst, 1, false],
            [seccRurEst, "value", "label", selectedSeccRurEst, 1, false],
            [periodoEst, "value", "label", selectedPeriodoEst, 2, true],
            [segmentoEst, "value", "label", selectedSegmentoEst, 2, false],
            [mznEst, "value", "label", selectedMznEst, 2, false],
            // ["Operación Estadística", "Departamento", "Municipio", "Clase", "Centro Poblado", "Año", "Área geográfica", "Manzana"]
            ["Departamento", "Municipio", "Clase", "Centro Poblado", "Coordinación Operativa", "Área Operativa", "Sector Rural", "Sección Rural", "Año", "Área geográfica", "Unidad de cobertura"]
        ],
        [
            [dptoGeo, "cod_dane", "name", selectedDptoGeo, 1, false],
            [mpioGeo, "cod_dane", "name", selectedMpioGeo, 1, false],
            [claseGeo, "value", "label", selectedClaseGeo, 1, false],
            [investigacionesGeo, "ID_INVESTIGACION", "INVESTIGACION", selectedInvGeo, 1, false],
            [cpobladoGeo, "cod_dane", "name", selectedCpobladoGeo, 1, false],
            [sectUrbGeo, "value", "label", selectedSectUrbGeo, 1, false],
            [seccUrbGeo, "value", "label", selectedSeccUrbGeo, 1, false],
            [sectRurGeo, "value", "label", selectedSectRurGeo, 1, false],
            [seccRurGeo, "value", "label", selectedSeccRurGeo, 1, false],
            [periodoGeo, "value", "label", selectedPeriodoGeo, 2, true],
            [segmentoGeo, "value", "label", selectedSegmentoGeo, 2, false],
            [mznGeo, "value", "label", selectedMznGeo, 2, false],
            // ["Departamento", "Municipio", "Clase", "Operación Estadística", "Centro Poblado", "Año", "Área geográfica", "Manzana"]
            ["Departamento", "Municipio", "Clase", "Recuentos", "Centro Poblado", "Sector Urbano", "Sección Urbana", "Sector Rural", "Sección Rural", "Año", "Área geográfica", "Manzana"]
        ]
    ]

    const selectsList =
        (subgrupo) => {
            // console.log(subgrupo);
            // console.log(dptoGeo, "cod_dane", "name");
            return (
                (dataSelect[subgrupo][(dataSelect[subgrupo]).length - 1])
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
            {/*<p className="tools__text">Seleccione el tipo de búsqueda que desea realizar</p>*/}
            {/* </div> */}
            {/*
            <ul className="upload__list">
                <li className={activePanel === 'est' ? claseActiva : claseInactiva} id="upload__est" onClick={handleClickPanel} style={{ width: "100%" }}>
                    {/* <p className="upload__item__name">Operación estadística</p> //falta cerrar
                    <p className="upload__item__name">Filtro</p>
                </li>
                <li className={activePanel === 'geo' ? claseActiva : claseInactiva} id="upload__geo" onClick={handleClickPanel} style={{ width: "100%" }}>
                    <p className="upload__item__name"> Búsqueda geográfica</p>
                </li>
            </ul>
            */}
            <div id="upload__est">
                {selectsList(0)}
            </div>
            {/*
            <div className={activePanel === 'geo' ? claseActivaPanel : claseInactivaPanel} id="upload__geo">
                {selectsList(1)}
            </div>
            */}
        </div>
    );
}

export default Filter;
