import React, { Component } from "react";
import { Map, Polyline, TileLayer, LayerGroup } from "react-leaflet";
import * as coordinates from "./RailwayNetwork.json";
import TrainLocation from "./TrainLocation";
import Legend from "./Legend";
import SideTab from "./SideTab";
import "../CSS/Trains.css";

export default class MapLeaflet extends Component {
  constructor() {
    super();
    this.state = {
      cargoTrainsInfo: {},
      selectedTrain: 0,
      faultyCargoTrainIDs: [],
      cancelledTrainsInfo: {},
      lat: 61.7,
      lng: 26.1,
      zoom: 7,
    };
  }
  //this function divides the railway network data into 4 parts.
  //the resoan for dividing the data was that an error was happeing
  // saying that out
  railwayNetwork = (partnum) => {
    var networkLines;
    if (partnum === 1) {
      const part1 = coordinates.features.slice(0, 1800);
      networkLines = this.getRailwayNetworkPlylines(part1);
    } else if (partnum === 2) {
      const part2 = coordinates.features.slice(1800, 3000);
      networkLines = this.getRailwayNetworkPlylines(part2);
    } else if (partnum === 3) {
      const part3 = coordinates.features.slice(3000, 4500);
      networkLines = this.getRailwayNetworkPlylines(part3);
    } else if (partnum === 4) {
      const part4 = coordinates.features.slice(4500);
      networkLines = this.getRailwayNetworkPlylines(part4);
    }

    return networkLines;
  };

  getRailwayNetworkPlylines = (data) => {
    const output = data.map((element) => {
      let color = "#326fa8";
      if (element.properties.liikennointi === "T") color = "#cc720a";
      else if (element.properties.liikennointi === "H") color = "#326fa8";
      else if (element.properties.liikennointi === "H+T") color = "#0a8024";
      else if (element.properties.liikennointi === "SULJETTU")
        color = "#db0404";
      else if (element.properties.liikennointi === "MUSEO") color = "#5c3ccf";
      else color = "#575757";
      return (
        <Polyline
          key={element.properties.OBJECTID}
          color={color}
          positions={element.geometry.coordinates}
        />
      );
    });
    return output;
  };

  cargoTrainsInfoHandler = (info) => {
    if (info !== {}) this.setState({ cargoTrainsInfo: info });
  };
  selectedTrainHandler = (id) => {
    if (id !== 0) this.setState({ selectedTrain: id });
  };
  faultyTrainIDHandler = (ids) => {
    this.setState({ faultyCargoTrainIDs: ids });
  };
  cancelledTrainHandler = (info) => {
    if (info !== {}) this.setState({ cancelledTrainsInfo: info });
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    var sideTab = () => {
      let output = "";
      if (Object.keys(this.state.cargoTrainsInfo).length > 0) {
        output = (
          <SideTab
            cargoTrainsInfo={this.state.cargoTrainsInfo}
            selectedTrain={this.state.selectedTrain}
            faultyCargoTrainIDs={this.state.faultyCargoTrainIDs}
            cancelledTrainsInfo={this.state.cancelledTrainsInfo}
          />
        );
      }
      return output;
    };

    return (
      <div className="grid-container-trains">
        <div className="grid-item-map">
          <Map center={position} zoom={this.state.zoom}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />

            <LayerGroup>
              {this.railwayNetwork(1)}
              {this.railwayNetwork(2)}
              {this.railwayNetwork(3)}
              {this.railwayNetwork(4)}
            </LayerGroup>
            <TrainLocation
              cargoTrainsinfo={this.cargoTrainsInfoHandler}
              selectedTrain={this.selectedTrainHandler}
              faultyCargoTrainIDs={this.faultyTrainIDHandler}
              cancelledTrainsInfo={this.cancelledTrainHandler}
            />
            <Legend />
          </Map>
        </div>
        <div className="grid-item-sidebar">{sideTab()}</div>
      </div>
    );
  }
}
