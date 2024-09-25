import React, { useEffect, useState } from "react";
import Modali, { useModali } from 'modali';
import BaseMap from '../components/basemap';
import Capas from '../components/capas';
import Temas from './searchMain';

import { variables } from '../base/variables';

const Modal = () => {
    const [helpModal, toggleHelpModal] = useModali();
    const [helpModal2, toggleHelpModal2] = useModali();
    const [helpModal3, toggleHelpModal3] = useModali();
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
                <div className="navBar__list__item__btn" onClick={toggleHelpModal}>
                    <div className="filter__thematicGroup__icon --backgroundPrincipal --colorWhite">
                        <span className="DANE__Geovisor__icon__searchGeo"></span>
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

