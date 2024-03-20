import React, { useState, useEffect } from 'react';
import Search from '../components/search';

const resultados = false


const SeachMain = () => {
    return (
        <Search filterSearch={resultados} placeholder="Escriba un indicador" />
    );
};
export default SeachMain;