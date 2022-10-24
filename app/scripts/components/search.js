import React, { useState, useEffect } from "react";
import axios from "axios";
import municipios from '../../json/mpio-extent.json'
import departamentos from '../../json/dpto-extent.json'
import centros from '../../json/centros_poblados-extent.json'
import { boundingExtent } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import { variables } from '../base/variables';
import Accordion from './thematicFilter/subgroup';
import AccordionItem from './thematicFilter/category';
import NavButton from './thematicFilter/group';
import chroma from 'chroma-js';
import { scaleLinear } from "d3-scale";
import { Fragment } from "react";
import { toast } from 'react-toastify';

function bboxExtent(bbox) {
    bbox = bbox.replace('BOX(', '').replace(')', '')
    bbox = bbox.split(",")
    let bbox1 = bbox[0].split(" ")
    let bbox2 = bbox[1].split(" ")
    var ext = boundingExtent([[bbox1[0], bbox1[1]], [bbox2[0], bbox2[1]]]);
    ext = transformExtent(ext, 'EPSG:4326', 'EPSG:3857');
    variables.map.getView().fit(ext, variables.map.getSize());
}

function groupByFunct(array, key) {
    const groupBy = array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});
    return groupBy
}
// funcion para obtener gamma de colores 
function getColorArray(categoria) {
    var color = ["#1D3A6C", "#2D68AC", "#00699F", "#0088BC", "#44A8E0", "#4599C2", "#70B5D8", "#7AB2E1", "#9CCAED", "#B6D8F0"];
    var colorPrincipal = variables.tematica["CATEGORIAS"][categoria][0]['COLOR'];

    colorPrincipal = colorPrincipal.replace("(", "").replace(")", "");
    colorPrincipal = colorPrincipal.split(",");

    var colorMedium = chroma(colorPrincipal).get('hsl.l');
    var arrayColores = []
    var scaleUp = scaleLinear();
    var scaleDown = scaleLinear();

    // c(colorMedium)
    if (colorMedium > 1) {
        scaleDown.domain([0, 4]).range([1, colorMedium]);
        scaleUp.domain([0, 4]).range([colorMedium, 100]);
        arrayColores = [1, 0, 0, 0, colorMedium, 0, 0, 0, 100]
    }
    else {
        scaleDown.domain([0, 4]).range([0.15, colorMedium]);
        scaleUp.domain([0, 4]).range([colorMedium, 0.90]);
    }
    arrayColores = [scaleDown(0), scaleDown(1), scaleDown(2), scaleDown(3), colorMedium, scaleUp(1), scaleUp(2), scaleUp(3), scaleUp(4)];

    color = [chroma(colorPrincipal).set('hsl.l', arrayColores[0]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[1]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[2]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[3]).hex(), chroma(colorPrincipal).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[5]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[6]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[7]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[8]).hex()];
    return color;
}
const Search = ({ filterSearch, placeholder }) => {
    const [term, setTerm] = useState("");
    const [termDos, setTermDos] = useState("");
    const [btn, setBtn] = useState("321");
    const [tematica, setTematica] = useState(variables.tematica);
    const [btnDos, setBtnDos] = useState(variables.varVariable);
    const [visualList, setVisualList] = useState(true);

    variables.visualGroup = function (valor) {
        setVisualList(valor);
    }

    variables.changeTheme = function (nivel, dpto, campo, table) {

        if (nivel == "MNZN") {
            if (variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][dpto] != undefined) {

                variables.changeMap(nivel, dpto);
            } else {
                variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][dpto] = {};

                let urlData = variables.urlVariables + "?codigo_subgrupo=" + variables.varVariable.substring(0, 5) + "&nivel_geografico=" + nivel
                    + "&filtro_geografico=" + dpto
                if (campo != undefined) {
                    urlData += "&campo=" + campo
                }

                axios({ method: "GET", url: urlData })
                    .then(function (response) {
                        variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][dpto] = response.data.resultado
                        variables.queryText[variables.varVariable.substring(0, 5)] = response.data.consulta
                        variables.changeMap(nivel, dpto);
                    });
            }
            // }

        } else {

            if (variables.periodos === null) {
                getPeriodos(nivel, campo);
            }

            if (variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel] !== undefined) {

                if (!variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]) {
                    variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value] = [];
                }

                if (Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value]).length > 0) {

                    variables.changeMap(nivel, dpto, table);

                    if (nivel == "DPTO") {
                        if (variables.variableAnterior != null) {
                            if (variables.variableAnterior.substring(0, 5) != variables.varVariable.substring(0, 5)) {
                                if (variables.changePieChartData != null) {
                                    variables.changePieChartData(nivel, variables.deptoVariable);
                                }
                                if (variables.changeDonuChartData != null) {
                                    variables.changeDonuChartData(nivel, variables.deptoVariable);
                                }
                            }
                        }

                        if (variables.changeBarChartData != null) {
                            variables.changeBarChartData(nivel);
                            if (variables.deptoVariable != undefined) {
                                variables.changeBarChartData(nivel, variables.deptoVariable);
                            }
                        }
                        if (variables.changeGaugeChartData != null) {
                            variables.changeGaugeChartData(nivel);
                        }
                    } else if (nivel === "MPIO") {
                        if (variables.variableAnterior != null) {
                            if (variables.variableAnterior.substring(0, 5) != variables.varVariable.substring(0, 5)) {
                                if (variables.changePieChartData != null) {
                                    variables.changePieChartData("DPTO", variables.deptoVariable);
                                }
                                if (variables.changeDonuChartData != null) {
                                    variables.changeDonuChartData("DPTO", variables.deptoVariable);
                                }
                            }
                        }



                        if (variables.changeBarChartData != null) {
                            variables.changeBarChartData(nivel, variables.deptoVariable);
                            if (variables.deptoVariable != undefined) {
                                variables.changeBarChartData(nivel, variables.deptoVariable);
                            }
                        }
                        if (variables.changeGaugeChartData != null) {
                            variables.changeGaugeChartData(nivel, variables.deptoVariable);
                        }
                    }
                }
                else {
                    let urlData = variables.urlVariablesProductos + "?codigo_subgrupo=" + variables.varVariable.substring(0, 5)

                    if (variables.periodoSeleccionado) {
                        urlData += "&anio=" + variables.periodoSeleccionado.value
                    }

                    axios({ method: "GET", url: urlData })
                        .then(function (response) {
                            const jsonResult = JSON.parse(response.data.replace("Array", ""));
                            if (jsonResult) {
                                if (jsonResult.resultado.length === 0) {
                                    toast.warn("Para el periodo, producto y variable seleccionada, no hay datos. Intente cambiando la consulta.")
                                }
                            }

                            variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][variables.periodoSeleccionado.value] = JSON.parse(response.data.replace("Array", "")).resultado;
                            variables.changeMap(nivel, dpto, table);
                            if (variables.deptoSelected == undefined && variables.deptoVariable != undefined) {
                                variables.filterGeo("DPTO", variables.deptoVariable)
                            }
                            if (nivel == "DPTO") {
                                if (variables.changePieChartData != null) {
                                    variables.changePieChartData(nivel, '97');
                                    if (variables.deptoVariable != undefined) {
                                        variables.deptoVariable(nivel, variables.deptoVariable);
                                    }
                                }

                                if (variables.changeDonuChartData != null) {
                                    variables.changeDonuChartData(nivel, '97');
                                    if (variables.deptoVariable != undefined) {
                                        variables.changeDonuChartData(nivel, variables.deptoVariable);
                                    }
                                }
                                if (variables.changeBarChartData != null) {
                                    variables.changeBarChartData(nivel);
                                    if (variables.deptoVariable != undefined) {
                                        variables.changeBarChartData(nivel, variables.deptoVariable);
                                    }
                                }
                                if (variables.changeGaugeChartData != null) {
                                    variables.changeGaugeChartData(nivel);
                                }
                            } else if (nivel === "MPIO") {

                                if (variables.changeDonuChartData != null) {
                                    if (variables.deptoVariable != undefined) {
                                        variables.changeDonuChartData("DPTO", variables.deptoVariable);
                                    }
                                }
                            }
                        });
                }
            }
            // }


        }

    }

    const getPeriodos = (nivel, campo) => {
        let urlData = variables.urlVariables + "?codigo_subgrupo=" + variables.varVariable.substring(0, 5) + "&nivel_geografico=" + nivel
        if (campo != undefined) {
            urlData += "&campo=" + campo
        }

        let listaPeriodos = [];
        let periodos = [];
        axios({ method: "GET", url: urlData })
            .then(function (response) {
                Object.values(response.data.resultado).map((item) => {
                    listaPeriodos.push(item.G);
                })
                const result = Array.from(new Set(listaPeriodos));
                result.sort().reverse().map((res) => {
                    periodos.push({ value: res, label: res })
                })
                variables.periodos = periodos;
                variables.periodoSeleccionado = periodos[0];
                variables.updatePeriodoHeader(periodos[0]);
                variables.updatePeriodoTabla(periodos[0]);
                variables.updatePeriodoResult(periodos[0])
                variables.getProductosByPeriodo(nivel, campo, periodos[0].value)
            });
    }

    variables.getProductosByPeriodo = (nivel, campo, periodo) => {
        let urlData = variables.urlVariables + "?codigo_subgrupo=" + variables.varVariable.substring(0, 5) + "&nivel_geografico=" + nivel
        if (campo != undefined) {
            urlData += "&campo=" + campo
        }

        if (periodo !== undefined) {
            urlData += "&anio=" + periodo
        }

        let listaProductos = [];
        axios({ method: "GET", url: urlData })
            .then(function (response) {
                const datos = response.data.resultado;
                const unique = [...new Set(Object.values(datos).map(item => item.L))];
                unique.sort().map((item) => {
                    listaProductos.push({ value: item, label: item });
                })

                variables.updateListaProductos(listaProductos);
            });

    }

    useEffect(() => {
        const consultaAPI = async () => {

            if (Object.keys(variables.tematica).length == 0 || Object.keys(variables.coloresLeyend).length == 0) {
                const consulta = await axios({ method: "GET", url: variables.urlTemas + "?codigo=" + variables.codVisor });
                const consultaDos = await axios({ method: "GET", url: variables.urlTemas + "?codigo=" + variables.codVisor + "&sub_temas=yes" });
                const consultaTres = await axios({ method: "GET", url: variables.urlTemas + "?codigo=" + variables.codVisor + "&variables=yes" });

                const consultaUnoFin = groupByFunct(consulta.data, "COD_GRUPO")
                const consultaDosFin = groupByFunct(consultaDos.data, "COD_SUBGRUPO")
                const consultaTresFin = groupByFunct(consultaTres.data, "COD_CATEGORIA")

                Object.keys(consultaDosFin).map((subgrupo) => {
                    variables.dataArrayDatos[subgrupo] = {
                        ["DPTO"]: {
                            [variables.periodoSeleccionado.value]: {}
                        },
                        ["MNZN"]: {
                            [variables.periodoSeleccionado.value]: {}
                        },
                        ["MPIO"]: {
                            [variables.periodoSeleccionado.value]: {}
                        },
                    }
                }, [])

                variables.tematica = {
                    "GRUPOS": consultaUnoFin,
                    "SUBGRUPOS": consultaDosFin,
                    "TEMAS": consultaTres.data,
                    "CATEGORIAS": consultaTresFin
                }

                localStorage.setItem('tematica', JSON.stringify(variables.tematica))
                localStorage.setItem('rangos', JSON.stringify(variables.dataRangos))
                Object.keys(variables.tematica["CATEGORIAS"]).map((datos) => {

                    let punto = 0;

                    if ((variables.dataRangos)[datos] != undefined) {
                        let dominiosRange = groupByFunct((variables.dataRangos)[datos], "NIVEL_GEOGRAFICO");

                        variables.coloresLeyend[datos] = {
                            ["MPIO"]: [],
                            ["DPTO"]: [],
                            ["MNZN"]: [],

                        }
                    } else {
                        variables.coloresLeyend[datos] = {
                            ["MPIO"]: [],
                            ["DPTO"]: [],
                            ["MNZN"]: [],
                            ["CAMPOS"]: [],

                        }
                    }

                    let colores = getColorArray(datos);

                    (colores).map(function (num, index, arr) {

                        if (index % 2 == 0) {

                            if (punto === 0) {
                                (variables.coloresLeyend[datos]["DPTO"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', + " "]);
                                (variables.coloresLeyend[datos]["MPIO"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', + " ", "visible"]);
                                (variables.coloresLeyend[datos]["MNZN"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', + " "]);
                            } else {
                                if (punto === 4) {
                                    (variables.coloresLeyend[datos]["DPTO"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', + " "]);
                                    (variables.coloresLeyend[datos]["MPIO"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', + " ", "visible"]);
                                    (variables.coloresLeyend[datos]["MNZN"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', + " "]);
                                }
                            }
                        }
                    }, []);

                }, [])
                localStorage.setItem('leyenda', JSON.stringify(variables.coloresLeyend));
            } else {
                if (Object.keys(variables.dataArrayDatos).length === 0) {
                    Object.keys(variables.tematica["SUBGRUPOS"]).map((subgrupo) => {
                        variables.dataArrayDatos[subgrupo] = {
                            ["DPTO"]: {
                                [variables.periodoSeleccionado.value]: {}
                            },
                            ["MPIO"]: {
                                [variables.periodoSeleccionado.value]: {}
                            },
                            ["MNZN"]: {
                                [variables.periodoSeleccionado.value]: {}
                            },
                        }
                    }, [])
                }
            }
            setTematica(variables.tematica);

            let zoom = variables.map.getView().getZoom();

            if (zoom >= 7) {
                variables.changeTheme("MPIO", null, "MPIO", "y");
                if (variables.deptoSelected == undefined && variables.deptoVariable != undefined) {
                    variables.filterGeo("DPTO", variables.deptoVariable)
                }
            } else if (zoom < 7) {

                if (Object.keys(variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["MPIO"][variables.periodoSeleccionado.value]).length === 0) {
                    variables.legenTheme();
                }
            }
        };

        if (!filterSearch) {
            consultaAPI();
        }
    }, []);

    function handleClick(extent) {
        bboxExtent(extent)
        if (filterSearch) {
            setTerm("")
        }
    }
    const handleChange = event => {
        console.log(event)
        if (!filterSearch) {
            console.log("EVENT", event);
            setTermDos(event)
        } else {
            setTerm(event)
        }
    };

    const handleChangeBtn = event => {
        setBtn(event.currentTarget.id)
        variables.visualThematic(null);
    };

    const handleChangeBtnDos = event => {

        event.stopPropagation();
        event.preventDefault();
        setBtnDos(event.currentTarget.id)
        if (variables.variableAnterior === null) {
            variables.variableAnterior = event.currentTarget.id;
        } else {
            variables.variableAnterior = variables.varVariable;
        }

        variables.varVariable = event.currentTarget.id;
        let zoom = variables.map.getView().getZoom();

        if (zoom < 7) {
            if (!variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["DPTO"][variables.periodoSeleccionado.value]) {
                variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["DPTO"][variables.periodoSeleccionado.value] = {};
            }
            variables.getProductosByPeriodo("MPIO", "MPIO", variables.periodoSeleccionado.value);
            variables.changeTheme("MPIO", 0, "MPIO", "y");
        } else if (zoom >= 7 && zoom <= 11) {
            if (!variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["DPTO"][variables.periodoSeleccionado.value]) {
                variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["DPTO"][variables.periodoSeleccionado.value] = {};
            }
            if (!variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["MPIO"][variables.periodoSeleccionado.value]) {
                variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["MPIO"][variables.periodoSeleccionado.value] = {};
            }
            variables.changeTheme("MPIO", 0, "MPIO", "y");
            variables.changeTheme("MPIO", null, null, "y");
            if (variables.deptoSelected == undefined && variables.deptoVariable != undefined) {
                variables.filterGeo("DPTO", variables.deptoVariable)
            }
            variables.changeStyleDepto();
        }
        else if (zoom > 11) {
            if (variables.municipioSeleccionado != null) {
                variables.changeTheme("MPIO", 0, "MPIO", "n");
                variables.changeTheme("MPIO", variables.municipioSeleccionado, null, "y");
            }

            variables.changeTheme("SECC", null, "NSC", "n");
            variables.changeStyleDepto();
            variables.changeStyleMpio();
        }

        variables.baseMapCheck = "Gris";

        if (variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"] === "%") {
            if (variables.updateSymbols != null) {
                variables.updateSymbols();
            }
        } else if (variables.tematica["CATEGORIAS"][variables.varVariable][0]["UNIDAD"] === "$") {
            if (variables.updateToProps != null) {
                variables.updateToProps();
            }
        }

        variables.closer.click();
    };

    const results = municipios.concat(departamentos, centros);
    const searchResultsMapped = results.filter(result => ((result.name).toLowerCase()).includes(term.toLowerCase()) && term.length >= 3).map(filteredResult => {
        return (
            <li className="search__list__item" id="25" key={filteredResult.cod_dane} onClick={() => handleClick(filteredResult.bextent)}>
                <p className="search__list__item__text">
                    <span className="search__list__item__code">{filteredResult.cod_dane}</span>  -  {filteredResult.name} -
                    <span className="search__list__item__type">{filteredResult.ref}</span>
                </p>
            </li>
        )
    });

    const liTemas = (subgrupo) => {
        return (
            (tematica.TEMAS)
                .filter(result => ((result.COD_SUBGRUPO) == subgrupo))
                .map((filteredResult, index) => {
                    if (((filteredResult.CATEGORIA).toLowerCase()).indexOf(termDos.toLowerCase()) != "-1") {
                        return (
                            <AccordionItem categoria={filteredResult} index={index} click={handleChangeBtnDos} btn={btnDos} key={index} />
                        )
                    }
                })
        );
    }

    const temas = Object.values(tematica.SUBGRUPOS).filter(result => (btn.length === 0) ? true : (result[0].COD_GRUPO == btn) ? true : false)
        .map((item, index) => {
            return (
                <Accordion tematica={tematica} item={item} index={index} liTemas={liTemas(item[0].COD_SUBGRUPO)} key={index} />
            )
        });


    const toUpperCaseJSON = (obj) => {

        for (var i = 0; i < obj.length; i++) {

            var a = obj[i];
            for (var key in a) {
                if (a.hasOwnProperty(key)) {
                    a[key.toUpperCase()] = a[key];
                    delete a[key];
                }
            }
            obj[i] = a;
        }

        return obj;

    }

    return (
        <Fragment>
            {!filterSearch && <NavButton temaTematica={tematica} click={handleChangeBtn} btn={btn} />}
            {visualList && <div className="searchBox">
                {placeholder !== "Escriba un indicador" && <div className="search">
                    <input
                        className="search__input"
                        placeholder={placeholder}
                        value={filterSearch ? term : termDos}
                        onChange={(e) => handleChange(e.target.value)}
                    />
                    <button className="search__btn" aria-label="Justify" id="search__btn">
                        <span className="DANE__Geovisor__icon__search"></span>
                    </button>
                    <div className="search__erase"></div>
                    <p className="search__errorMessage">Lo sentimos, no encontramos nada relacionado.</p>
                    {filterSearch && <ul className="search__list">{searchResultsMapped}</ul>}
                </div>}
                {!filterSearch && <div className="filter__thematic">
                    <ul className="filter__thematic__list">
                        {temas}
                    </ul>
                </div>}
            </div>}
        </Fragment>
    );
};
export default Search;

