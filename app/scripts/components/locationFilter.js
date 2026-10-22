// FUNCIONALIDAD Y MAQUETA PARA FILTRO DE UBICACION (GROGRAFICO)

import React, { useMemo, useState } from 'react';
import municipios from '../../json/mpio-extent.json'
import departamentos from '../../json/dpto-extent.json'
import clase from '../../json/clase-extent.json'
import cps from '../../json/centros_poblados-extent.json'
import Select from 'react-select'
import { boundingExtent } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import { toast } from 'react-toastify';
import { variables } from '../base/variables';
import { servidorQuery } from '../base/request';

const MANZANAS_LAYER = 'manzanas2022';

// El menú de react-select se renderiza dentro del árbol del panel; .react-tabs
// (overflow: auto) lo recorta. Portal + z-index alto lo sacan encima del mapa.
const selectMenuProps = {
    menuPortalTarget: typeof document !== 'undefined' ? document.body : null,
    menuPosition: 'fixed',
    styles: {
        menuPortal: (base) => ({ ...base, zIndex: 1000051 }),
    },
};

function bboxExtent(bbox) {
    if (!bbox) {
        return;
    }
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
}

const convertBox3857to4326 = (bbox) => {
    if (!bbox) {
        return null;
    }
    const cleaned = bbox.replace('BOX(', '').replace(')', '');
    const parts = cleaned.split(',');
    const bbox1 = parts[0].trim().split(/\s+/);
    const bbox2 = parts[1].trim().split(/\s+/);
    let ext = boundingExtent([[Number(bbox1[0]), Number(bbox1[1])], [Number(bbox2[0]), Number(bbox2[1])]]);
    ext = transformExtent(ext, 'EPSG:3857', 'EPSG:4326');
    return `BOX(${ext[0]} ${ext[1]},${ext[2]} ${ext[3]})`;
};

const findClaseExtent = (mpioCod, claseValue, dptoCod) => {
    if (!mpioCod || !claseValue) {
        return null;
    }
    if (String(claseValue) === '2') {
        const dpto = dptoCod || String(mpioCod).substring(0, 2);
        return clase.find((o) => o.cod_dane === dpto + mpioCod + '2') || null;
    }
    return clase.find((o) => o.cod_dane === mpioCod + String(claseValue)) || null;
};

const clearManzanasClaseFilter = () => {
    if (variables.map && variables.map.getLayer(MANZANAS_LAYER)) {
        variables.map.setFilter(MANZANAS_LAYER, null);
    }
};

const applyManzanasClaseFilter = (claseValue) => {
    if (!variables.map || !variables.map.getLayer(MANZANAS_LAYER)) {
        return;
    }
    variables.map.setFilter(MANZANAS_LAYER, ['==', ['slice', ['get', 'id'], 5, 6], String(claseValue)]);
};

