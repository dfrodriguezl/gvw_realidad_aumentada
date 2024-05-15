import React, { useState, useEffect } from 'react';
import Search from '../layout/search';

const resultados = false


const Temas = () => {
    return (
        <div className="toolbar__function filter --visible">
            <h3 className="toolBar__container__panel__functionBox__title"> Temas </h3>
                <Search filterSearch={resultados} placeholder="Escriba una temática"/>
        </div>
    );
};
export default Temas;