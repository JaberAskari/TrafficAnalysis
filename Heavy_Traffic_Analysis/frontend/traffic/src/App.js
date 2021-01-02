import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import Footer from "./components/Footer";
import OneDayGraph from "./components/Cars/OneDayGraph_v2";
import MultipleDayGraph from "./components/Cars/MultipleDayGraph";
import Compare2Days from "./components/Cars/Compare2Days";
import CompareMultipleDays from "./components/Cars/CompareMultipleDays";
import NavBarmenu from "./components/NavBarMenu";
import MapLeaflet from "./components/Trains/MapLeaflet";
import WelcomePage from "./components/WelcomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import urlPathPrefix from "./components/UrlPathPrefix";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBarmenu />
        <div className="container-liquid" style={{}}>
          <Route exact path={`${urlPathPrefix}/`} component={WelcomePage} />
          <Route path={`${urlPathPrefix}/vehicles/onedaygraph`} component={OneDayGraph} />
          <Route
            path={`${urlPathPrefix}/vehicles/multipledaygraph`}
            component={MultipleDayGraph}
          />
          <Route path={`${urlPathPrefix}/vehicles/compare2days`} component={Compare2Days} />
          <Route
            path={`${urlPathPrefix}/vehicles/comparemultipledays`}
            component={CompareMultipleDays}
          />
          {/* <Route path="/trains/MapFinland" component={MapFinland} /> */}

          <Route path={`${urlPathPrefix}/trains/MapFinland`} component={MapLeaflet} />
        </div>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
