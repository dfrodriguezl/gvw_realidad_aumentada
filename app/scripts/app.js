import React, { Fragment } from "react";
import Results from "./layout/results";
import Header from "./layout/header";
import TabsComponent from "./layout/navbar";
import Mapa from "./layout/mapa";
import TableContent from "./components/tablecontent";
import Load from "./layout/loader";
import Footer from "./layout/footer";

const App = () => {

    return (
        <Fragment>
            <Header />
            <Load />
            <section className="Geovisor">
                <div className="Geovisor__content">
                    <TabsComponent />
                    <Mapa />
                    <Results />
                </div>
                <TableContent />
                <div id="popup" className="ol-popup">
                    <a href="#" id="popup-closer" className="ol-popup-closer"></a>
                    <div id="popup-content"></div>
                </div>
            </section>
            <Footer />
        </Fragment>

    )
}

export default App;