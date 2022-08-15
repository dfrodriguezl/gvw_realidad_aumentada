// Geovisor - OpenLayers | Variables Globales
export const variables = {

    title: 'Geovisor de Componente de Insumos Agropecuarios del SIPSA', //Cambielo por el título de su geovisor
    description: 'Geovisor para consulta del Componente de Insumos Agropecuarios del SIPSA.',
    country: 'Colombia',
    place: ' Todos los departamentos ',
    year: ' 2021 ',
    map: null,
    urlTemas: 'https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/temas.php',
    // urlTemas: 'https://nowsoft.app/geoportal/laboratorio/serviciosjson/visores/temas_upper.php', //enlace/servicio  que trae el servicio de las tematicas por visor
    urlVariables: 'https://geoportal.dane.gov.co/laboratorio/serviciosjson/visores/variables8.php',//enlace/servicio  que trae los datos de la variable seleccionada
    // urlVariables: 'https://nowsoft.app/geoportal/laboratorio/serviciosjson/visores/variables8_upper.php',
    codVisor: "49", //Ponga el codigo que corresponde a SU VISOR
    varVariable: "32101001", //Ponga el codigo de la CATEGORIA que corresponda a su visor
    series: [0, 0, 0, 0, 0],
    urlUE: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/censo_economico/unidades2_segment.php?min=y&codigo_municipio=",
    urlCount: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/censo_economico/unidades2_segment.php?count=y&codigo_municipio=",
    urlCentroids: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/licencias-construccion/centroides_elic.php?depto=",
    // urlCentroidsGeneral: "https://nowsoft.app/geoportal/laboratorio/serviciosjson/licencias-construccion/centroides.php?", 
    urlCentroidsGeneral: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/licencias-construccion/centroides.php?",
    key: "pk.eyJ1IjoiYXBwbW92aWxkYW5lIiwiYSI6ImNrbzY4b2tiajFxN2cyb3F3YnR1NDF6eWkifQ.mVlSJXQZVl4CNmQpZ1pXNA",
    key: "",
    // baseMaps: {
    //     'Gris': 'https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}?access_token=',
    //     'Noche': 'https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/256/{z}/{x}/{y}?access_token=',
    //     'OSM': 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=',
    //     'Satelital': 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=',
    // },

    baseMaps: {
        'Gris': 'http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        'Noche': 'http://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'OSM': 'https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}',
        'Satelital': 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    },
    baseMapCheck: "Noche",  // Ponga el MAPA BASE que quiere por defecto
    layers: {
        departamentos: {
            tipo: "vt",  // Tipos vt: Vector Tile, wms, wfs
            id: "deptos_vt",
            // url: "https://geoportal.dane.gov.co/vector-tiles/mgn_2020/dpto_ccdgo/mgn_2020_dpto_politico/{z}/{x}/{y}.pbf",
            // url: "https://nowsoft.app/vector-tiles/maps/geoportal_dane/mgn_2020_dpto_politico/{z}/{x}/{y}.pbf",
            url: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/vector-tiles/vectortile.php?params=capas_geovisores/mgn2020_dpto/mgn_2020_dpto_politico/dpto_ccdgo/{z}/{x}/{y}",
            title: 'Departamentos',
            visible: true,
            checked: false,
            minZoom: 3,
            maxZoom: 21,
            style: {
                stroke: {
                    color: '#7F3872',
                    width: 2
                }
            },
            ol: null
        },
        departamentoSel: {
            tipo: "vt",  // Tipos vt: Vector Tile, wms, wfs
            id: "deptos_vt2",
            // url: "https://geoportal.dane.gov.co/vector-tiles/mgn_2020/dpto_ccdgo/mgn_2020_dpto_politico/{z}/{x}/{y}.pbf",
            url: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/vector-tiles/vectortile.php?params=capas_geovisores/mgn2020_dpto/mgn_2020_dpto_politico/dpto_ccdgo/{z}/{x}/{y}",
            // url: "https://nowsoft.app/vector-tiles/maps/geoportal_dane/mgn_2020_dpto_politico/{z}/{x}/{y}.pbf",
            title: 'Departamentos sel',
            visible: true,
            checked: false,
            minZoom: 1,
            maxZoom: 12,
            hideToc: true,
            style: {
                stroke: {
                    color: '#ffffff00',
                    width: 0
                }
            },
            ol: null
        },
        municipios: {
            tipo: "vt",  // Tipos vt: Vector Tile, wms, wfs
            id: "mpios_vt",
            // url: "https://geoportal.dane.gov.co/vector-tiles/mgn_2020/mpio_ccnct/mgn_2020_mpio_politico/{z}/{x}/{y}.pbf",
            // url: "https://nowsoft.app/vector-tiles/maps/geoportal_dane/mgn_2020_mpio_politico/{z}/{x}/{y}.pbf",
            url: "https://geoportal.dane.gov.co/laboratorio/serviciosjson/vector-tiles/vectortile.php?params=capas_geovisores/mgn2020_mpio/mgn_2020_mpio_politico/mpio_ccnct/{z}/{x}/{y}",
            title: 'Municipios',
            visible: true,
            checked: false,
            minZoom: 4,
            maxZoom: 21,
            style: {
                stroke: {
                    // color: '#FFF',
                    color: '#000000',
                    width: 0.1
                }
            },
            ol: null
        },
        // secciones: {
        //     tipo: "vt",  // Tipos vt: Vector Tile, wms, wfs
        //     id: "secc_vt",
        //     url: "https://geoportal.dane.gov.co/vector-tiles/mgn_2018/secu_ccnct/mgn_2018_urb_seccion/{z}/{x}/{y}.pbf",
        //     title: 'secciones',
        //     visible: true,
        //     minZoom: 11,
        //     maxZoom: 21,
        //     style: {
        //         stroke: {
        //             color: '#c086f0',
        //             width: 2
        //         }
        //     },
        //     ol: null
        // },
        // manzanas: {
        //     tipo: "vt",  // Tipos vt: Vector Tile, wms, wfs
        //     id: "mzn_vt",
        //     url: "https://geoportal.dane.gov.co/vector-tiles/dbDos/MGN_2018_URB_MANZANA/manz_ccnct/{z}/{x}/{y}.pbf",
        //     title: 'manzanas',
        //     visible: true,
        //     minZoom: 12,
        //     maxZoom: 21,
        //     style: {
        //         stroke: {
        //             color: '#c086f0',
        //             width: 1
        //         }
        //     },
        //     ol: null
        // },
        // clase: {
        //     tipo: "wms",  // Tipos vt: Vector Tile, wms, wfs
        //     id: "clase_wms",
        //     url: "https://geoserverportal.dane.gov.co/geoserver2/postgis/wms",
        //     layer: 'postgis:V2020_MGN_URB_AREA_CENSAL',
        //     title: 'Area censal',
        //     visible: true,
        //     checked: true,
        //     minZoom: 9,
        //     maxZoom: 13,
        //     ol: null
        // },
        // vial: {
        //     tipo: "wms",  // Tipos vt: Vector Tile, wms, wfs
        //     id: "vial_wms",
        //     url: "https://geoserverportal.dane.gov.co/geoserver2/postgis/wms",
        //     layer: 'postgis:RED_VIAL',
        //     title: 'Red Vial Nacional (INVIAS)',
        //     visible: false,
        //     checked: false,
        //     minZoom: 9,
        //     maxZoom: 13,
        //     ol: null
        // },
        // resguardos: {
        //     tipo: "wms",  // Tipos vt: Vector Tile, wms, wfs
        //     id: "resguardos_wms",
        //     url: "https://geoserverportal.dane.gov.co/geoserver2/postgis/wms",
        //     layer: 'postgis:RESGU_CNPV2018',
        //     title: 'Resguardos indígenas',
        //     visible: false,
        //     checked: false,
        //     minZoom: 9,
        //     maxZoom: 13,
        //     style: {
        //         stroke: {
        //             color: '#7F3872',
        //             width: 1
        //         }
        //     },
        //     ol: null
        // },
        // pnn: {
        //     tipo: "wms",  // Tipos vt: Vector Tile, wms, wfs
        //     id: "pnn_wms",
        //     url: "https://geoserverportal.dane.gov.co/geoserver2/dig/wms",
        //     layer: 'dig:PARQUES_NATURALES',
        //     title: 'Parques nacionales naturales',
        //     visible: false,
        //     checked: false,
        //     minZoom: 9,
        //     maxZoom: 13,
        //     style: {
        //         stroke: {
        //             color: '#7F3872',
        //             width: 1
        //         }
        //     },
        //     ol: null
        // },
        // cmn: {
        //     tipo: "wms",  // Tipos vt: Vector Tile, wms, wfs
        //     id: "cmn_wms",
        //     url: "https://geoserverportal.dane.gov.co/geoserver2/dig/wms",
        //     layer: 'dig:CONSEJOS_COM_NEGROS',
        //     title: 'Territorios colectivos de comunidades negras',
        //     visible: false,
        //     checked: false,
        //     minZoom: 9,
        //     maxZoom: 13,
        //     style: {
        //         stroke: {
        //             color: '#7F3872',
        //             width: 1
        //         }
        //     },
        //     ol: null
        // },
        // zrc: {
        //     tipo: "wms",  // Tipos vt: Vector Tile, wms, wfs
        //     id: "zrc_wms",
        //     url: "https://geoserverportal.dane.gov.co/geoserver2/dig/wms",
        //     layer: 'dig:ZONAS_RESERVA_CAMPESINA',
        //     title: 'Zonas de reserva campesina',
        //     visible: false,
        //     checked: false,
        //     minZoom: 9,
        //     maxZoom: 13,
        //     style: {
        //         stroke: {
        //             color: '#7F3872',
        //             width: 1
        //         }
        //     },
        //     ol: null
        // },
        // veredas: {
        //     tipo: "wms",  // Tipos vt: Vector Tile, wms, wfs
        //     id: "veredas_wms",
        //     url: "https://geoserverportal.dane.gov.co/geoserver2/postgis/wms",
        //     layer: 'postgis:VEREDAS_2017',
        //     title: 'Nivel de referencia de veredas',
        //     visible: false,
        //     checked: false,
        //     minZoom: 9,
        //     maxZoom: 13,
        //     style: {
        //         stroke: {
        //             color: '#7F3872',
        //             width: 1
        //         }
        //     },
        //     ol: null
        // },
    },
    // checkedLayers :{},
    // changeLoader: null,
    layersInMap: [],
    consulta: "as",
    tematica: JSON.parse(localStorage.getItem('tematica')) != null ? JSON.parse(localStorage.getItem('tematica')) : {
        "GRUPOS": {},
        "SUBGRUPOS": {},
        "TEMAS": [],
        "CATEGORIAS": {}
    },
    tema: null,
    dataArrayDatosMpio: {},
    dataArrayDatos: {},
    dataArrayDatosManzana: {},
    dataRangos: JSON.parse(localStorage.getItem('rangos')) != null ? JSON.parse(localStorage.getItem('rangos')) : {},
    dataRangos: {},
    dataChart: {},
    changeTheme: null,
    coloresLeyend: JSON.parse(localStorage.getItem('leyenda')) != null ? JSON.parse(localStorage.getItem('leyenda')) : {},
    coloresLeyend: {},
    changeLegend: null,
    changeChart: null,
    changeMap: null,
    queryText: {},
    alias: null,
    valorTotal: null,
    pintarCluster: null,
    capas: {},
    legenTheme: null,
    legendChange: null,
    tipoVar: null,
    thematicTheme: null,
    tansparency: 10,
    listaVariables: [],
    labelsData: [],
    dataPie: [],
    changeLoader: null,
    changeData: null,
    updateData: null,
    filterGeo: null,
    deptoSelected: null,
    deptoSelectedFilter: null,
    deptoVariable: null,
    currentZoom: null,
    changeBarChartData: null,
    changePieChartData: null,
    changeDonuChartData: null,
    changeGaugeChartData: null,
    visualGroup: null,
    visualThematic: null,
    state: {
        labels: [],

        datasets: [
            {
                label: '',
                // labels: myLabels,
                backgroundColor: [],
                data: []
            }
        ]
    },
    structureUE: {
        "M": "Manzana",
        "E": "Edificación",
        "UE": "Unidad económica",
        "U": "Unidad",
        "EO": "Cantidad de unidades ocupadas",
        "ED": "Cantidad de unidades desocupadas",
        "EB": "Cantidad de unidades en obra",
        "EF": "Cantidad de unidades fijas",
        "ES": "Cantidad de unidades semifijas",
        "PM": "Cantidad de puestos móviles",
        "VA": "Cantidad de viviendas con actividad económica",
        "OBE": "Cantidad de obras en edificación",
        "SC": "Cantidad de unidades - comercio",
        "SI": "Cantidad de unidades - industria",
        "SS": "Cantidad de unidades - servicios",
        "ST": "Cantidad de unidades - transporte",
        "SCN": "Cantidad de unidades - construcción",
        "SN": "Cantidad de unidades - Sector no aplica",
        "LT": "Latitud",
        "LG": "Longitud",
    },
    unidadesCluster: null,
    distanceCluster: 0,
    loadUE: null,
    changeBaseMap: null,
    activeChart: null,
    baseMapPrev: "Gris",
    changeDepto: null,
    variableAnterior: null,
    municipioSeleccionado: null,
    apiGoogle: 'AIzaSyAOha4Su8EqOFQfDE8NjrS_KdSHfu50WkA',
    changeStyleDepto: null,
    changeStyleMpio: null,
    loadMzCentroids: null,
    unidadesMz: null,
    periodoSeleccionado: { value: '2021-12', label: '2021-12' },
    updatePeriodo: null,
    updatePeriodoHeader: null,
    loadDeptoCentroids: null,
    loadMpioCentroids: null,
    unidadesDepto: null,
    unidadesMpio: null,
    changeVisualization: null,
    updateCharTheme: null,
    updateLegendProportional: null,
    max: null,
    hideProportionalSymbols: null,
    updatePeriodoResult: null,
    periodos: null,
    listaProductos: null,
    productoSeleccionado: null,
    updateListaProductos: null,
    updateProductoSeleccionado: null
}
export const urlDeploy = 'http://localhost:3000/'