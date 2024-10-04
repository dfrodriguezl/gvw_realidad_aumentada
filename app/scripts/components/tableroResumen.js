import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import React from "react";
import Modal from "react-modal";
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import { variables } from "../base/variables";

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const TableroResumen = ({ isOpen, onClose, datos, setIsOpen, props }) => {

    const data = [
        { id: 'A', value: 100 },
        { id: 'B', value: 200 },
        { id: 'C', value: 300 },
        { id: 'D', value: 400 },
    ];

    const dataUsoEdificaciones = [
        { id: "Vivienda", value: Number(datos.uso_vivienda), color: "hsl(230,69%,10%)" },
        { id: "Mixto", value: Number(datos.uso_mixto), color: "hsl(163,80%,59%)" },
        { id: "Unidad No Residencial", value: Number(datos.uso_no_residencial), color: "hsl(178,53%,37%)" },
        { id: "Lugar especial de alojamiento - LEA", value: Number(datos.uso_lea), color: "hsl(210,61%,32%)" }
    ];

    const dataUsoMixtoEdificaciones = [
        { id: "Industria", value: Number(datos.uso_mixto_industria == "" ? "0" : datos.uso_mixto_industria) },
        { id: "Comercio", value: Number(datos.uso_mixto_comercio == "" ? "0" : datos.uso_mixto_comercio) },
        { id: "Servicios", value: Number(datos.uso_mixto_servicios == "" ? "0" : datos.uso_mixto_servicios) },
        { id: "Agropecuario, agroindustrial, forestal", value: Number(datos.uso_mixto_agro == "" ? "0" : datos.uso_mixto_agro) },
        { id: "Sin información", value: Number(datos.uso_mixto_si == "" ? "0" : datos.uso_mixto_si) }
    ];

    const dataUsoNREdificaciones = [
        { id: "Industria", value: Number(datos.uso_nr_industria == "" ? "0" : datos.uso_nr_industria) },
        { id: "Comercio", value: Number(datos.uso_nr_comercio == "" ? "0" : datos.uso_nr_comercio) },
        { id: "Servicios", value: Number(datos.uso_nr_servicios == "" ? "0" : datos.uso_nr_servicios) },
        { id: "Agropecuario, agroindustrial, forestal", value: Number(datos.uso_nr_agro == "" ? "0" : datos.uso_nr_agro) },
        { id: "Institucional", value: Number(datos.uso_nr_institucional == "" ? "0" : datos.uso_nr_institucional) },
        { id: "Lote", value: Number(datos.uso_nr_lote == "" ? "0" : datos.uso_nr_lote) },
        { id: "Parque", value: Number(datos.uso_nr_parque == "" ? "0" : datos.uso_nr_parque) },
        { id: "Minero", value: Number(datos.uso_nr_minero == "" ? "0" : datos.uso_nr_minero) },
        { id: "Protección", value: Number(datos.uso_nr_proteccion == "" ? "0" : datos.uso_nr_proteccion) },
        { id: "Construcción", value: Number(datos.uso_nr_construccion == "" ? "0" : datos.uso_nr_construccion) },
        { id: "Sin información", value: Number(datos.uso_nr_si == "" ? "0" : datos.uso_nr_si) }
    ];
    console.log("DATOS", datos);
    console.log("DATOS EDIF", dataUsoNREdificaciones);

    console.log(props);
    console.log(datos);
    console.log(variables.tematica);

    let groupTemp = variables.tematica.GRUPOS;
    let temasTemp = variables.tematica.TEMAS;

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    const ListAcordeon = () => {
        const mecha = (Object.keys(groupTemp)).map(item2 =>
            <AccordionItem
                header={variables.labels.titulos[groupTemp[item2][0]["GRUPO"]] != undefined ? variables.labels.titulos[groupTemp[item2][0]["GRUPO"]] : groupTemp[item2][0]["GRUPO"]}>
                <TabListAcordeon grupo={groupTemp[item2][0]["COD_GRUPO"]}></TabListAcordeon>
            </AccordionItem>
        )
        return mecha
    }

    const TabListAcordeon = (data) => {
        console.log(data.grupo);
        const key = "COD_SUBGRUPO";
        let dataTemp = [2, 3, 4];
        let dataTemp2 = temasTemp
            .filter((o) => (o.COD_SUBGRUPO).includes(data.grupo))
            .map((filteredResult, index) => {
                let filteredResultTemp = filteredResult;
                filteredResultTemp["COD_GRUPO"] = data.grupo;
                filteredResultTemp["KEY_VAL"] = variables.variablesCNPV[filteredResult["COD_CATEGORIA"]];
                filteredResultTemp["VALUE_PROP"] = props[variables.variablesCNPV[filteredResult["COD_CATEGORIA"]]];
                return (filteredResult)
            }, []).reduce((objectsByKeyValue, obj) => {
                let value = obj[key];
                objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
                return objectsByKeyValue;
            }, {});
        console.log(dataTemp2);

        dataTemp = Object.keys(dataTemp2);
        // console.log(dataTemp3);    
        // console.log(dataTemp);


        let item = <Tabs>
            <TabList>
                {dataTemp.length >= 1 && <Tab>{variables.labels.titulos[dataTemp2[dataTemp[0]][0]["SUBGRUPO"]] != undefined ? variables.labels.titulos[dataTemp2[dataTemp[0]][0]["SUBGRUPO"]] : dataTemp2[dataTemp[0]][0]["SUBGRUPO"]}</Tab>}
                {dataTemp.length >= 2 && <Tab>{variables.labels.titulos[dataTemp2[dataTemp[1]][0]["SUBGRUPO"]] != undefined ? variables.labels.titulos[dataTemp2[dataTemp[1]][0]["SUBGRUPO"]] : dataTemp2[dataTemp[1]][0]["SUBGRUPO"]}</Tab>}
                {dataTemp.length >= 3 && <Tab>{variables.labels.titulos[dataTemp2[dataTemp[2]][0]["SUBGRUPO"]] != undefined ? variables.labels.titulos[dataTemp2[dataTemp[2]][0]["SUBGRUPO"]] : dataTemp2[dataTemp[2]][0]["SUBGRUPO"]}</Tab>}
                {dataTemp.length >= 4 && <Tab>{variables.labels.titulos[dataTemp2[dataTemp[3]][0]["SUBGRUPO"]] != undefined ? variables.labels.titulos[dataTemp2[dataTemp[3]][0]["SUBGRUPO"]] : dataTemp2[dataTemp[3]][0]["SUBGRUPO"]}</Tab>}
                {dataTemp.length >= 5 && <Tab>{variables.labels.titulos[dataTemp2[dataTemp[4]][0]["SUBGRUPO"]] != undefined ? variables.labels.titulos[dataTemp2[dataTemp[4]][0]["SUBGRUPO"]] : dataTemp2[dataTemp[4]][0]["SUBGRUPO"]}</Tab>}
            </TabList>
            {dataTemp.length >= 1 && <TabPanel><ContenidoTab datos={dataTemp2[dataTemp[0]]}></ContenidoTab></TabPanel>}
            {dataTemp.length >= 2 && <TabPanel><ContenidoTab datos={dataTemp2[dataTemp[1]]}></ContenidoTab></TabPanel>}
            {dataTemp.length >= 3 && <TabPanel><ContenidoTab datos={dataTemp2[dataTemp[2]]}></ContenidoTab></TabPanel>}
            {dataTemp.length >= 4 && <TabPanel><ContenidoTab datos={dataTemp2[dataTemp[3]]}></ContenidoTab></TabPanel>}
            {dataTemp.length >= 5 && <TabPanel><ContenidoTab datos={dataTemp2[dataTemp[4]]}></ContenidoTab></TabPanel>}
        </Tabs>;
        return item;
    }

    const ContenidoTab = (data) => {
        console.log(data.datos[0]);
        const dataResult = (data.datos).map((result, index) => {
            let filteredResultTemp = {
                // id: result["CATEGORIA"] + "(" + Number(result["VALUE_PROP"] == "" || result["VALUE_PROP"] == undefined || result["VALUE_PROP"] == null ? "0" : result["VALUE_PROP"]) + ")",
                id: result["CATEGORIA"],
                value: Number(result["VALUE_PROP"] == "" || result["VALUE_PROP"] == undefined || result["VALUE_PROP"] == null ? "0" : result["VALUE_PROP"]),
                color: "hsl(163,80%,59%)"
            }
            return (filteredResultTemp)
        });
        console.log(dataResult);

        return (
            <div class="results__btnPanel UsoMixEdif edif --active">
                <p class="results__panel__title__site" style={{ 'font-weight': 'bold', 'text-align': 'center' }}>{data.datos[0]["SUBGRUPO"]}</p>
                {data.datos[0]["COD_GRUPO"] == "435" && ContenidoUno(dataResult)}
                {(data.datos[0]["COD_GRUPO"] != "435" &&
                    data.datos[0]["COD_SUBGRUPO"] != "43601" &&
                    data.datos[0]["COD_SUBGRUPO"] != "43704" &&
                    data.datos[0]["COD_SUBGRUPO"] != "43801" &&
                    data.datos[0]["COD_SUBGRUPO"] != "43803") && ContenidoDos(dataResult, '200px', "")}
                {(data.datos[0]["COD_SUBGRUPO"] == "43601" ||
                    data.datos[0]["COD_SUBGRUPO"] == "43803") && ContenidoTres(dataResult)}
                {data.datos[0]["COD_SUBGRUPO"] == "43801" && ContenidoCuatro(dataResult)}
                {data.datos[0]["COD_SUBGRUPO"] == "43704" && ContenidoCinco(dataResult)}
            </div>

        )
    }

    const ContenidoUno = (datos) => {
        return (
            <div class="functionFilter__accordion__panel --open">
                <ul class="analysisResult__list">
                    <li class="analysisResult__item">
                        <div class="analysisResult__icon --colorAlternative019">
                            <span class="DANE__Geovisor__icon__society"></span>
                        </div>
                        <h5 class="analysisResult__thirdtitle" id="analysisResult__totalPeople">{datos[0].value}</h5>
                        <p class="analysisResult__text">Total de personas</p>
                    </li>
                    <li class="analysisResult__item">
                        <div class="analysisResult__icon --colorAlternative006">
                            <span class="DANE__Geovisor__icon__townPeople"></span>
                        </div>
                        <h5 class="analysisResult__thirdtitle" id="analysisResult__totalLEA">{datos[1].value}</h5>
                        <p class="analysisResult__text">Personas LEA</p>
                    </li>
                    <li class="analysisResult__item">
                        <div class="analysisResult__icon --colorAlternative005">
                            <span class="DANE__Geovisor__icon__family"></span>
                        </div>
                        <h5 class="analysisResult__thirdtitle" id="analysisResult__totalHogares">{datos[2].value}</h5>
                        <p class="analysisResult__text">Hogares</p>
                    </li>
                    <li class="analysisResult__item">
                        <div class="analysisResult__icon --colorAlternative007">
                            <span class="DANE__Geovisor__icon__home"></span>
                        </div>
                        <h5 class="analysisResult__thirdtitle" id="analysisResult__totalViviendas">{datos[3].value}</h5>
                        <p class="analysisResult__text">Viviendas</p>
                    </li>
                    <li class="analysisResult__item">
                        <div class="analysisResult__icon --colorAlternative016">
                            <span class="DANE__Geovisor__icon__homePeople"></span>
                        </div>
                        <h5 class="analysisResult__thirdtitle" id="analysisResult__totalPesonaparticular">{datos[4].value}</h5>
                        <p class="analysisResult__text">Personas en lugares particulares</p>
                    </li>
                </ul>
            </div>
        )
    }

    const ContenidoDos = (datos, height, titulo) => {
        return (
            <>
                {titulo.length > 0 && <><p class="results__panel__title__site" style={{ 'font-weight': 'bold', 'text-align': 'center' }}>{titulo}</p></>}
                <div class="analysisResult__graph" id="analysisResult__UsoMixtoEdificaciones" style={{ maxWidth: '800px', width: '100%', height: '220px' }}>
                    <ResponsiveBar
                        data={datos}
                        keys={['value']}
                        indexBy="id"
                        margin={{ top: 10, right: 30, bottom: 10, left: 50 }}
                        padding={0.3}
                        valueScale={{ type: 'linear' }}
                        indexScale={{ type: 'band', round: true }}
                        colors={{ scheme: 'nivo' }}
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'country',
                            legendPosition: 'middle',
                            legendOffset: 32,
                            truncateTickAt: 0
                        }}
                        axisLeft={{
                            tickSize: 5,
                            tickPadding: 5,
                            tickRotation: 0,
                            legend: 'food',
                            legendPosition: 'middle',
                            legendOffset: -40,
                            truncateTickAt: 0
                        }}
                        labelSkipWidth={12}
                        labelSkipHeight={12}
                        labelTextColor={{
                            from: 'color',
                            modifiers: [
                                [
                                    'darker',
                                    1.6
                                ]
                            ]
                        }}
                        // legends={[
                        //     {
                        //         dataFrom: 'keys',
                        //         anchor: 'bottom-right',
                        //         direction: 'column',
                        //         justify: false,
                        //         translateX: 120,
                        //         translateY: 0,
                        //         itemsSpacing: 2,
                        //         itemWidth: 100,
                        //         itemHeight: 20,
                        //         itemDirection: 'left-to-right',
                        //         itemOpacity: 0.85,
                        //         symbolSize: 20,
                        //         effects: [
                        //             {
                        //                 on: 'hover',
                        //                 style: {
                        //                     itemOpacity: 1
                        //                 }
                        //             }
                        //         ]
                        //     }
                        // ]}
                    />
                </div>
            </>
        )
    }

    const ContenidoTres = (datos) => {
        return (
            <div class="analysisResult__graph" id="analysisResult__UsoEdificaciones" style={{ maxWidth: '800px', width: '100%', height: '200px' }}>
                <ResponsivePie
                    data={datos}
                    margin={{ top: 10, right: 30, bottom: 30, left: 30 }}
                    innerRadius={0.4}
                    padAngle={0.7}
                    cornerRadius={3}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    radialLabelsSkipAngle={10}
                    radialLabelsTextXOffset={6}
                    radialLabelsTextColor="#333333"
                    radialLabelsLinkOffset={0}
                    radialLabelsLinkDiagonalLength={16}
                    radialLabelsLinkHorizontalLength={24}
                    radialLabelsLinkStrokeWidth={1}
                    radialLabelsLinkColor={{ from: 'color' }}
                    slicesLabelsSkipAngle={10}
                    slicesLabelsTextColor="#333333"
                    enableArcLinkLabels={false}
                    enableArcLabels={false}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                    legends={[
                        {
                            anchor: 'top-left',
                            direction: 'column',
                            justify: false,
                            translateX: -30,
                            translateY: 130,
                            itemWidth: 0,
                            itemHeight: 10,
                            itemsSpacing: 0,
                            symbolSize: 8,
                            itemDirection: 'left-to-right'
                        }
                    ]}
                />
            </div>
        )
    }

    const ContenidoCuatro = (datos) => {
        return (
            <div class="analysisResult__graph" id="analysisResult__total" style={{ maxWidth: '800px', width: '100%', height: '200px' }}>
                <ul class="analysisResult__sexList">
                    <li class="analysisResult__sexitem">
                        <div class="analysisResult__sexicon --colorAlternative007">
                            <span class="DANE__Geovisor__icon__Man2"></span>
                        </div>
                        <div class="analysisResult__sextextZone">
                            <h4 class="analysisResult__sexName --colorAlternative007">Hombres</h4>
                            <p class="analysisResult__sexValue" id="valueMen">{datos[0].value}</p>
                            <h5 class="analysisResult__sexPercentage" id="percentageMen">{(((datos[0].value) * 100) / (datos[0].value + datos[1].value)).toFixed(2)} %</h5>
                        </div>
                    </li>
                    <li class="analysisResult__sexitem">
                        <div class="analysisResult__sexicon --colorThird">
                            <span class="DANE__Geovisor__icon__Women2"></span>
                        </div>
                        <div class="analysisResult__sextextZone">
                            <h4 class="analysisResult__sexName --colorThird">Mujeres</h4>
                            <p class="analysisResult__sexValue" id="valueGirl">{datos[1].value}</p>
                            <h5 class="analysisResult__sexPercentage" id="percentageGirl">{(((datos[1].value) * 100) / (datos[0].value + datos[1].value)).toFixed(2)} %</h5>
                        </div>
                    </li>
                </ul>
                <p class="analysisResult__totalText">Población Total: {datos[0].value + datos[1].value}</p>
            </div>
        )
    }

    const ContenidoCinco = (datos) => {
        const grupos = ["energía", "acueducto", "alcantarillado", "gas", "basuras", "Internet"];
        let jvv = grupos.map((value, index) => {
            const filtrado = datos.filter((o) => (o.id).includes(value))
            return <>
                {ContenidoDos(filtrado, '40px', value)}
            </>
        });
        return jvv;
    }

    return (
        <Modal
            isOpen={isOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <div className="ol-popup-closer" onClick={closeModal}></div>
            <div class="results__panel analisis">
                <Accordion>
                    <ListAcordeon></ListAcordeon>
                </Accordion>
                <div class="results__panel__source">
                    <p class="results__panel__source__name">Fuente: <a rel="noreferrer" title="Censo Nacional 2018" href="#" target="_blank" class="map__source__link"> Censo Nacional de Población y Vivienda 2018</a></p>
                </div>
            </div>
        </Modal>
    )
}

export default TableroResumen;