import React from "react";
import { Popup, Marker } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import Icon from "./Icon";
//import Legend from "./Legend";

var allTrainLocations = {};

class TrainLocation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lat: 61.7,
      lng: 26.1,
      zoom: 6,
      allTrainLocations: {},
      cargoTrainLocations: {},
      cargoTrainsInfo: {},
      cargoTrainIDs: [],
      lateTrains: {},
      faultyCargoTrainIDs: [],
      cancelledTrainsInfo: {},
      selectedTrain: 0,
      intervalId: "",
    };
  }

  componentDidMount() {
    this.getCargoTrainInfo();
  }

  connectToWebSocket = () => {
    var client = new global.Messaging.Client(
      "rata.digitraffic.fi",
      443,
      "myclientid_" + parseInt(Math.random() * 10000, 10)
    );

    //Gets called if the websocket/mqtt connection gets disconnected for any reason
    client.onConnectionLost = function (responseObject) {
      //Depending on your scenario you could implement a reconnect logic here
      alert("connection lost: " + responseObject.errorMessage);
    };
    //Gets called whenever you receive a message for your subscriptions
    client.onMessageArrived = (message) => {
      //Do something with the push message you received
      //console.log(JSON.parse(message.payloadString));
      //response will be: {"trainNumber":55453,"departureDate":"2020-08-10","timestamp":"2020-08-10T14:59:16.000Z","location":{"type":"Point","coordinates":[24.666908,64.060098]},"speed":54}
      let data = JSON.parse(message.payloadString);
      let trainID = data.trainNumber;
      allTrainLocations[trainID] = data;

      const cargoTrainsCoordinates = {};
      const faultyCargoTrainIDs = [];

      if (this.state.cargoTrainIDs.length > 0) {
        this.state.cargoTrainIDs.forEach((id) => {
          if (allTrainLocations[id] !== undefined) {
            cargoTrainsCoordinates[id] = allTrainLocations[id];
          } else {
            faultyCargoTrainIDs.push(id);
          }
        });

        this.setState({
          allTrainLocations: cargoTrainsCoordinates,
          faultyCargoTrainIDs,
        });
      }

      //console.log("faulty trains", this.state.faultyCargoTrainIDs);
    };
    //Connect Options
    var options = {
      timeout: 3,
      useSSL: true,
      //Gets Called if the connection has sucessfully been established
      onSuccess: function () {
        client.subscribe("train-locations/#", {
          qos: 0,
        });
      },
      //Gets Called if the connection could not be established
      onFailure: function (message) {
        alert("Connection failed: " + message.errorMessage);
      },
    };
    client.connect(options);
  };

  getTrainLocatinAPI = () => {
    let url = `https://rata.digitraffic.fi/api/v1/train-locations/latest/`;
    axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          let data = res.data;
          data.forEach((element) => {
            let trainNumber = element.trainNumber;

            allTrainLocations[trainNumber] = element;
          });

          const cargoTrainsCoordinates = {};
          const faultyCargoTrainIDs = [];

          if (this.state.cargoTrainIDs.length > 0) {
            this.state.cargoTrainIDs.forEach((id) => {
              if (allTrainLocations[id] !== undefined) {
                cargoTrainsCoordinates[id] = allTrainLocations[id];
              } else {
                faultyCargoTrainIDs.push(id);
              }
            });

            this.setState({
              allTrainLocations: cargoTrainsCoordinates,
              faultyCargoTrainIDs,
            });
            this.props.faultyCargoTrainIDs(faultyCargoTrainIDs);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  getCargoTrainInfo = async () => {
    let date = new Date();
    let day = date.getDate();
    if (day < 10) day = `0${day}`;
    let month = date.getMonth() + 1;
    if (month < 10) month = `0${month}`;
    let year = date.getFullYear();

    let url = `https://rata.digitraffic.fi/api/v1/trains/${year}-${month}-${day}`;

    await axios
      .get(url)
      .then((res) => {
        if (res.status === 200) {
          const data = res.data;
          const cargoTrainsInfo = {};
          const cargoTrainIDs = [];
          const cancelledTrainsInfo = {};
          const lateTrains = {};

          data.forEach((element) => {
            let trainNumber = element.trainNumber;
            let trainCategory = element.trainCategory;
            let trainType = element.trainType;
            let runningCurrently = element.runningCurrently;
            let cancelled = element.cancelled;

            //getting only cargo trains and the train that are not beeing canceled  and are currently running on track
            if (
              (trainType === "T" ||
                trainType === "RJ" ||
                trainCategory === "Cargo") &&
              cancelled === false &&
              runningCurrently === true
            ) {
              cargoTrainsInfo[trainNumber] = element;
              cargoTrainIDs.push(trainNumber);
              //gets the stations and information if the train was late
              let stations = [];

              element.timeTableRows.forEach((e) => {
                if (e.causes.length > 0 && e.causes[0].categoryCode !== "E") {
                  // category code E is when train leave early or ahead of time
                  stations.push(e);
                  lateTrains[trainNumber] = stations;
                }
              });
            } else if (
              (trainType === "T" ||
                trainType === "RJ" ||
                trainCategory === "Cargo") &&
              cancelled === true
            ) {
              cancelledTrainsInfo[trainNumber] = element;
            }
          });

          //console.log({ cargoTrainsInfo, lateTrains });

          this.setState(
            { cargoTrainIDs, cargoTrainsInfo, lateTrains, cancelledTrainsInfo },
            () => {
              //using props to send the data to parent and then from parent to sideTab component
              this.props.cargoTrainsinfo(cargoTrainsInfo);
              this.props.cancelledTrainsInfo(cancelledTrainsInfo);
              if (this.state.faultyCargoTrainIDs.length > 0) {
                this.props.faultyCargoTrainIDs(this.state.faultyCargoTrainIDs);
              }
              //use this if you do not want to use websocket but you have to
              //manulay run this function to update the cordinates of trains
              this.getTrainLocatinAPI();

              //use this one to get the train locations via web socket
              this.connectToWebSocket();
            }
          );
        }
      })
      .catch((er) => {
        console.log(er);
      });
  };

  trainsOnMap = (input) => {
    if (Object.keys(input).length > 0) {
      const trainLocation = input;
      let trains = Object.keys(trainLocation).map((element) => {
        let trainNumber = element;
        let color = "#6aa663";
        if (this.state.lateTrains[trainNumber] !== undefined) {
          color = "#d43c19";
        }

        //Ceating a new icon with the train id number on it
        const circleIcon = L.divIcon({
          className: "custom-icon",
          iconAnchor: [20, 20],
          popupAnchor: [1, -13],
          html: ReactDOMServer.renderToString(
            <Icon perc={trainNumber} color={color} />
          ),
        });
        let coordinates = trainLocation[trainNumber].location.coordinates;
        return (
          <Marker
            position={coordinates.reverse()}
            icon={circleIcon}
            onclick={() => {
              //console.log(this.state.selectedTrain);
              this.props.selectedTrain(trainNumber);
            }}
            key={element}>
            <Popup>Train ID : {trainNumber}</Popup>
          </Marker>
        );
      });
      return trains;
    }
  };

  render() {
    const trainsCoordinate = this.state.allTrainLocations;

    return (
      <div>
        {/* <Marker position={position}></Marker> 
          <Marker position={position} icon={iconC}>
          <Popup>23 34234</Popup>
        </Marker>*/}

        {this.trainsOnMap(trainsCoordinate)}
      </div>
    );
  }
}

export default TrainLocation;
