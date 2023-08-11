// FUNCIONALIDAD Y MAQUETA PARA FILTRO DE UBICACION (GROGRAFICO)

import React, { Component, useState } from 'react';
import municipios from '../../json/mpio-extent.json'
import departamentos from '../../json/dpto-extent.json'
import clase from '../../json/clase-extent.json'
import cps from '../../json/centros_poblados-extent.json'
import Select from 'react-select'
import { boundingExtent } from 'ol/extent';
import { transform, transformExtent } from 'ol/proj';
import { variables } from '../base/variables';
import { Stroke, Style } from 'ol/style';
import { getCenter } from 'ol/extent';
import { servidorQuery } from '../base/request';

function bboxExtent(bbox, tipo) {
    bbox = bbox.replace('BOX(', '').replace(')', '')
    bbox = bbox.split(",")
    let bbox1 = bbox[0].split(" ")
    let bbox2 = bbox[1].split(" ");
    let boundary = [[bbox1[0], bbox1[1]], [bbox2[0], bbox2[1]]];
    variables.map.flyTo({
        center: [-74, 4],
        zoom: 10,
        essential: false // this animation is considered essential with respect to prefers-reduced-motion
    });
    variables.map.fitBounds(boundary);
    variables.map.fire('flystart');
    var ext = boundingExtent([[bbox1[0], bbox1[1]], [bbox2[0], bbox2[1]]]);
    ext = transformExtent(ext, 'EPSG:4326', 'EPSG:3857');
    // if (tipo === "mpio") {
    //     // variables.map.getView().fit(ext, variables.map.getSize());
    //     variables.map.getView().animate({ center: getCenter(ext) })
    // } else {
    //     variables.map.getView().fit(ext, variables.map.getSize());
    // }

}