const Filter = (props) => {
    const { onDone } = props;

    const notifyDone = () => {
        if (typeof onDone === 'function') {
            onDone();
        }
    };

    const [activePanel, setActivePanel] = useState("filtros");
    const [inactivePanel, setInactivePanel] = useState("codigo");
    let claseActiva = "upload__item --active";
    let claseInactiva = "upload__item";
    let claseActivaPanel = "upload__panel --active";
    let claseInactivaPanel = "upload__panel";
    const [manzanaCodigo, setManzanaCodigo] = useState("");

    const options1 = departamentos
    const options2 = municipios

    const [listCp, setListCp] = useState([]);
    const [listSetU, setListSetU] = useState([]);
    const [listSeccU, setListSeccU] = useState([]);
    const [listManzana, setListManzana] = useState([]);
    const [listSetR, setListSetR] = useState([]);
    const [listSeccR, setListSeccR] = useState([]);
    const [selectedOption3, setSelectedOption3] = useState(null);
    const [selectedOption2, setSelectedOption2] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOption4, setSelectedOption4] = useState(null);
    const [selectedOption5, setSelectedOption5] = useState(null);
    const [selectedOption6, setSelectedOption6] = useState(null);
    const [selectedOption7, setSelectedOption7] = useState(null);
    const [selectedOption8, setSelectedOption8] = useState(null);
    const [selectedOption9, setSelectedOption9] = useState(null);

    const filteredOptions = selectedOption
        ? options2.filter((o) => (o.cod_dane).substring(0, 2) === selectedOption.cod_dane)
        : [];

    const hasCentrosPoblados = useMemo(() => {
        if (!selectedOption2) {
            return false;
        }
        return cps.some((o) => o.cod_dane.substring(0, 5) === selectedOption2.cod_dane);
    }, [selectedOption2]);

    const hasClase1 = useMemo(() => {
        if (!selectedOption2) {
            return false;
        }
        return Boolean(findClaseExtent(selectedOption2.cod_dane, '1', selectedOption && selectedOption.cod_dane));
    }, [selectedOption, selectedOption2]);

    const hasClase3 = useMemo(() => {
        if (!selectedOption2) {
            return false;
        }
        return Boolean(findClaseExtent(selectedOption2.cod_dane, '3', selectedOption && selectedOption.cod_dane));
    }, [selectedOption, selectedOption2]);

    const options3 = useMemo(() => ([
        { value: '1', label: '1 - Cabecera municipal', isDisabled: !hasClase1 },
        { value: '2', label: '2 - Centros poblados', isDisabled: !hasCentrosPoblados },
        { value: '3', label: '3 - Rural disperso', isDisabled: !hasClase3 }
    ]), [hasClase1, hasCentrosPoblados, hasClase3]);

    const clearCascadeFromMunicipio = () => {
        setSelectedOption3(null);
        setSelectedOption4(null);
        setSelectedOption5(null);
        setSelectedOption6(null);
        setSelectedOption7(null);
        setSelectedOption8(null);
        setSelectedOption9(null);
        setListCp([]);
        setListSetU([]);
        setListSeccU([]);
        setListManzana([]);
        setListSetR([]);
        setListSeccR([]);
    };

    const clearHightlightFeature = (layer) => {
        if (!variables.map || !variables.map.getLayer(layer)) {
            return;
        }
        variables.map.setPaintProperty(
            layer,
            'line-opacity',
            0
        );
    }

    const handleChange1 = (evt) => {
        setSelectedOption(evt);
        clearManzanasClaseFilter();
        clearCascadeFromMunicipio();
        setSelectedOption2(null);

        let layer = 'deptos_vt2';
        let layer2 = 'mpios_vt2';

        if (evt.cod_dane === '00') {
            variables.deptoSelected = undefined;
            variables.deptoSelectedFilter = undefined;
            variables.deptoVariable = undefined;
            variables.map.flyTo({
                center: [-74.1083125, 4.663437],
                zoom: 5,
                essential: false
            });
            variables.map.fire('flystart');
            clearHightlightFeature(layer);
            clearHightlightFeature(layer2);
            notifyDone();
            return;
        }

        bboxExtent(evt.bextent);
        variables.deptoSelected = evt.cod_dane;
        variables.deptoSelectedFilter = evt.cod_dane;
        variables.deptoVariable = evt.cod_dane;
        variables.baseMapPrev = variables.baseMapCheck;
        variables.baseMapCheck = "Gris";
        if (variables.changeDepto != null) {
            variables.changeDepto(evt.cod_dane + " - " + evt.name)
        }
        notifyDone();
    };

    const handleChange2 = (evt) => {
        setSelectedOption2(evt)
        clearManzanasClaseFilter();
        clearCascadeFromMunicipio();

        bboxExtent(evt.bextent);
        variables.municipioSeleccionado = evt.cod_dane;
        variables.baseMapPrev = variables.baseMapCheck;
        variables.baseMapCheck = "Satelital";
        if (variables.changeDepto != null && selectedOption) {
            variables.changeDepto(selectedOption.cod_dane + " - " + selectedOption.name + ", " + evt.cod_dane + " - " + evt.name)
        }

        const claseCabecera = findClaseExtent(evt.cod_dane, '1', selectedOption && selectedOption.cod_dane);
        if (claseCabecera && claseCabecera.bextent) {
            bboxExtent(claseCabecera.bextent);
        }

        let nivel = 'MNZN';
        variables.changeTheme(nivel, evt.cod_dane, "NM", "N");
        notifyDone();
    }

    const handleChange3 = (evt) => {
        if (!selectedOption2) {
            toast.warn('Seleccione primero un municipio.');
            setSelectedOption3(null);
            return;
        }

        if (evt.value === '2' && !hasCentrosPoblados) {
            toast.info('Este municipio no tiene centros poblados.');
            setSelectedOption3(null);
            return;
        }

        const filtroTres = findClaseExtent(
            selectedOption2.cod_dane,
            evt.value,
            selectedOption && selectedOption.cod_dane
        );

        if (!filtroTres || !filtroTres.bextent) {
            toast.warn('La clase seleccionada no existe para este municipio.');
            setSelectedOption3(null);
            clearManzanasClaseFilter();
            return;
        }

        setSelectedOption3(evt)
        bboxExtent(filtroTres.bextent);
        applyManzanasClaseFilter(evt.value);

        setSelectedOption4(null);
        setSelectedOption5(null);
        setSelectedOption6(null);
        setSelectedOption7(null);
        setSelectedOption8(null);
        setSelectedOption9(null);
        setListCp([]);
        setListSetU([]);
        setListSeccU([]);
        setListManzana([]);
        setListSetR([]);
        setListSeccR([]);

        let options = [];
        if (evt.value == 1) {
            getDataSectoresUrb(selectedOption2.cod_dane, evt.value)
                .then((res) => {
                    if (res.data.resultado) {
                        res.data.resultado.forEach((r) => {
                            options.push({ ref: "Sectores", name: "Sectores", cod_dane: r.setu_ccdgo, short: r.setu_ccdgo, bbox: r.bextent });
                        })
                    }
                    setListSetU(options);
                })
                .catch(() => toast.error('No fue posible cargar los sectores urbanos.'));
        } else if (evt.value == 2) {
            options = cps.filter((o) => o.cod_dane.substring(0, 5) === selectedOption2.cod_dane);
            setListCp(options)
            if (options.length === 0) {
                toast.info('Este municipio no tiene centros poblados.');
            }
        } else if (evt.value == 3) {
            getDataSectoresRurales(selectedOption.cod_dane, selectedOption2.cod_dane.substr(2, 3), evt.value)
                .then(function (res) {
                    if (res.data.resultado) {
                        res.data.resultado.forEach((r) => {
                            const bbox4326 = convertBox3857to4326(r.bextent);
                            options.push({
                                ref: "Sectores",
                                name: "Sectores",
                                cod_dane: r.setr_ccdgo,
                                short: r.setr_ccdgo,
                                bbox: bbox4326 || r.bextent
                            });
                        })
                    }
                    setListSetR(options);
                    if (options.length === 0) {
                        toast.info('No se encontraron sectores rurales para este municipio.');
                    }
                })
                .catch(() => toast.error('No fue posible cargar los sectores rurales.'));
        }

        notifyDone();
    }

    const handleChange4 = (evt) => {
        setSelectedOption4(evt);
        bboxExtent(evt.bextent)
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

        setSelectedOption5(null);
        setSelectedOption6(null);
        setSelectedOption7(null);
        notifyDone();
    }

    const handleChange5 = (evt) => {
        setSelectedOption5(evt);
        bboxExtent(evt.bbox)
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

        setSelectedOption6(null);
        setSelectedOption7(null);
        notifyDone();
    }


    const handleChange6 = (evt) => {
        setSelectedOption6(evt);
        bboxExtent(evt.bbox)
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

        setSelectedOption7(null);
        setSelectedOption8(null);
        setSelectedOption9(null);
        notifyDone();
    }

    const handleChange7 = (evt) => {
        setSelectedOption7(evt);
        bboxExtent(evt.bbox)
        notifyDone();
    }

    const handleChange8 = (evt) => {
        setSelectedOption8(evt);
        bboxExtent(evt.bbox)
        let options = [];
        getDataSeccionesRurales(selectedOption.cod_dane, selectedOption2.cod_dane.substr(2, 3), selectedOption3.value, evt.short)
            .then((res) => {
                if (res.data.resultado) {
                    res.data.resultado.forEach((r) => {
                        options.push({ ref: "Secciones", name: "Secciones", cod_dane: r.secr_ccdgo, short: r.secr_ccdgo, bbox: r.bextent });
                    })
                }
                setListSeccR(options);
            })

        setSelectedOption9(null);
        notifyDone();
    }

    const handleChange9 = (evt) => {
        setSelectedOption9(evt);
        bboxExtent(evt.bbox)
        notifyDone();
    }

    const getDataSectores = (cpob) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_urbsect/ST_Extent(geom)%20as%20bextent-gid-setu_ccdgo/cod_cpob/" + cpob + "/true");
    }

    const getDataSectoresUrb = (mcipio, claseVal) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_urbsect/ST_Extent(geom)%20as%20bextent-gid-setu_ccdgo/substring(cod_sect,1,6)/" + mcipio + claseVal + "/true");
    }

    const getDataSeccionesUrb = (mcipio, claseVal, setu) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_urbsecc/ST_Extent(geom)%20as%20bextent-gid-cod_secc-substring(cod_secc,19,2)/substring(cod_sect,1,6)-substring(cod_sect,15,4)/" + mcipio + claseVal + "-" + setu + "/true");
    }

    const getDataMz = (seccu) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_mzn/ST_Extent(geom)%20as%20bextent-gid-cod_dane-substring(cod_dane,21,2)/substring(cod_dane,1,20)/" + seccu + "/true");
    }

    const getDataSeccionesUrbCpob = (mcipio, claseVal, setu, cpob) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_urbsecc/ST_Extent(geom)%20as%20bextent-gid-cod_secc-substring(cod_secc,19,2)/cod_cpob-substring(cod_sect,15,4)/" + cpob + "-" + setu + "/true");
    }

    // D4: mgn2022_rursect (extents en EPSG:3857; se convierten a 4326 en el cliente)
    const getDataSectoresRurales = (depto, mcipio, claseVal) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2022_rursect/ST_Extent(geom)%20as%20bextent-gid-setr_ccdgo/dpto_ccdgo-mpio_ccdgo-clas_ccdgo/" + depto + "-" + mcipio + "-" + claseVal + "/true");
    }

    const getDataSeccionesRurales = (depto, mcipio, claseVal, setu) => {
        return servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_rursecc/ST_Extent(geom)%20as%20bextent-gid-secr_ccdgo/setr_ccnct/" + depto + mcipio + claseVal + setu + "/true");
    }

    const handleClickPanel = (e) => {
        let target = e.currentTarget.id;

        if (target == "upload__kml") {
            setActivePanel("filtros");
            setInactivePanel("codigo");
        } else if (target == "upload__wms") {
            setActivePanel("codigo");
            setInactivePanel("filtros");
        }
    }

    const onChangeHandler = (e) => {
        setManzanaCodigo(e.target.value);
    }

    const buscarManzana = () => {
        servidorQuery(variables.urlDivipolaV2 + "?params=visores-capas_geovisores-mgn2021_mzn/ST_Extent(geom)%20as%20bextent-gid-cod_dane-substring(cod_dane,21,2)/cod_dane/" + manzanaCodigo + "/true")
            .then((res) => {
                if (!res.data.resultado || res.data.resultado.length === 0) {
                    toast.warn('No se encontró la manzana indicada.');
                    return;
                }
                const resultado = res.data.resultado[0];
                bboxExtent(resultado.bextent);
                notifyDone();
            })
            .catch(() => toast.error('No fue posible consultar la manzana.'));
    }

    return (
        <div className="tools__panel">
            <ul className="upload__list">
                <li className={activePanel === 'filtros' ? claseActiva : claseInactiva} id="upload__kml" onClick={handleClickPanel} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClickPanel(e); }} tabIndex={0} role="button" aria-label="Búsqueda niveles MGN">
                    <p className="upload__item__name"> Búsqueda niveles MGN </p>
                </li>
                <li className={activePanel === 'codigo' ? claseActiva : claseInactiva} id="upload__wms" onClick={handleClickPanel} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClickPanel(e); }} tabIndex={0} role="button" aria-label="Código MGN">
                    <p className="upload__item__name"> Código MGN </p>
                </li>
            </ul>
            <div className={activePanel === 'filtros' ? claseActivaPanel : claseInactivaPanel} id="upload__kml">
                <p className="tools__text">Realice zoom a la ubicación que desea ver en el mapa</p>
                <div className="selectBox">
                    <p className="selectBox__name">Departamento:</p>
                    <Select
                        {...selectMenuProps}
                        name="form-field-name"
                        value={selectedOption}
                        onChange={handleChange1}
                        className="select2-container" placeholder="Seleccione un departamento" options={options1}
                        getOptionValue={(option) => option.cod_dane}
                        getOptionLabel={(option) => option.cod_dane + " - " + option.name}
                        isClearable={false}
                    />
                </div>
                <div className="selectBox">
                    <p className="selectBox__name">Municipio:</p>
                    <Select
                        {...selectMenuProps}
                        name="form-field-name"
                        value={selectedOption2}
                        onChange={handleChange2}
                        className="select2-container" placeholder="Seleccione un municipio" options={filteredOptions}
                        getOptionValue={(option) => option.cod_dane}
                        getOptionLabel={(option) => option.cod_dane + " - " + option.name}
                        isDisabled={!selectedOption || selectedOption.cod_dane === '00'}
                        isClearable={false}
                    />
                </div>

                <div className="selectBox">
                    <p className="selectBox__name">Clase:</p>
                    <Select
                        {...selectMenuProps}
                        name="form-field-name"
                        value={selectedOption3}
                        onChange={handleChange3}
                        className="select2-container" placeholder="Seleccione una clase" options={options3}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        isDisabled={!selectedOption2}
                        isOptionDisabled={(option) => Boolean(option.isDisabled)}
                        isClearable={false}
                    />
                </div>

                {selectedOption3 && selectedOption3.value == 2 ?
                    <div className="selectBox">
                        <p className="selectBox__name">Centro poblado:</p>
                        <Select
                            {...selectMenuProps}
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

                {selectedOption3 && (selectedOption3.value == 1 || (selectedOption3.value == 2 && selectedOption4)) ?
                    <div className="selectBox">
                        <p className="selectBox__name">Sector urbano:</p>
                        <Select
                            {...selectMenuProps}
                            name="form-field-name"
                            value={selectedOption5}
                            onChange={handleChange5}
                            className="select2-container" options={listSetU}
                            getOptionValue={(option) => option.cod_dane}
                            getOptionLabel={(option) => option.cod_dane + " - " + option.short}
                        />
                    </div> : null
                }

                {selectedOption3 && selectedOption3.value == 3 ?
                    <div className="selectBox">
                        <p className="selectBox__name">Sector rural:</p>
                        <Select
                            {...selectMenuProps}
                            name="form-field-name"
                            value={selectedOption8}
                            onChange={handleChange8}
                            className="select2-container" options={listSetR}
                            getOptionValue={(option) => option.cod_dane}
                            getOptionLabel={(option) => option.cod_dane + " - " + option.short}
                        />
                    </div> : null
                }

                {selectedOption5 && selectedOption3 && (selectedOption3.value == 1 || (selectedOption3.value == 2 && selectedOption4)) ?
                    <div className="selectBox">
                        <p className="selectBox__name">Sección urbana:</p>
                        <Select
                            {...selectMenuProps}
                            name="form-field-name"
                            value={selectedOption6}
                            onChange={handleChange6}
                            className="select2-container" options={listSeccU}
                            getOptionValue={(option) => option.cod_dane}
                            getOptionLabel={(option) => option.short + " - " + option.short}
                        />
                    </div> : null
                }

                {selectedOption8 && selectedOption3 && selectedOption3.value == 3 ?
                    <div className="selectBox">
                        <p className="selectBox__name">Sección rural:</p>
                        <Select
                            {...selectMenuProps}
                            name="form-field-name"
                            value={selectedOption9}
                            onChange={handleChange9}
                            className="select2-container" options={listSeccR}
                            getOptionValue={(option) => option.cod_dane}
                            getOptionLabel={(option) => option.cod_dane + " - " + option.short}
                        />
                    </div> : null
                }

                {selectedOption5 && selectedOption6 && selectedOption3 && (selectedOption3.value == 1 || (selectedOption3.value == 2 && selectedOption4)) ?
                    <div className="selectBox">
                        <p className="selectBox__name">Manzana:</p>
                        <Select
                            {...selectMenuProps}
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
            <div className={activePanel === 'codigo' ? claseActivaPanel : claseInactivaPanel} id="upload__wms">
                <p className="tools__text">Escriba el código MGN de la manzana</p>
                <p>Código DANE:</p>
                <input type="text" name="manzana_codigo" value={manzanaCodigo} onChange={onChangeHandler} aria-label="Código DANE de manzana"></input>
                <button type="button" onClick={buscarManzana} aria-label="Buscar manzana">Buscar</button>
            </div>
        </div>
    );
}

export default Filter;
