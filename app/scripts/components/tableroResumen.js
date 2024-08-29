import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import React from "react";
import Modal from "react-modal";
import { ResponsivePie } from '@nivo/pie';

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

const TableroResumen = ({ isOpen, onClose, datos }) => {
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

    console.log("DATOS", datos);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function closeModal() {
        isOpen(false);
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
                        <div class="functionFilter__accordion__panel --open">
                            <ul class="results__btnTabs">
                                <li class="results__btnTabsItem --active" data-toggle-target=".UsoEdif" data-group=".edif">
                                    <p class="results__btnTabsName">Uso</p>
                                </li>
                                <li class="results__btnTabsItem" data-toggle-target=".UsoMixEdif" data-group=".edif">
                                    <p class="results__btnTabsName">Uso mixto</p>
                                </li>
                                <li class="results__btnTabsItem" data-toggle-target=".UsoNoResEdif" data-group=".edif">
                                    <p class="results__btnTabsName">Uso no Residenciales</p>
                                </li>
                            </ul>

                            <div class="results__btnPanel UsoEdif edif --active">
                                <p class="results__panel__title__site">Uso de la edificación</p>
                                <div class="analysisResult__graph" id="analysisResult__UsoEdificaciones">
                                    {/* <canvas id="analysisResult__UsoEdificacion"></canvas> */}
                                    <ResponsivePie
                                        data={data}
                                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                                        innerRadius={0.5}
                                        padAngle={0.7}
                                        cornerRadius={3}
                                        colors={{ scheme: 'nivo' }}
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
                                    />
                                </div>
                                {/* <ul class="analysisResult__Legend analysisResult__edificaciones"></ul> */}
                            </div>
                            <div class="results__btnPanel UsoMixEdif edif">
                                <p class="results__panel__title__site">Uso mixto de la edificación</p>
                                <div class="analysisResult__graph" id="analysisResult__UsoMixtoEdificaciones">
                                    <canvas id="analysisResult__UsoMixtoEdificacion"></canvas>
                                </div>
                                <ul class="analysisResult__Legend analysisResult__edificacionesMixta"></ul>
                            </div>
                            <div class="results__btnPanel UsoNoResEdif edif">
                                <p class="results__panel__title__site">Uso no Residenciales de la edificación</p>
                                <div class="analysisResult__graph" id="analysisResult__UsoNoResidencialEdificaciones">
                                    <canvas id="analysisResult__UsoNoResidencialEdificacion"></canvas>
                                </div>
                                <ul class="analysisResult__Legend analysisResult__UsoNoResidencialEdificacion"></ul>
                            </div>
                        </div>
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