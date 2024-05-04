import React, { useState, Fragment, useEffect } from "react"
import { variables } from "../base/variables";
import { servidorQuery2 } from "../base/request";

const SearchPlace = (props) => {
    const { texto } = props;
    const [candidates, setCandidates] = useState();

    useEffect(() => {
        const urlSearchPlace = variables.urlPlacesGoogle + "?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&input=" + texto + "&inputtype=textquery&key=" + variables.apiGoogle;

        servidorQuery2(urlSearchPlace).then((res) => {
            setCandidates(res.data.candidates)
        })
    }, [texto])


    const handleClickGoogle = (extent) => {
        const northeast = extent.northeast;
        const southwest = extent.southwest;
        let boundary = [[northeast.lng, northeast.lat], [southwest.lng, southwest.lat]];
        variables.map.fitBounds(boundary);
        variables.map.fire('flystart');
    }


    return (
        <Fragment>
            {
                candidates ?
                    candidates.map((candidate, index) =>
                    (<li className="search__list__item" id="25" key={index} onClick={() => handleClickGoogle(candidate.geometry.viewport)}>
                        <p className="search__list__item__text">
                            <span className="search__list__item__code">{candidate.name}</span>  -  {candidate.formatted_address}
                        </p>
                    </li>)
                    ) : null
            }
        </Fragment>
    )

}

export default SearchPlace;