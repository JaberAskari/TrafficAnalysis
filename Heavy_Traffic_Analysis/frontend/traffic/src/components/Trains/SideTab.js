import React, { Component } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Axios from "axios";
import TrainInfo from "./TrainInfo";
import NoCoordinateTrains from "./NoCoordinateTrains";

export default class SideTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cargoTrainsInfo: {},

      allStationData: {},
      causeCategory: {},
      detailedCause: {},

      collapsed: true,
      selected: "home",
    };
  }

  componentDidMount() {
    let stationinfoURL = "https://rata.digitraffic.fi/api/v1/metadata/stations";
    let causeCategoryURL =
      "https://rata.digitraffic.fi/api/v1/metadata/cause-category-codes";
    let detailedCauseURL =
      "https://rata.digitraffic.fi/api/v1/metadata/detailed-cause-category-codes";
    // let thirdCauseURL =
    //   "https://rata.digitraffic.fi/api/v1/metadata/third-cause-category-codes";

    Axios.all([
      Axios.get(stationinfoURL),
      Axios.get(causeCategoryURL),
      Axios.get(detailedCauseURL),
    ])
      .then(([res1, res2, res3]) => {
        const allStationData = {};
        if (res1.status === 200) {
          //console.log(res1);
          let data = res1.data;
          data.forEach((element) => {
            let stationUICCode = element.stationUICCode;
            allStationData[stationUICCode] = element;
          });
          //this.setState({ allStationData });
        }
        const causeCategory = {};
        if (res2.status === 200) {
          //console.log(res2);
          let data2 = res2.data;
          data2.forEach((element) => {
            let causeID = element.id;
            causeCategory[causeID] = element;
          });
          //this.setState({ causeCategory });
        }
        if (res3.status === 200) {
          //console.log(res3);
          let data3 = res3.data;
          const detailedCause = {};
          data3.forEach((element) => {
            let ID = element.id;
            detailedCause[ID] = element;
          });
          this.setState({ detailedCause, causeCategory, allStationData });
        }
      })
      .catch(([e1, e2, e3]) => {
        console.log(e1, e2, e3);
        alert("Error connecting to API service!!");
      });
  }

  render() {
    //const cancelledTrainsInfo = this.props.cancelledTrainsInfo;

    return (
      <div style={{}}>
        <Tabs defaultActiveKey="Info" id="uncontrolled-tab-example">
          <Tab eventKey="Info" title="Info">
            <div
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                color: "#497ec4",
                fontSize: "15px",
              }}>
              Click on a train icon to see its information:
            </div>
            <div className="TabContainer">
              <TrainInfo
                selectedTrain={this.props.selectedTrain}
                cargoTrainsInfo={this.props.cargoTrainsInfo}
                allStationData={this.state.allStationData}
                causeCategory={this.state.causeCategory}
                detailedCause={this.state.detailedCause}
              />
            </div>
          </Tab>
          {/* <Tab eventKey="Cancelled" title="Cancelled">
            {this.cancelledTrains(cancelledTrainsInfo)}
          </Tab> */}
          <Tab eventKey="No Coordinate" title="No Coordinate">
            <div className="TabContainer">
              <NoCoordinateTrains
                cargoTrainsInfo={this.props.cargoTrainsInfo}
                faultyCargoTrainIDs={this.props.faultyCargoTrainIDs}
                allStationData={this.state.allStationData}
                causeCategory={this.state.causeCategory}
                detailedCause={this.state.detailedCause}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}
