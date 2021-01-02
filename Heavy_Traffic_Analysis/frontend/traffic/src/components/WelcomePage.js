import React, { Component } from "react";
import "./CSS/welcomePage.css";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";

import graph from "./assets/graph2.png";
import cars from "./assets/car.svg";
import train from "./assets/train.png";
import ship from "./assets/ship.svg";

class WelcomePage extends Component {
  render() {
    return (
      <div className="InfoPage">
        <Jumbotron fluid className="content">
          <Container>
            <div className="gridContainer">
              <div className="welcomeCenter">
                <h1>Welcome to Traffic Analysis</h1>
                <h6>Here you can see amount of traffic across Finland</h6>
              </div>
              <div className="welcomeLeft">
                <p className="text">
                  This page will help you to see read traffic(vehicles), live
                  cargo train traffic and ships traffic across Finland.
                  <br />
                  Currently the ships traffic tab is not working and planed for
                  future development.
                  <br />
                </p>
              </div>

              <div className="welcomeRight">
                <img src={graph} width={350} />
              </div>

              <div className="roadTrafficLeft">
                <img src={cars} width={350} />
              </div>
              <div className="roadTrafficRight">
                <div className="texts">
                  <h4>Road Traffic (Vehicles):</h4>
                  In this part, it is possible to see amount of traffic and
                  average speed across Finland. By using the Vehicles sub menu
                  you can select a location within 500 different points across
                  Finland and see the amount of traffic during the selected time
                  interval in that location. <br></br>
                  This app uses open data from Finnish Transport Agency
                  (vayla.fi). The Finnish Transport Agency collects data about
                  road traffic using an automatic traffic monitoring system
                  (TMS, also referred as LAM). The data is shared both in raw
                  form and as generated reports. Currently, there are about 500
                  traffic measuring stations in Finland. <br></br>
                  <br></br>
                  <h5>
                    <strong>Filters: </strong>{" "}
                  </h5>
                  In Vehicles part, this page offers 2 filters, vehicle category
                  and traffic direction, to present data to you.
                  <br /> By the help of these filters you can choose from 7
                  different vehicle categories to see each of them individually.
                  Also, you can choose to see the data only in one direction of
                  street. <br />
                  In default you will see the data for all vehicle types in both
                  direction of street.
                  <br></br>
                  <br></br>
                  <h5>Sub menus: </h5>
                  <ul>
                    <li>
                      <strong>One Day Analysis: </strong> Here you can select a
                      location from list to see the amount of traffic and
                      average speed of vehicles in each hour of the selected day
                      (24 hours).
                    </li>

                    <li>
                      <strong>Multiple Day Analysis: </strong> Here it is
                      possible to select an interval of days (max 30 days) to
                      see the amount of traffic in each individual day in the
                      selected location.
                    </li>
                    <li>
                      <strong>Compare 2 Days: </strong>In this sub menu you can
                      choose 2 different locations and days to compare the
                      traffic amount with each other in each hour of the
                      selected days.
                    </li>
                    <li>
                      <strong>Compare Multiple Days: </strong> Here you can
                      choose 2 different locations and 2 different time interval
                      (max 30 days) to compare each day's traffic amount with
                      each other.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="trainTrafficLeft">
                <div className="texts">
                  <h4>Live Cargo train traffic (Trains) :</h4>
                  This page offers a map that shows all the cargo train
                  locations in real time across Finland.
                  <br />
                  We are using the open data in digitraffic.fi offered by
                  Finnish Road, Railway and Marine Traffic. <br />
                  The location of each train is achieved through onboard GPS
                  device which updates each 15 seconds. <br />
                  Not all trains have onboard or active GPS devices, for this
                  reason there is a No Coordinate tab, that contains information
                  about today's active cargo trains.
                  <br />
                  Each cargo train is presented with a circle icon with its id
                  number in centre and a green or red ring around it.
                  <strong>Red ring </strong> means that the train is late or has
                  been late today at some point. By clicking on a tarin icon,
                  its information will appear in side bar.
                </div>
              </div>
              <div className="trainTrafficRight">
                {" "}
                <img src={train} width={350} />
              </div>

              <div className="seeTrafficLeft">
                {" "}
                <img src={ship} width={350} />
              </div>
              <div className="seeTrafficRight">
                <div className="texts">
                  <h4>See traffic (Ships):</h4>
                  Currently the marine traffic tab is not working and planed for
                  future development.
                </div>
              </div>
            </div>
          </Container>
        </Jumbotron>
      </div>
    );
  }
}

export default WelcomePage;
