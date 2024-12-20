import React, { useEffect, useState } from "react";
import Modali, { useModali } from 'modali';
import BaseMap from '../components/basemap';
import Capas from '../components/capas';
import Temas from './searchMain';

import { variables } from '../base/variables';
import RouterGoogle from "../components/routerGoogle";
import Filter from "../components/locationFilter";

const Modal = () => {
    const [helpModal, toggleHelpModal] = useModali();
    const [helpModal2, toggleHelpModal2] = useModali();
    const [helpModal3, toggleHelpModal3] = useModali();
    const [helpModal4, toggleHelpModal4] = useModali();
    const [helpModal5, toggleHelpModal5] = useModali();
    const [visible, setVisible] = useState(false);


    variables.prenderLegend = function () {
        setVisible(true);
    }

    const changeClickPlus = () => {
        setVisible(false);
        variables.apagarLegend();
    }

    variables.hideLegendButton = function () {
        setVisible(false);
    }

    return (
        <>
            <div>
                <div className="navBar__list__item__btn" onClick={toggleHelpModal5}>
                    <div className="filter__thematicGroup__icon --backgroundPrincipal --colorWhite">
                        <span className="DANE__Geovisor__icon__searchGeo"></span>
                    </div>
                </div>
                <Modali.Modal {...helpModal5}>
                    <Filter />
                </Modali.Modal>
            </div>
            <div>
                <div className="navBar__list__item__btn" onClick={toggleHelpModal}>
                    <div className="filter__thematicGroup__icon --backgroundPrincipal --colorWhite">
                        <span className="DANE__Geovisor__icon__searchTheme"></span>
                    </div>
                    {/* <p className="navBar__iconName">Ayuda</p> */}
                </div>
                <Modali.Modal {...helpModal}>
                    <Temas />
                </Modali.Modal>
            </div>
            <div>
                <div className="navBar__list__item__btn" onClick={toggleHelpModal2}>
                    <div className="filter__thematicGroup__icon --backgroundPrincipal --colorWhite">
                        <span className="DANE__Geovisor__icon__layers"></span>
                    </div>
                </div>
                <Modali.Modal {...helpModal2}>
                    <Capas />
                </Modali.Modal>
            </div>
            <div>
                <div className="navBar__list__item__btn" onClick={toggleHelpModal3}>
                    <div className="filter__thematicGroup__icon --backgroundPrincipal --colorWhite">
                        <span className="DANE__Geovisor__icon__baseMap"></span>
                    </div>
                </div>
                <Modali.Modal {...helpModal3}>
                    <BaseMap />
                </Modali.Modal>
            </div>
            <div>
                <div className="navBar__list__item__btn" onClick={toggleHelpModal4}>
                    <div className="filter__thematicGroup__icon --backgroundPrincipal --colorWhite">
                        <span className="DANE__Geovisor__icon__route"></span>
                    </div>
                </div>
                <Modali.Modal {...helpModal4}>
                    <RouterGoogle />
                </Modali.Modal>
            </div>

            {visible &&
                <div>
                    <div className="navBar__list__item__btn" onClick={changeClickPlus}>
                        <div className="filter__thematicGroup__icon --backgroundPrincipal --colorWhite">
                            <span className="DANE__Geovisor__icon__List"></span>
                        </div>
                        {/* <p className="navBar__iconName">Ayuda 2</p> */}
                    </div>
                </div>}
        </>
    );
};

export default Modal;

