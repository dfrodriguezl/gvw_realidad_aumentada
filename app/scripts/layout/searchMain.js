import React, { useState, useEffect } from 'react';
import Search from '../components/search';

const resultados = false


const SeachMain = () => {
    return (
        // <div className="toolbar__function filter" >
                <Search filterSearch={resultados} placeholder="Escriba un indicador"/>
        // </div>
    );
};
export default SeachMain;