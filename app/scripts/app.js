import React, { Fragment, useState } from "react";
import Results from "./layout/results";
import Header from "./layout/header";
import TabsComponent from "./layout/navbar";
import Mapa from "./layout/mapa";
import TableContent from "./components/tablecontent";
import Load from "./layout/loader";
import Footer from "./layout/footer";
import DashboardPanel from "./layout/dasboardPanel";

const App = () => {
    const [activeTab, setActiveTab] = useState(2); // Initial tab index

    return (
        <Fragment>
            <Header />
            <Load />
            <section className="Geovisor">
                <div className="Geovisor__content">
                    <TabsComponent activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div id="mapa" style={{ display: activeTab === 2 ? 'block' : 'none' }}>
                        <Mapa />
                    </div>
                </div>
                <div id="results" style={{ display: activeTab === 2 ? 'block' : 'none' }}>
                    <Results />
                </div>
                {activeTab === 0 && <DashboardPanel />}
                <div id="modal-container"></div>
                {/* <TableContent />*/}
            </section>
            <Footer />
        </Fragment>
    );
}

export default App;
