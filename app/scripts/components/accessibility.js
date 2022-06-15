import React, { useEffect, Fragment, useState, useRef } from 'react';
import { useDetectOutsideClick } from "../layout/useDetectOutsideClick";


const AccessibilityTool = () => {
    const dropdownRef = useRef(null);
    const [isActive, setIsActive] = useDetectOutsideClick(dropdownRef, false);
    const onClick = () => setIsActive(!isActive);
    const [fontSize, changeFontSize] = useState("16px");
    const [active, setActive] = useState(localStorage.getItem("accesibility") === "grayscale" ? true : false);

    useEffect(() => {
        document
            .getElementsByTagName("HTML")[0]
            .setAt
    }, []);

    function changeClickPlus() {
        let count = `${parseInt(fontSize) + 1}px`
        document
            .getElementById('root').style.fontSize = count
        changeFontSize(fontSize => `${parseInt(fontSize) + 1}px`);
    }
    function changeClickLess() {
        let count = `${parseInt(fontSize) - 1}px`
        // console.log(count, "contador font")
        document
            .getElementById('root').style.fontSize = count
        changeFontSize(fontSize => `${parseInt(fontSize) - 1}px`);
    }

    const handleClick = () => {
        if (active === false) {
            localStorage.setItem("accesibility", "grayscale");
            document
                .getElementsByTagName("HTML")[0]
                .setAttribute("data-theme", localStorage.getItem("accesibility"));
            setActive(true);
        } else {
            localStorage.setItem("accesibility", "");
            document
                .getElementsByTagName("HTML")[0]
                .setAttribute("data-theme", localStorage.getItem("accesibility"));
            setActive(false);
        }
    }

    return (
        <Fragment>
            <div ref={dropdownRef} className={`accessibility__pannel ${isActive ? "active" : "inactive"}`}>
                <ul className="accessibility__list">
                    <li style={{ fontSize }} onClick={changeClickLess} className="accessibility__list__item" title="Reducir el tamaño de la letra">
                        <div className="accessibility__list__item__icon">
                            <span className="DANE__Geovisor__icon__fontDecrease"></span>
                        </div>
                    </li>
                    <li style={{ fontSize }} onClick={changeClickPlus} className="accessibility__list__item" title="Aumentar el tamaño de la letra">
                        <div className="accessibility__list__item__icon">
                            <span className="DANE__Geovisor__icon__fontIncrease"></span>
                        </div>
                    </li>
                    <li className="accessibility__list__item" title="Convertir a escala de grises" defaultChecked={active}
                        onClick={() => handleClick()}>
                        <div className="accessibility__list__item__icon">
                            <span className="DANE__Geovisor__icon__grayscale"></span>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="accessibility__icon" >
                <div className="accessibility__icon__item" title="Accesibilidad">
                    <div onClick={onClick} className="accessibility__list__item__icon">
                        <span className="DANE__Geovisor__icon__accessibility"></span>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default AccessibilityTool;

