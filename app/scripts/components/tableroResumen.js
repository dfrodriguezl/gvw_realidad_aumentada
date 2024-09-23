import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import React from "react";
import Modal from "react-modal";
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import 'react-tabs/style/react-tabs.css';

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

const TableroResumen = ({ isOpen, onClose, datos, setIsOpen }) => {
    // const [modalIsOpen, setIsOpen] = React.useState(false);

    // function openModal() {
    //     setIsOpen(true);
    // }

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

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
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
                    <AccordionItem header="Datos principales">
                        <div class="functionFilter__accordion__panel --open">
                            <ul class="analysisResult__list">
                                <li class="analysisResult__item">
                                    <div class="analysisResult__icon --colorAlternative019">
                                        <span class="DANE__Geovisor__icon__society"></span>
                                    </div>
                                    <h5 class="analysisResult__thirdtitle" id="analysisResult__totalPeople">{Number(datos.total_personas)}</h5>
                                    <p class="analysisResult__text">Total de personas</p>
                                </li>
                                <li class="analysisResult__item">
                                    <div class="analysisResult__icon --colorAlternative006">
                                        <span class="DANE__Geovisor__icon__townPeople"></span>
                                    </div>
                                    <h5 class="analysisResult__thirdtitle" id="analysisResult__totalLEA">{Number(datos.personas_lea)}</h5>
                                    <p class="analysisResult__text">Personas LEA</p>
                                </li>
                                <li class="analysisResult__item">
                                    <div class="analysisResult__icon --colorAlternative005">
                                        <span class="DANE__Geovisor__icon__family"></span>
                                    </div>
                                    <h5 class="analysisResult__thirdtitle" id="analysisResult__totalHogares">{Number(datos.hogares)}</h5>
                                    <p class="analysisResult__text">Hogares</p>
                                </li>
                                <li class="analysisResult__item">
                                    <div class="analysisResult__icon --colorAlternative007">
                                        <span class="DANE__Geovisor__icon__home"></span>
                                    </div>
                                    <h5 class="analysisResult__thirdtitle" id="analysisResult__totalViviendas">{Number(datos.viviendas)}</h5>
                                    <p class="analysisResult__text">Viviendas</p>
                                </li>
                                <li class="analysisResult__item">
                                    <div class="analysisResult__icon --colorAlternative016">
                                        <span class="DANE__Geovisor__icon__homePeople"></span>
                                    </div>
                                    <h5 class="analysisResult__thirdtitle" id="analysisResult__totalPesonaparticular">{Number(datos.personas_lugares_particulares)}</h5>
                                    <p class="analysisResult__text">Personas en lugares particulares</p>
                                </li>
                            </ul>
                        </div>
                    </AccordionItem>
                    <AccordionItem header="Datos de Edificaciones">
                        {/* <div class="functionFilter__accordion__panel --open"> */}
                        <Tabs>
                            <TabList>
                                <Tab>Uso</Tab>
                                <Tab>Uso mixto</Tab>
                                <Tab>Uso no residenciales</Tab>
                            </TabList>

                            <TabPanel>
                                <div class="results__btnPanel UsoEdif edif --active">
                                    <p class="results__panel__title__site">Uso de la edificación</p>
                                    <div class="analysisResult__graph" id="analysisResult__UsoEdificaciones" style={{ maxWidth: '800px', width: '100%', height: '200px' }}>
                                        {/* <canvas id="analysisResult__UsoEdificacion"></canvas> */}
                                        <ResponsivePie
                                            data={dataUsoEdificaciones}
                                            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                                            innerRadius={0.5}
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
                                            animate={true}
                                            motionStiffness={90}
                                            motionDamping={15}
                                            legends={[
                                                {
                                                    anchor: 'top-left',
                                                    direction: 'column',
                                                    justify: false,
                                                    translateX: -70,
                                                    translateY: 80,
                                                    itemWidth: 0,
                                                    itemHeight: 10,
                                                    itemsSpacing: 0,
                                                    symbolSize: 10,
                                                    itemDirection: 'left-to-right'
                                                }
                                            ]}
                                        />
                                    </div>
                                    {/* <ul class="analysisResult__Legend analysisResult__edificaciones"></ul> */}
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div class="results__btnPanel UsoMixEdif edif --active">
                                    <p class="results__panel__title__site">Uso mixto de la edificación</p>
                                    {console.log("DATA MIXTO", dataUsoMixtoEdificaciones )}
                                    <div class="analysisResult__graph" id="analysisResult__UsoMixtoEdificaciones" style={{ maxWidth: '800px', width: '100%', height: '200px' }}>
                                        {/* <canvas id="analysisResult__UsoMixtoEdificacion"></canvas> */}
                                        <ResponsiveBar
                                            data={dataUsoMixtoEdificaciones}
                                            keys={['value']}
                                            indexBy="id"
                                            padding={0.3}
                                            colors={{ scheme: 'set3' }}
                                            axisTop={null}
                                            axisRight={null}
                                            axisBottom={{
                                                tickSize: 5,
                                                tickPadding: 5,
                                                tickRotation: 0,
                                                legend: 'value',
                                                legendPosition: 'middle',
                                                legendOffset: 32
                                            }}
                                            axisLeft={{
                                                tickSize: 5,
                                                tickPadding: 5,
                                                tickRotation: 0,
                                                legendPosition: 'middle',
                                                legendOffset: -40
                                            }}
                                            labelSkipWidth={12}
                                            labelSkipHeight={12}
                                            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                            legends={[
                                                {
                                                    dataFrom: 'keys',
                                                    anchor: 'top-right',
                                                    direction: 'column',
                                                    justify: false,
                                                    translateX: 120,
                                                    translateY: 0,
                                                    itemsSpacing: 2,
                                                    itemWidth: 100,
                                                    itemHeight: 20,
                                                    itemDirection: 'left-to-right',
                                                    itemTextColor: '#000',
                                                    symbolSize: 20,
                                                    effects: [
                                                        {
                                                            on: 'hover',
                                                            style: {
                                                                itemTextColor: '#000'
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]}
                                            animate={true}
                                            motionStiffness={90}
                                            motionDamping={15}
                                        />
                                    </div>
                                    {/* <ul class="analysisResult__Legend analysisResult__edificacionesMixta"></ul> */}
                                </div>
                            </TabPanel>
                            <TabPanel>
                                <div class="results__btnPanel UsoNoResEdif edif --active">
                                    <p class="results__panel__title__site">Uso no Residenciales de la edificación</p>
                                    <div class="analysisResult__graph" id="analysisResult__UsoNoResidencialEdificaciones" style={{ maxWidth: '800px', width: '100%', height: '200px' }}>
                                        {/* <canvas id="analysisResult__UsoNoResidencialEdificacion"></canvas> */}
                                        <ResponsiveBar
                                            data={dataUsoNREdificaciones}
                                            keys={['value']}
                                            indexBy="id"
                                            padding={0.3}
                                            colors={{ scheme: 'set3' }}
                                            axisTop={null}
                                            axisRight={null}
                                            axisBottom={{
                                                tickSize: 5,
                                                tickPadding: 5,
                                                tickRotation: 0,
                                                legend: 'value',
                                                legendPosition: 'middle',
                                                legendOffset: 32
                                            }}
                                            axisLeft={{
                                                tickSize: 5,
                                                tickPadding: 5,
                                                tickRotation: 0,
                                                legendPosition: 'middle',
                                                legendOffset: -40
                                            }}
                                            labelSkipWidth={12}
                                            labelSkipHeight={12}
                                            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                                            legends={[
                                                {
                                                    dataFrom: 'keys',
                                                    anchor: 'top-right',
                                                    direction: 'column',
                                                    justify: false,
                                                    translateX: 120,
                                                    translateY: 0,
                                                    itemsSpacing: 2,
                                                    itemWidth: 100,
                                                    itemHeight: 20,
                                                    itemDirection: 'left-to-right',
                                                    itemTextColor: '#000',
                                                    symbolSize: 20,
                                                    effects: [
                                                        {
                                                            on: 'hover',
                                                            style: {
                                                                itemTextColor: '#000'
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]}
                                            animate={true}
                                            motionStiffness={90}
                                            motionDamping={15}
                                        />
                                    </div>
                                    <ul class="analysisResult__Legend analysisResult__UsoNoResidencialEdificacion"></ul>
                                </div>
                            </TabPanel>
                        </Tabs>

                        {/* <ul class="results__btnTabs">
                                <li class="results__btnTabsItem --active" data-toggle-target=".UsoEdif" data-group=".edif">
                                    <p class="results__btnTabsName">Uso</p>
                                </li>
                                <li class="results__btnTabsItem" data-toggle-target=".UsoMixEdif" data-group=".edif">
                                    <p class="results__btnTabsName">Uso mixto</p>
                                </li>
                                <li class="results__btnTabsItem" data-toggle-target=".UsoNoResEdif" data-group=".edif">
                                    <p class="results__btnTabsName">Uso no Residenciales</p>
                                </li>
                            </ul> */}




                        {/* </div> */}
                    </AccordionItem>
                </Accordion>
                {/* <button class="functionFilter__accordion__btn --active"><span class="functionFilter__accordion__btnIcon DANE__Geovisor__icon__graphBalls"></span>Datos principales</button> */}

                {/* <button class="functionFilter__accordion__btn"><span
                    class="functionFilter__accordion__btnIcon DANE__Geovisor__icon__building"></span>Datos de Edificaciones</button> */}

                {/* <button class="functionFilter__accordion__btn"><span class="functionFilter__accordion__btnIcon DANE__Geovisor__icon__houseHome"></span>Datos de Vivienda</button> */}
                {/* <div class="functionFilter__accordion__panel" id="analysisResult__tipoViviendas">
                    <ul class="results__btnTabs">
                        <li class="results__btnTabsItem --active" data-toggle-target=".TipoViv" data-group=".viv">
                            <p class="results__btnTabsName">Tipo</p>
                        </li>
                        <li class="results__btnTabsItem" data-toggle-target=".OcupViv" data-group=".viv">
                            <p class="results__btnTabsName">Ocupación</p>
                        </li>
                        <li class="results__btnTabsItem" data-toggle-target=".EstrSegFactEE" data-group=".viv">
                            <p class="results__btnTabsName">Estrato</p>
                        </li>
                        <li class="results__btnTabsItem" data-toggle-target=".ServPubl" data-group=".viv">
                            <p class="results__btnTabsName">Servicios</p>
                        </li>
                    </ul>
                    <div class="results__btnPanel TipoViv viv --active">
                        <p class="results__panel__title__site">Descripción vivienda</p>
                        <div class="analysisResult__graph" id="analysisResult__tipoViviendas">
                            <canvas id="analysisResult__tipoVivienda"></canvas>
                        </div>
                        <ul class="analysisResult__Legend analysisResult__tipoVivienda"></ul>
                    </div>
                    <div class="results__btnPanel OcupViv viv">
                        <p class="results__panel__title__site">Ocupación de la vivienda</p>
                        <div class="analysisResult__graph" id="analysisResult__ocupacionViviendas">
                            <canvas id="analysisResult__ocupacionVivienda"></canvas>
                        </div>
                        <ul class="analysisResult__Legend analysisResult__ocupacionVivienda"></ul>
                    </div>
                    <div class="results__btnPanel EstrSegFactEE viv">
                        <p class="results__panel__title__site">Estrato según factura de energía Eléctrica</p>
                        <div class="analysisResult__graph" id="analysisResult__estratoSegunFactEE">
                            <canvas id="analysisResult__estrSegunFactEE"></canvas>
                        </div>
                        <ul class="analysisResult__Legend analysisResult__estratoSegunFactEE"></ul>
                    </div>
                    <div class="results__btnPanel ServPubl viv">
                        <p class="results__panel__title__site">Servicios Públicos</p>
                        <ul class="analysisResult__SPGraphs">
                            <li class="analysisResult__SPGraphItem">
                                <div class="analysisResult__SPGraphIcon">
                                    <span class="DANE__Geovisor__icon__bulb --colorFifth"></span>
                                </div>
                                <p class="results__panel__title__themeName">Energía Eléctrica</p>
                                <div class="analysisResult__SPGraph" id="analysisResult__SPGraphEE">
                                    <canvas id="analysisResult__estFactEE"></canvas>
                                </div>
                                <ul class="analysisResult__Legend analysisResult__SPGraphEE"></ul>
                            </li>
                            <li class="analysisResult__SPGraphItem">
                                <div class="analysisResult__SPGraphIcon">
                                    <span class="DANE__Geovisor__icon__aguasResiduales --colorFifth"></span>
                                </div>
                                <p class="results__panel__title__themeName">Acueducto</p>
                                <div class="analysisResult__SPGraph" id="analysisResult__SPGraphAC">
                                    <canvas id="analysisResult__estFactAC"></canvas>
                                </div>
                                <ul class="analysisResult__Legend analysisResult__SPGraphAC"></ul>
                            </li>
                            <li class="analysisResult__SPGraphItem">
                                <div class="analysisResult__SPGraphIcon">
                                    <span class="DANE__Geovisor__icon__tratamientoAguas --colorFifth"></span>
                                </div>
                                <p class="results__panel__title__themeName">Alcantarillado</p>
                                <div class="analysisResult__SPGraph" id="analysisResult__SPGraphAL">
                                    <canvas id="analysisResult__estFactAL"></canvas>
                                </div>
                                <ul class="analysisResult__Legend analysisResult__SPGraphAL"></ul>
                            </li>
                            <li class="analysisResult__SPGraphItem">
                                <div class="analysisResult__SPGraphIcon">
                                    <span class="DANE__Geovisor__icon__trash --colorFifth"></span>
                                </div>
                                <p class="results__panel__title__themeName">Recolección de basuras</p>
                                <div class="analysisResult__SPGraph" id="analysisResult__SPGraphBA">
                                    <canvas id="analysisResult__estFactBA"></canvas>
                                </div>
                                <ul class="analysisResult__Legend analysisResult__SPGraphBA"></ul>
                            </li>
                            <li class="analysisResult__SPGraphItem">
                                <div class="analysisResult__SPGraphIcon">
                                    <span class="DANE__Geovisor__icon__naturalGas --colorFifth"></span>
                                </div>
                                <p class="results__panel__title__themeName">Gas natural conectado a red pública</p>
                                <div class="analysisResult__SPGraph" id="analysisResult__SPGraphGA">
                                    <canvas id="analysisResult__estFactGA"></canvas>
                                </div>
                                <ul class="analysisResult__Legend analysisResult__SPGraphGA"></ul>
                            </li>
                            <li class="analysisResult__SPGraphItem">
                                <div class="analysisResult__SPGraphIcon">
                                    <span class="DANE__Geovisor__icon__intenet --colorFifth"></span>
                                </div>
                                <p class="results__panel__title__themeName">Internet</p>
                                <div class="analysisResult__SPGraph" id="analysisResult__SPGraphI">
                                    <canvas id="analysisResult__estFactI"></canvas>
                                </div>
                                <ul class="analysisResult__Legend analysisResult__SPGraphI"></ul>
                            </li>
                        </ul>
                    </div>
                </div> */}
                {/* <button class="functionFilter__accordion__btn --active"><span class="functionFilter__accordion__btnIcon DANE__Geovisor__icon__family"></span>Datos de personas</button> */}
                {/* <div class="functionFilter__accordion__panel --open">
                    <ul class="results__btnTabs">
                        <li class="results__btnTabsItem --active" data-toggle-target=".PobSexo" data-group=".pers">
                            <p class="results__btnTabsName">Sexo</p>
                        </li>
                        <li class="results__btnTabsItem" data-toggle-target=".GrupDec" data-group=".pers">
                            <p class="results__btnTabsName">Edades</p>
                        </li>
                        <li class="results__btnTabsItem" data-toggle-target=".Edu" data-group=".pers">
                            <p class="results__btnTabsName">Educación</p>
                        </li>
                    </ul>
                    <div class="results__btnPanel PobSexo --active pers">
                        <p class="results__panel__title__site">Población por sexo</p>
                        <div class="analysisResult__graph" id="analysisResult__total">
                            <ul class="analysisResult__sexList">
                                <li class="analysisResult__sexitem">
                                    <div class="analysisResult__sexicon --colorAlternative007">
                                        <span class="DANE__Geovisor__icon__Man2"></span>
                                    </div>
                                    <div class="analysisResult__sextextZone">
                                        <h4 class="analysisResult__sexName --colorAlternative007">Hombres</h4>
                                        <p class="analysisResult__sexValue" id="valueMen"></p>
                                        <h5 class="analysisResult__sexPercentage" id="percentageMen"></h5>
                                    </div>
                                </li>
                                <li class="analysisResult__sexitem">
                                    <div class="analysisResult__sexicon --colorThird">
                                        <span class="DANE__Geovisor__icon__Women2"></span>
                                    </div>
                                    <div class="analysisResult__sextextZone">
                                        <h4 class="analysisResult__sexName --colorThird">Mujeres</h4>
                                        <p class="analysisResult__sexValue" id="valueGirl"></p>
                                        <h5 class="analysisResult__sexPercentage" id="percentageGirl"></h5>
                                    </div>
                                </li>
                            </ul>
                            <p class="analysisResult__totalText">Población Total: </p>
                        </div>
                    </div>
                    <div class="results__btnPanel GrupDec pers">
                        <p class="results__panel__title__site">Grupos Decenales</p>
                        <div class="analysisResult__graph" id="analysisResult__gruposDecenales">
                            <canvas id="analysisResult__gruposDecenal"></canvas>
                        </div>
                        <ul class="analysisResult__Legend analysisResult__gruposDecenal"></ul>
                    </div>
                    <div class="results__btnPanel Edu pers">
                        <p class="results__panel__title__site">Educación</p>
                        <div class="analysisResult__graph" id="analysisResult__educacion">
                            <canvas id="analysisResult__edu"></canvas>
                        </div>
                        <ul class="analysisResult__Legend analysisResult__educacion"></ul>
                    </div>
                </div> */}
                <div class="results__panel__source">
                    <p class="results__panel__source__name">Fuente: <a rel="noreferrer" title="Censo Nacional 2018" href="#" target="_blank" class="map__source__link"> Censo Nacional de Población y Vivienda 2018</a></p>
                </div>
            </div>
        </Modal>

    )
}

export default TableroResumen;