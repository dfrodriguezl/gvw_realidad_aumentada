import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import axios from "axios";
import municipios from '../../json/mpio-extent.json'
import departamentos from '../../json/dpto-extent.json'
import centros from '../../json/centros_poblados-extent.json'
import { boundingExtent } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import { variables } from '../base/variables';
import chroma from 'chroma-js';
import { scaleLinear } from "d3-scale";


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

    // c(arrayColores)
    color = [chroma(colorPrincipal).set('hsl.l', arrayColores[0]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[1]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[2]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[3]).hex(), chroma(colorPrincipal).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[5]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[6]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[7]).hex(), chroma(colorPrincipal).set('hsl.l', arrayColores[8]).hex()];
    return color;
}
const Search = ({ filterSearch, placeholder }) => {
    const [term, setTerm] = useState("");
    const [termDos, setTermDos] = useState("");
    // const [btn, setBtn] = useState("");
    // const [tematica, setTematica] = useState(variables.tematica);
    // const [btnDos, setBtnDos] = useState(variables.varVariable);

    variables.changeTheme = function (nivel, dpto) {
        // console.log(nivel)
        // console.log(variables.dataArrayDatos[variables.varVariable.substring(0, 5)]);
        if (nivel == "MNZN") {
            // console.log(Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel]).length);
            // if (Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel]).length > 0) {
            // console.log(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][dpto]);
            if (variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][dpto] != undefined) {
                variables.changeMap(nivel, dpto);
            } else {
                variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][dpto] = {};
                const urlData = variables.urlVariables + "?codigo_subgrupo=" + variables.varVariable.substring(0, 5) + "&nivel_geografico=" + nivel + "&filtro_geografico=" + dpto
                axios({ method: "GET", url: urlData })
                    .then(function (response) {
                        variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel][dpto] = response.data.resultado
                        variables.queryText[variables.varVariable.substring(0, 5)] = response.data.consulta
                        variables.changeMap(nivel, dpto);
                    });
            }
            // }

        } else {
            if (Object.values(variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel]).length > 0) {
                variables.changeMap(nivel);
            }
            else {
                const urlData = variables.urlVariables + "?codigo_subgrupo=" + variables.varVariable.substring(0, 5) + "&nivel_geografico=" + nivel
                axios({ method: "GET", url: urlData })
                    .then(function (response) {
                        variables.dataArrayDatos[variables.varVariable.substring(0, 5)][nivel] = response.data.resultado
                        variables.queryText[variables.varVariable.substring(0, 5)] = response.data.consulta
                        variables.changeMap(nivel);
                    });
            }
        }
    }
    useEffect(() => {
        const consultaAPI = async () => {
            // console.log(tematica.TEMAS)
            // console.log(variables.tematica)
            // console.log(variables.dataRangos)
            if (Object.keys(variables.tematica).length == 0 || Object.keys(variables.dataRangos).length == 0 || Object.keys(variables.coloresLeyend).length == 0) {
                const consulta = await axios({ method: "GET", url: variables.urlTemas + "?codigo="+variables.codVisor });
                const consultaDos = await axios({ method: "GET", url: variables.urlTemas + "?codigo="+variables.codVisor+"&sub_temas=yes" });
                const consultaTres = await axios({ method: "GET", url: variables.urlTemas + "?codigo="+variables.codVisor+"&variables=yes" });
                const consultaCuatro = await axios({ method: "GET", url: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/clasificacion1.php" });

                const consultaUnoFin = groupByFunct(consulta.data, "COD_GRUPO")
                const consultaDosFin = groupByFunct(consultaDos.data, "COD_SUBGRUPO")
                const consultaTresFin = groupByFunct(consultaTres.data, "COD_CATEGORIA")
                const consultaCuatroFin = (consultaCuatro.data.resultado).filter(result => (Object.keys(consultaTresFin).indexOf((result.COD_CATEGORIA)) != -1))
                variables.dataRangos = groupByFunct(consultaCuatroFin, "COD_CATEGORIA")
                Object.keys(consultaDosFin).map((subgrupo) => {
                    variables.dataArrayDatos[subgrupo] = {
                        ["SECT"]: {},
                        ["MNZN"]: {},
                        ["MPIO"]: {}
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
                // console.log(variables.dataRangos);
                Object.keys(variables.tematica["CATEGORIAS"]).map((datos) => {
                    let punto = 0;
                    let dominiosRange = groupByFunct((variables.dataRangos)[datos], "NIVEL_GEOGRAFICO");
                    // console.log(dominiosRange);
                    variables.coloresLeyend[datos] = {
                        ["SECT"]: [],
                        ["MNZN"]: [],
                        ["MPIO"]: [],
                        ["CAMPOS"]: dominiosRange["MANZANA"][0]
                    }
                    let colores = getColorArray(datos);
                    // console.log(colores);
                    (colores).map(function (num, index, arr) {
                        if (index % 2 == 0) {
                            // console.log(punto)
                            if (punto === 0) {
                                (variables.coloresLeyend[datos]["SECT"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', "> " + dominiosRange["SECTOR"][0]["NB4"] + " "]);
                                (variables.coloresLeyend[datos]["MNZN"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', "> " + dominiosRange["MANZANA"][0]["NB4"] + " "]);
                            } else {
                                if (punto === 4) {
                                    (variables.coloresLeyend[datos]["SECT"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', "0 - " + dominiosRange["SECTOR"][0]["NB1"] + " "]);
                                    (variables.coloresLeyend[datos]["MNZN"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', "0 - " + dominiosRange["MANZANA"][0]["NB1"] + " "]);
                                } else {
                                    (variables.coloresLeyend[datos]["SECT"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', "" + dominiosRange["SECTOR"][0]["NB" + (4 - punto)] + " - " + dominiosRange["SECTOR"][0]["NB" + (5 - punto)] + " "]);
                                    (variables.coloresLeyend[datos]["MNZN"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', "" + dominiosRange["MANZANA"][0]["NB" + (4 - punto)] + " - " + dominiosRange["MANZANA"][0]["NB" + (5 - punto)] + " "]);
                                }
                            }
                            (variables.coloresLeyend[datos]["MPIO"]).push([arr[index], 'rgba(' + (chroma(arr[index]).rgba()).toString() + ')', "0 - 0 "]);
                            punto += 1
                        }
                    }, []);
                }, [])
                localStorage.setItem('leyenda', JSON.stringify(variables.coloresLeyend));
                // console.log(variables.coloresLeyend);
            } else {
                if (Object.keys(variables.dataArrayDatos).length === 0) {
                    Object.keys(variables.tematica["SUBGRUPOS"]).map((subgrupo) => {
                        variables.dataArrayDatos[subgrupo] = {
                            ["SECT"]: {},
                            ["MNZN"]: {},
                            ["MPIO"]: {}
                        }
                    }, [])
                }
            }
            setTematica(variables.tematica);
            if (Object.keys(variables.dataArrayDatos[variables.varVariable.substring(0, 5)]["MPIO"]).length === 0) {
                variables.changeTheme("MPIO");
                variables.changeTheme("SECT");
                variables.changeTheme("MNZN", "91");
                // variables.changeLegend();
                variables.legenTheme();
                axios({ method: "GET", url: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/peet_detallado/puntos1.php" })
                    .then(function (response) {
                        variables.pintarCluster(response.data.resultado)
                    });
            }

            // console.log(variables.tematica)
            // console.log(variables.coloresLeyend)
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
        // console.log(event)
        if (!filterSearch) {
            setTermDos(event)
        } else {
            setTerm(event)
        }

    };

    const handleChangeBtn = event => {
        // console.log(event.currentTarget.id)
        setBtn(event.currentTarget.id)
    };

    const handleChangeBtnDos = event => {
        event.stopPropagation();
        event.preventDefault();
        setBtnDos(event.currentTarget.id)
        variables.varVariable = event.currentTarget.id;
        variables.changeTheme("MPIO");
        variables.changeTheme
        variables.changeTheme("MNZN", "91");
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
    return (
        <div className="container toolbar__secondPanelContent">
            <div className="search">
                <input
                    className="search__input"
                    placeholder={placeholder}
                    value={filterSearch ? term : termDos}
                    onChange={(e) => handleChange(e.target.value)}
                />
                <button className="search__btn" id="search__btn">
                    <span className="DANE__Geovisor__icon__search"></span>
                </button>
                <div className="search__erase"></div>
                <p className="search__errorMessage">Lo sentimos, no encontramos nada relacionado.</p>
                {filterSearch && <ul className="search__list">{searchResultsMapped}</ul>}
            </div>
            {/* {!filterSearch && <NavButton temaTematica={tematica} click={handleChangeBtn} btn={btn} />}
            {!filterSearch && <div className="filter__thematic">
                <ul className="filter__thematic__list">
                    {temas}
                </ul>
            </div>} */}
        </div>
    );
};
export default Search;

