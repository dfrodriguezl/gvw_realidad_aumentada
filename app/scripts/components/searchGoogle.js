import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import { boundingExtent } from 'ol/extent';
import { transformExtent } from 'ol/proj';
import { variables } from '../base/variables';

import maplibregl from 'maplibre-gl';


function extentResult(bbox1, bbox2, transfor) {
    console.log(bbox1[0], bbox1[1]);
    console.log(bbox2[0], bbox2[1]);
    let sw = new maplibregl.LngLat(bbox1[0], bbox1[1]);
    let ne = new maplibregl.LngLat(bbox2[0], bbox2[1]);
    let llb = new maplibregl.LngLatBounds(sw, ne);

    variables.map.fitBounds(llb, {
        padding: 20
    });
}

const SearchGoogle = () => {

    useEffect(() => {
        const input = document.getElementById("searchPoint");
        const searchBox = new google.maps.places.SearchBox(input);
        searchBox.addListener("places_changed", () => {
            console.log("vamos los rojos");
            const places = searchBox.getPlaces();

            if (places.length == 0) {
                return;
            }
            places.forEach((place) => {
                if (!place.geometry || !place.geometry.location) {
                    console.log("Returned place contains no geometry");
                    return;
                }
                const icon = {
                    url: place.icon,
                    title: place.name,
                    position: place.geometry.location,
                    bounds: place.geometry.viewport
                }

                if(variables.marker != undefined){
                    variables.marker.remove();
                }

                variables.marker = new maplibregl.Marker()
                .setLngLat([icon.position.toJSON().lng, icon.position.toJSON().lat])
                .addTo(variables.map);
                // setPtoInicial(icon);

                // console.log(icon.bounds.toJSON());
                // console.log(icon.position.toJSON());
                // console.log(icon.bounds.Oa.hi, icon.bounds.mb.hi, icon.bounds.Oa.lo, icon.bounds.mb.lo);
                // extentResult([icon.bounds.Oa.hi, icon.bounds.mb.hi], [icon.bounds.Oa.lo, icon.bounds.mb.lo], true);
                // pptoSearch(icon.position.toJSON());
                extentResult([icon.bounds.toJSON().east, icon.bounds.toJSON().north], [icon.bounds.toJSON().west, icon.bounds.toJSON().south], true);

            });
        });
    }, []);

    function handleClickDos(e, valor) {
        console.log("epa ", e, valor);
        document.getElementById("searchPoint").value = "";
        if(variables.marker != undefined){
            variables.marker.remove();
        }
    }

    return (
        <div className="toolBar__container__panel__functionBox__inputContainer">
            <div className="toolBar__container__panel__functionBox__inputContainer__icon">
                <span className="DANE__Geovisor__icon__location"></span>
            </div>
            <input
                type="text"
                name="searchPoint"
                id="searchPoint"
                placeholder="Clic en este campo de texto y luego en el mapa"
                className="toolBar__container__panel__functionBox__inputConainer__textInput"
            />
            <button className="toolBar__container__panel__functionBox__inputContainer__addPointButton" name="searchPoint" onClick={() => handleClickDos("measure__drawPoint", "searchPoint")}>
                <span className="DANE__Geovisor__icon__erase"></span>
            </button>
            <p className="toolBar__container__panel__functionBox__inputContainer__errorMessage">Debe ingresar un punto de
                partida. Ejemplo: Cra. 59 #26-60, Bogotá</p>
        </div>
    );
};
export default SearchGoogle;

