//Importa global styles
import '../styles/main.scss';

//Importa openlayers
import 'ol/ol.css';

//Importa react
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

//Importa Maquetacion Basica
import Header from './layout/header'
import TabsComponent from './layout/navbar';
import Results from './layout/results'; 
import Mapa from './layout/mapa';
import Load from './layout/loader';
import Footer from './layout/footer';
import TableContent from './components/tablecontent';

// Renderiza componentes tomando los id del index.html (layout)
ReactDOM.render(<Results />, document.getElementById('result'));
ReactDOM.render(<Header />, document.getElementById('header'));
ReactDOM.render(<TabsComponent />, document.getElementById('navbar'));
ReactDOM.render(<Mapa />, document.getElementById('mapa'));
ReactDOM.render(<TableContent />, document.getElementById('tableContent'));
ReactDOM.render(<Load />, document.getElementById('loader'));
ReactDOM.render(<Footer />, document.getElementById('footer'));





