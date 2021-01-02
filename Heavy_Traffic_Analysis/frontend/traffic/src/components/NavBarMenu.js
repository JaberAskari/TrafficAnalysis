import React, { Component } from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import urlPathPrefix from "./UrlPathPrefix";

import Home from "@material-ui/icons/HomeRounded";
import Car from "@material-ui/icons/DirectionsCarRounded";
import Boat from "@material-ui/icons/DirectionsBoatRounded";
import Train from "@material-ui/icons/TrainRounded";
import Compare from "@material-ui/icons/CompareArrowsSharp";
import Graph from "@material-ui/icons/TimelineRounded";

class NavBarMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <Navbar expand="lg" className="navbarmenu" variant="dark">
          <Navbar.Brand className="nav-brand" href={`${urlPathPrefix}/`}>
            Traffic Analysis
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto" style={{ color: "red" }}>
              <div style={{ padding: 5, marginRight: 20 }}>
                <Nav.Link className="link" href={`${urlPathPrefix}/`}>
                  <Home className="navIcons" style={{ marginTop: 0 }} />
                  Home
                </Nav.Link>
              </div>
              <div style={{ padding: 5, marginRight: 30 }}>
                <Car className="navIcons" />
                <NavDropdown title="Vehicles" id="basic-nav-dropdown">
                  <NavDropdown.Item href={`${urlPathPrefix}/vehicles/onedaygraph`}>
                    <Graph style={{ paddingRight: 7, color: "#b3403a" }} />
                    One day analysis
                  </NavDropdown.Item>

                  <NavDropdown.Item href={`${urlPathPrefix}/vehicles/multipledaygraph`}>
                    <Graph style={{ paddingRight: 7, color: "#b3403a" }} />
                    Multiple days analysis
                  </NavDropdown.Item>

                  <NavDropdown.Divider />
                  <NavDropdown.Item href={`${urlPathPrefix}/vehicles/compare2days`}>
                    <Compare style={{ paddingRight: 7, color: "#b3403a" }} />
                    Compare 2 days
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${urlPathPrefix}/vehicles/comparemultipledays`}>
                    <Compare style={{ paddingRight: 7, color: "#b3403a" }} />
                    Compare multiple days
                  </NavDropdown.Item>
                </NavDropdown>
              </div>

              <div style={{ padding: 5, marginRight: 30 }}>
                <Train className="navIcons" />
                <NavDropdown title="Trains" id="basic-nav-dropdown">
                  <NavDropdown.Item href={`${urlPathPrefix}/trains/MapFinland`}>
                    <Graph style={{ paddingRight: 7, color: "#b3403a" }} />
                    Cargo Trains on Map
                  </NavDropdown.Item>

                  {/* <NavDropdown.Item href="">
                    <Graph style={{ paddingRight: 7, color: "#b3403a" }} />
                    comming soon
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item href="">
                    <Compare style={{ paddingRight: 7, color: "#b3403a" }} />
                    comming soon
                  </NavDropdown.Item>

                  <NavDropdown.Item href="">
                    <Compare style={{ paddingRight: 7, color: "#b3403a" }} />
                    comming soon
                  </NavDropdown.Item> */}
                </NavDropdown>
              </div>

              <div style={{ padding: 5, marginRight: 30 }}>
                <Boat className="navIcons" />
                <NavDropdown title="Ships" id="basic-nav-dropdown">
                  <NavDropdown.Item href="">
                    <Graph style={{ paddingRight: 7, color: "#b3403a" }} />
                    comming soon
                  </NavDropdown.Item>

                  {/* <NavDropdown.Item href="">
                    <Graph style={{ paddingRight: 7, color: "#b3403a" }} />
                    comming soon
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item href="">
                    <Compare style={{ paddingRight: 7, color: "#b3403a" }} />
                    comming soon
                  </NavDropdown.Item>

                  <NavDropdown.Item href="">
                    <Compare style={{ paddingRight: 7, color: "#b3403a" }} />
                    comming soon
                  </NavDropdown.Item> */}
                </NavDropdown>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default NavBarMenu;
