import React, { useState } from "react";

const Measure = () => {
    return (
        <div className="toolbar__function filter --visible">
            <h3 className="toolBar__container__panel__functionBox__title"> Medida </h3>
            <div className="toolbar__secondPanelContent">
                <p className="toolbar__secondPanelContent__text">Calcular</p>
                <ul className="measure__list">
                    <li className="measure__item measure__calcular --active" id="measure__distancia">
                        <div className="measure__item__icon">
                            <span className="DANE__Geovisor__icon__route"></span>
                        </div>
                        <p className="measure__item__name">Distancia</p>
                    </li>
                    <li className="measure__item measure__calcular" id="measure__area">
                        <div className="measure__item__icon">
                            <span className="DANE__Geovisor__icon__area"></span>
                        </div>
                        <p className="measure__item__name">Área</p>
                    </li>
                    <li className="measure__item measure__calcular" id="measure__draw">
                        <div className="measure__item__icon">
                            <span className="DANE__Geovisor__icon__draw"></span>
                        </div>
                        <p className="measure__item__name">Dibujar</p>
                    </li>
                </ul>
                <p className="toolbar__secondPanelContent__text">Dibujar</p>
                <ul className="measure__list">
                    <li className="measure__item measure__tipo" id="measure__drawLine">
                        <div className="measure__item__icon">
                            <span className="DANE__Geovisor__icon__drawLine"></span>
                        </div>
                        <p className="measure__item__name">Línea</p>
                    </li>
                    <li className="measure__item measure__tipo --invisible" id="measure__drawSquare">
                        <div className="measure__item__icon">
                            <span className="DANE__Geovisor__icon__drawSquare"></span>
                        </div>
                        <p className="measure__item__name">Cuadrado</p>
                    </li>
                    <li className="measure__item measure__tipo --invisible" id="measure__drawPolygon">
                        <div className="measure__item__icon">
                            <span className="DANE__Geovisor__icon__drawPolygon"></span>
                        </div>
                        <p className="measure__item__name">Polígono</p>
                    </li>
                    <li className="measure__item measure__tipo --invisible" id="measure__drawCircle">
                        <div className="measure__item__icon">
                            <span className="DANE__Geovisor__icon__drawCircle"></span>
                        </div>
                        <p className="measure__item__name">Circulo</p>
                    </li>
                </ul>
                <p className="toolbar__secondPanelContent__text">Resultado</p>
                <p className="toolbar__secondPanelContent__text" id="measure__result"></p>
                <div className="btnContainer borrarFigura">
                    <button className="btnContainer__btn">
                        <div className="btnContainer__icon">
                            <span className="DANE__Geovisor__icon__erase"></span>
                        </div>
                        <p className="btnContainer__name">Borrar figura</p>
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Measure;