const Filter = (props) => {

    const options1 = departamentos

    const options2 = municipios

    const options3 = [
        { value: '1', label: '1 - Cabecera municipal' },
        { value: '2', label: '2 - Centros poblados' },
        { value: '3', label: '3 - Rural disperso' }
    ]

    let options4 = [];

    const [listCp, setListCp] = useState([]);
    const [listSetU, setListSetU] = useState([]);
    const [listSeccU, setListSeccU] = useState([]);
    const [listManzana, setListManzana] = useState([]);
    const [selectedOption3, setSelectedOption3] = useState(0);
    const [selectedOption2, setSelectedOption2] = useState(0);
    const [selectedOption, setSelectedOption] = useState(0);
    const [selectedOption4, setSelectedOption4] = useState(0);
    const [selectedOption5, setSelectedOption5] = useState(0);
    const [selectedOption6, setSelectedOption6] = useState(0);
    const [selectedOption7, setSelectedOption7] = useState(0);

    let filteredOptions = options2.filter((o) => (o.cod_dane).substring(0, 2) === selectedOption.cod_dane)

    const clearHightlightFeature = (layer) => {

        variables.map.setPaintProperty(
            layer,
            'line-opacity',
            0
        );

    }

    const handleChange1 = (evt) => {
        setSelectedOption(evt);

        let bbox = evt.bextent
        bboxExtent(bbox, "dpto")
        // let layer = variables.capas['deptos_vt2'];
        let layer = 'deptos_vt2';
        let layer2 = 'mpios_vt2';

        if (evt.cod_dane === '00') {
            setSelectedOption2(0)
            variables.deptoSelected = undefined;
            variables.deptoSelectedFilter = undefined;
            variables.deptoVariable = undefined;
            variables.map.flyTo({
                center: [-74.1083125, 4.663437],
                zoom: 5,
                essential: false // this animation is considered essential with respect to prefers-reduced-motion
            });
            variables.map.fire('flystart');
            // variables.map.getView().setCenter(transform([-74.1083125, 4.663437], 'EPSG:4326', 'EPSG:3857'));
            // variables.map.getView().setZoom(6);
            clearHightlightFeature(layer);
            clearHightlightFeature(layer2);

        } else {
            // console.log(evt)
            variables.deptoSelected = evt.cod_dane;
            variables.deptoSelectedFilter = evt.cod_dane;
            variables.deptoVariable = evt.cod_dane;

            // variables.filterGeo("DPTO",evt.cod_dane)     


            // let currZoom = variables.map.getView().getZoom();
            // if(currZoom < 9){
            //     variables.map.getView().setZoom(9.1) 
            // }  

            // variables.currentZoom = variables.map.getView().getZoom();
            filteredOptions = [];

            setSelectedOption2(0);
            setSelectedOption3(0);
            setSelectedOption4(0);
            setSelectedOption5(0);
            setSelectedOption6(0);
            setSelectedOption7(0);
            variables.baseMapPrev = variables.baseMapCheck;
            variables.baseMapCheck = "Gris";
            if (variables.changeDepto != null) {
                variables.changeDepto(evt.cod_dane + " - " + evt.name)
            }
            let layer = "deptos_vt2";
            hightlightFeature(layer, evt.cod_dane, 'id', 'dptos')
        }


    };



    const handleChange2 = (evt) => {
        setSelectedOption2(evt)
        let bbox = evt.bextent
        bboxExtent(bbox, "mpio")
        variables.municipioSeleccionado = evt.cod_dane;
        // setSelectedOption3(0);
        variables.baseMapPrev = variables.baseMapCheck;
        variables.baseMapCheck = "Satelital";
        if (variables.changeDepto != null) {
            variables.changeDepto(selectedOption.cod_dane + " - " + selectedOption.name + ", " + evt.cod_dane + " - " + evt.name)
        }

        let filter = clase.filter((o) => (o.cod_dane).indexOf(evt.cod_dane + "1") != -1)
        bboxExtent(filter[0].bextent, "mpio")

        let layer = 'mpios_vt2';
        hightlightFeature(layer, evt.cod_dane, 'id', 'mpios')

        let nivel = 'MNZN';
        variables.changeTheme(nivel, evt.cod_dane, "NM", "N");

        setSelectedOption3(0);
        setSelectedOption4(0);
        setSelectedOption5(0);
        setSelectedOption6(0);
        setSelectedOption7(0);

    }

    const handleChange3 = (evt) => {
        const filtroTres = clase.filter((o) => (o.cod_dane).indexOf(selectedOption2.cod_dane + evt.value) != -1)
        setSelectedOption3(evt)
        let bbox = filtroTres[0].bextent
        bboxExtent(bbox, "mpio")
        let options = [];
        if (evt.value == 1) {
            getDataSectoresUrb(selectedOption2.cod_dane, evt.value)
                .then((res) => {
                    res.data.resultado.forEach((r) => {
                        options.push({ ref: "Sectores", name: "Sectores", cod_dane: r.setu_ccdgo, short: r.setu_ccdgo, bbox: r.bextent });
                    })
                    setListSetU(options);
                })
        } else if (evt.value == 2) {
            options4 = cps.filter((o) => o.cod_dane.substring(0, 5) === selectedOption2.cod_dane);
            setListCp(options4)
        }

        setSelectedOption4(0);
        setSelectedOption5(0);
        setSelectedOption6(0);
        setSelectedOption7(0);

    }

    const handleChange4 = (evt) => {
        setSelectedOption4(evt);
        let bbox = evt.bextent
        bboxExtent(bbox, "mpio")
        let options = [];
        getDataSectores(evt.cod_dane)
            .then((res) => {
                if (res.data.resultado) {
                    res.data.resultado.forEach((r) => {
                        options.push({ ref: "Sectores", name: "Sectores", cod_dane: r.setu_ccdgo, short: r.setu_ccdgo, bbox: r.bextent });
                    })
                }

                setListSetU(options)
            });

        setSelectedOption5(0);
        setSelectedOption6(0);
        setSelectedOption7(0);
    }

    const handleChange5 = (evt) => {
        setSelectedOption5(evt);
        let bbox = evt.bbox
        bboxExtent(bbox, "mpio")
        let options = [];
        if (selectedOption3.value == 1) {
            getDataSeccionesUrb(selectedOption2.cod_dane, selectedOption3.value, evt.short)
                .then((res) => {
                    res.data.resultado.forEach((r) => {
                        options.push({ ref: "Secciones", name: "Secciones", cod_dane: r.cod_secc, short: r.substring, bbox: r.bextent });
                    })

                    setListSeccU(options);
                })
        } else if (selectedOption3.value == 2) {
            getDataSeccionesUrbCpob(selectedOption2.cod_dane, selectedOption3.value, evt.short, selectedOption4.cod_dane)
                .then((res) => {
                    res.data.resultado.forEach((r) => {
                        options.push({ ref: "Secciones", name: "Secciones", cod_dane: r.cod_secc, short: r.substring, bbox: r.bextent });
                    })

                    setListSeccU(options);
                })
        }

        setSelectedOption6(0);
        setSelectedOption7(0);
    }


    const handleChange6 = (evt) => {
        setSelectedOption6(evt);
        let bbox = evt.bbox
        bboxExtent(bbox, "mpio")
        let options = [];
        if (selectedOption3.value == 1 || selectedOption3.value == 2) {
            getDataMz(evt.cod_dane)
                .then(function (res) {
                    res.data.resultado.forEach((r) => {
                        options.push({ ref: "Manzanas", name: "Manzanas", cod_dane: r.cod_dane, short: r.substring, bbox: r.bextent });
                    })

                    setListManzana(options);
                });
        }

        setSelectedOption7(0);

    }

    const handleChange7 = (evt) => {
        setSelectedOption7(evt);
        let bbox = evt.bbox
        bboxExtent(bbox, "mpio")
    }

    const hightlightFeature = (layer, id, capa, tipo) => {

        const getLineColorDefault = variables.map.getPaintProperty(layer, 'line-color');
        const getLineWidthDefault = variables.map.getPaintProperty(layer, 'line-width');

        variables.map.setPaintProperty(
            layer,
            'line-color',
            ['match', ['get', capa], id, tipo === "mpios" ? "#00ffff" : "#cc66ff", getLineColorDefault]
        );

        variables.map.setPaintProperty(
            layer,
            'line-width',
            ['match', ['get', capa], id, 5, getLineWidthDefault]
        );

        variables.map.setPaintProperty(
            layer,
            'line-opacity',
            ['match', ['get', capa], id, 1, 0]
        );

    }

    const getDataSectores = (cpob) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_urbsect/ST_Extent(geom)%20as%20bextent-gid-setu_ccdgo/cod_cpob/" + cpob + "/true");
    }

    const getDataSectoresUrb = (mcipio, clase) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_urbsect/ST_Extent(geom)%20as%20bextent-gid-setu_ccdgo/substring(cod_sect,1,6)/" + mcipio + clase + "/true");
    }

    const getDataSeccionesUrb = (mcipio, clase, setu) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_urbsecc/ST_Extent(geom)%20as%20bextent-gid-cod_secc-substring(cod_secc,19,2)/substring(cod_sect,1,6)-substring(cod_sect,15,4)/" + mcipio + clase + "-" + setu + "/true");
    }

    const getDataMz = (seccu) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_mzn/ST_Extent(geom)%20as%20bextent-gid-cod_dane-substring(cod_dane,21,2)/substring(cod_dane,1,20)/" + seccu + "/true");
    }

    const getDataSeccionesUrbCpob = (mcipio, clase, setu, cpob) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_urbsecc/ST_Extent(geom)%20as%20bextent-gid-cod_secc-substring(cod_secc,19,2)/cod_cpob-substring(cod_sect,15,4)/" + cpob + "-" + setu + "/true");
    }


    return (
        <div className="tools__panel">
            {/* <h3 className="tools__title"> Filtrar </h3> */}
            <p className="tools__text">Realice zoom a la ubicación que desea ver en el mapa</p>
            <div className="selectBox">
                <p className="selectBox__name">Departamento:</p>
                <Select
                    styles={{
                        navBar: provided => ({ zIndex: 9999 })
                    }}
                    name="form-field-name"
                    value={selectedOption.value}
                    onChange={handleChange1}
                    className="select2-container" placeholder="Seleccione un departamento" options={options1}
                    // isClearable={true}
                    getOptionValue={(option) => option.cod_dane}
                    getOptionLabel={(option) => option.cod_dane + " - " + option.name}
                />
            </div>
            <div className="selectBox">
                <p className="selectBox__name">Municipio:</p>
                <Select
                    // styles={{
                    //     navBar: provided => ({ zIndex: 9999 })
                    // }}
                    name="form-field-name"
                    value={selectedOption2.value}
                    onChange={handleChange2}
                    className="select2-container" placeholder="Seleccione un municipio" options={filteredOptions}
                    // isClearable={true}
                    getOptionValue={(option) => option.cod_dane}
                    getOptionLabel={(option) => option.cod_dane + " - " + option.name}
                />
            </div>

            <div className="selectBox">
                <p className="selectBox__name">Clase:</p>
                <Select
                    name="form-field-name"
                    value={selectedOption3}
                    onChange={handleChange3}
                    className="select2-container" placeholder="Seleccione una clase" options={options3}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                />
            </div>

            {selectedOption3.value == 2 ?
                <div className="selectBox">
                    <p className="selectBox__name">Centro poblado:</p>
                    <Select
                        name="form-field-name"
                        value={selectedOption4}
                        onChange={handleChange4}
                        className="select2-container" options={listCp}
                        placeholder="Seleccione una centro poblado"
                        getOptionValue={(option) => option.cod_dane}
                        getOptionLabel={(option) => option.cod_dane + " - " + option.name}
                    />
                </div> : null
            }

            {selectedOption3.value == 1 || (selectedOption3.value == 2 && selectedOption4 != 0) ?
                <div className="selectBox">
                    <p className="selectBox__name">Sector urbano:</p>
                    <Select
                        name="form-field-name"
                        value={selectedOption5}
                        onChange={handleChange5}
                        className="select2-container" options={listSetU}
                        getOptionValue={(option) => option.cod_dane}
                        getOptionLabel={(option) => option.cod_dane + " - " + option.short}
                    />
                </div> : null
            }

            {selectedOption5 != 0 && (selectedOption3.value == 1 || (selectedOption3.value == 2 && selectedOption4 != 0)) ?
                <div className="selectBox">
                    <p className="selectBox__name">Sección urbana:</p>
                    <Select
                        name="form-field-name"
                        value={selectedOption6}
                        onChange={handleChange6}
                        className="select2-container" options={listSeccU}
                        getOptionValue={(option) => option.cod_dane}
                        getOptionLabel={(option) => option.short + " - " + option.short}
                    />
                </div> : null
            }

            {selectedOption5 != 0 && selectedOption6 != 0 && (selectedOption3.value == 1 || (selectedOption3.value == 2 && selectedOption4 != 0)) ?
                <div className="selectBox">
                    <p className="selectBox__name">Manzana:</p>
                    <Select
                        name="form-field-name"
                        value={selectedOption7}
                        onChange={handleChange7}
                        className="select2-container" options={listManzana}
                        getOptionValue={(option) => option.cod_dane}
                        getOptionLabel={(option) => option.short + " - " + option.short}
                    />
                </div> : null
            }




        </div>
    );
}

export default Filter;
