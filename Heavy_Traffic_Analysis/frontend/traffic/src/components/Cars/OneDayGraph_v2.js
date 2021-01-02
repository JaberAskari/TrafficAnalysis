import React, { Component } from "react";
import axios from "axios";
import Chart from "react-apexcharts";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import LAMpointsOneDay from "./LAMpointsOneDay";
import "../CSS/MultipleDayGraph.css";
import serverURL from "../Url";

var year = "";
var VehicleNumberDataObjectForOneDay;
var AvgSpeedDataObjectForOneDay;

export class OneDayGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {},
      series: [],

      options2: {},
      series2: [],

      info: {},
      year: "",
      month: "",
      day: "",
      areaID: "",
      lamID: "",
      startDayNumber: "",
      endDayNumber: "",
      vehicleClass: "8", //8 means all classes
      trafficDirection: "both",

      childReady: false,
      error: "",
      message: "",
      toggleDisabled: true,
      btnDisabled: false,
      toggleHide: true,
      isloading: false,
      windowWidth: 970,
    };
    this.yearHandler = this.yearHandler.bind(this);
    this.startDayNumberHandler = this.startDayNumberHandler.bind(this);
    this.vehicleClassHandler = this.vehicleClassHandler.bind(this);
    this.trafficDirectionHandler = this.trafficDirectionHandler.bind(this);
  }
  handleResize = (e) => {
    this.setState({ windowWidth: window.innerWidth }, () => {
      //console.log(this.state.windowWidth)
    });
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnount() {
    window.addEventListener("resize", this.handleResize);
  }

  getData() {
    var year_ = this.state.year;
    var areaID = this.state.areaID;
    var lamID = this.state.lamID;
    var startDayNumber_ = this.state.startDayNumber;
    var endDayNumber_ = this.state.endDayNumber;

    var url = `${serverURL}/api/vehicle/?year=${year_}&areaID=${areaID}&lamID=${lamID}&startDayNumber=${startDayNumber_}&endDayNumber=${endDayNumber_}`; //&vehicleClass=${vehicleClass}
    axios
      .get(url)
      .then((res) => {
        console.log(res.status);
        //if the user has put only one day
        if (res.status === 200) {
          console.log(res.data);
          //getting the vehicle number in each our based on vehicle class from response of the request
          var vehicle_number = res.data.vehicle_number;
          //getting the cars avarage speed  based on car category
          var avg_speed = res.data.avg_speed_km_h;

          //filling the missing values of vehicle number to zero
          let final_Vehicle_number = this.fillMissingValues(vehicle_number);
          //console.log(final_Vehicle_number)
          VehicleNumberDataObjectForOneDay = this.filterData(
            final_Vehicle_number
          );
          //console.log(VehicleNumberDataObjectForOneDay);

          //filling the missing values of avarage speed to zero
          let final_avg_speed = this.fillMissingValues(avg_speed);
          AvgSpeedDataObjectForOneDay = this.filterData(final_avg_speed);

          //getting the avarage speed of all cars in each hour and saving them i class '8'
          Object.keys(AvgSpeedDataObjectForOneDay).forEach((hour) => {
            let direction1 = [];
            let direction2 = [];
            let Vclasses = AvgSpeedDataObjectForOneDay[hour];
            Object.keys(Vclasses).forEach((vclass) => {
              if (vclass === "8") {
                const arrSum = (arr) => arr.reduce((a, b) => a + b, 0);
                AvgSpeedDataObjectForOneDay[hour]["8"]["1"] =
                  arrSum(direction1) / direction1.length;
                AvgSpeedDataObjectForOneDay[hour]["8"]["2"] =
                  arrSum(direction2) / direction2.length;

                let both = direction1.concat(direction2);
                AvgSpeedDataObjectForOneDay[hour]["8"]["both"] =
                  Math.round((arrSum(both) / both.length) * 10) / 10;
              } else {
                if (AvgSpeedDataObjectForOneDay[hour][vclass]["1"] !== 0) {
                  direction1.push(
                    AvgSpeedDataObjectForOneDay[hour][vclass]["1"]
                  );
                }
                if (AvgSpeedDataObjectForOneDay[hour][vclass]["2"] !== 0) {
                  direction2.push(
                    AvgSpeedDataObjectForOneDay[hour][vclass]["2"]
                  );
                }
                let avg =
                  (AvgSpeedDataObjectForOneDay[hour][vclass]["1"] +
                    AvgSpeedDataObjectForOneDay[hour][vclass]["2"]) /
                  2;

                AvgSpeedDataObjectForOneDay[hour][vclass]["both"] =
                  Math.round(avg * 10) / 10;
              }
            });
          });

          //using setDataForGraph function to set the filtered and sorted data as graph's data set
          this.setDataForGraph(
            VehicleNumberDataObjectForOneDay,
            AvgSpeedDataObjectForOneDay
          );
          this.setState({
            toggleDisabled: false,
            btnDisabled: false,
            toggleHide: false,
            message: "",
          });
        } else {
          console.log("Could not connect to server! code:", res.status);
          this.setState({
            btnDisabled: false,
            message: "",
            error: `Oops something went wrong! Error code ${res.status}`,
          });
          alert(
            "Could not connect to server! not data found for selected date and location! code:",
            res.status
          );
        }
      })
      .catch((er) => {
        this.setState({ btnDisabled: false, message: "" });
        console.log(er);
        let errormsg = "";
        if (er.response.status === 404) {
          errormsg =
            "No data found for the selected date! Error code " +
            er.response.status;
        } else
          errormsg =
            "Oops something went wrong! Error code " + er.response.status;

        this.setState({ error: errormsg });
      });
  }

  setDataForGraph = (Vnumber, Vspeed) => {
    var VCLASS = this.state.vehicleClass;
    var dates = [];
    var numberData = [];
    var speedData = [];
    //data for graph
    var trafficDirection = this.state.trafficDirection;

    Object.keys(Vnumber).forEach((key) => {
      dates.push(key);
      numberData.push(Vnumber[key][VCLASS][trafficDirection]);
    });
    Object.keys(Vspeed).forEach((key) => {
      speedData.push(Vspeed[key][VCLASS][trafficDirection]);
    });

    //Setting the fetched data as graph's input data
    this.setState({
      //Data for vehcile number graph
      options: {
        chart: {
          id: "basic-bar",
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: dates,
          title: {
            text: "Hour",
          },
        },
        yaxis: {
          title: {
            text: "Vehicle Number",
          },
        },

        title: {
          text: "Number of vehicles in each hour of day",
          align: "center",
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
      },
      series: [
        {
          name: "Vehicle Number",
          data: numberData,
        },
      ],
      //data for avarage speed garaph
      options2: {
        chart: {
          id: "basic-bar",
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: dates,
          title: {
            text: "Time",
          },
        },
        yaxis: {
          title: {
            text: "Avrage speed km/h",
          },
          labels: {
            formatter: function (value) {
              return Math.round(value * 10) / 10;
            },
          },
        },
        colors: ["#cc3b31"],

        title: {
          text: "Avrage Speed in each hour",
          align: "center",
        },
        legend: {
          position: "top",
          horizontalAlign: "right",
          floating: true,
          offsetY: -25,
          offsetX: -5,
        },
      },
      series2: [
        {
          name: "Avarage Speed km/h",
          data: speedData,
        },
      ],
    });
  };

  filterData = (input) => {
    var DataObj = {};
    let d = {};
    let c = {};

    let sum = 0;
    Object.keys(input).forEach((key) => {
      let value = input[key];
      let keyToList = key.toString().split("_");

      let dates = keyToList[0];
      let category = parseFloat(keyToList[1]);
      let direction = parseFloat(keyToList[2]);

      c[direction] = Math.round(value * 10) / 10;

      sum = c["1"] + c["2"];
      c["both"] = sum;
      d[category] = { ...c };

      //checking if all the classes 1-7 exists, and then creates class 8 which is total of all classes
      if (d["1"] && d["2"] && d["3"] && d["4"] && d["5"] && d["6"] && d["7"]) {
        d["8"] = { 1: 0, 2: 0, both: 0 };
        d["8"]["1"] =
          d["1"]["1"] +
          d["2"]["1"] +
          d["3"]["1"] +
          d["4"]["1"] +
          d["5"]["1"] +
          d["6"]["1"] +
          d["7"]["1"];
        d["8"]["2"] =
          d["1"]["2"] +
          d["2"]["2"] +
          d["3"]["2"] +
          d["4"]["2"] +
          d["5"]["2"] +
          d["6"]["2"] +
          d["7"]["2"];
        d["8"]["both"] = d["8"]["1"] + d["8"]["2"];
      }
      DataObj[dates] = { ...d };
      //if()
    });
    return DataObj;
  };

  //function for filling the missing values like vehicle category and its number
  fillMissingValues = (input) => {
    let final = {};
    for (let i = 0; i <= 23; i++) {
      for (let j = 1; j <= 7; j++) {
        for (let x = 1; x <= 2; x++) {
          const key = [`${i}_${j}_${x}`];
          final[key] = input[key];
          if (input[key] === undefined) {
            final[key] = 0;
          }
        }
      }
    }
    return final;
  };

  dateTodaynumber = (year, month, day) => {
    var x = new Date(year, 0, 0);
    x = x.getTime();

    var d = new Date(year, month, day);
    d = d.getTime();
    var sec = d - x;
    var secToDay = sec / 1000 / 60 / 60 / 24;
    secToDay = Math.floor(secToDay);
    return secToDay;
  };

  yearHandler(e) {
    year = e;
    this.setState({ year });
  }

  monthHandler = (e) => {
    this.setState({ month: e });
  };

  startDayNumberHandler(e) {
    this.setState({ day: e });
  }

  vehicleClassHandler(e) {
    var vehicleClass = e.target.value;
    this.setState({ vehicleClass }, () => {
      //one day data
      //using setDataForGraph function to set the filtered and sorted data as graph's data set
      this.setDataForGraph(
        VehicleNumberDataObjectForOneDay,
        AvgSpeedDataObjectForOneDay
      );
    });
  }

  trafficDirectionHandler(e) {
    var btnID = e.target.id;

    let trafficDirection;
    if (btnID === "direction1") {
      //console.log(btnID)
      trafficDirection = 1;
    } else if (btnID === "direction2") {
      //console.log(btnID)
      trafficDirection = 2;
    } else if (btnID === "bothDirection") {
      //console.log(btnID)
      trafficDirection = "both";
    }
    this.setState({ trafficDirection }, () => {
      //one day data
      //using setDataForGraph function to set the filtered and sorted data as graph's data set
      this.setDataForGraph(
        VehicleNumberDataObjectForOneDay,
        AvgSpeedDataObjectForOneDay
      );
    });
  }

  infoHandler = (info) => {
    var lamID = info.id;
    this.setState({ lamID, info });
  };
  areaHandler = (id) => {
    var areaID = id;
    this.setState({ areaID });
  };

  isChildreadyHandler = (e) => {
    this.setState({
      childReady: e,
    });
  };

  buttonHandler = () => {
    let selectedYear = this.state.year;
    let selectedMonth = this.state.month;
    let selectedDay = this.state.day;

    let dayNumber = this.dateTodaynumber(
      selectedYear,
      selectedMonth,
      selectedDay
    );

    var inputs = [
      this.state.year,
      this.state.areaID,
      this.state.lamID,
      this.state.month,
      this.state.day,
      this.state.childReady,
    ];
    if (
      (inputs[0] === "") |
      (inputs[1] === "") |
      (inputs[2] === "") |
      (inputs[3] === "") |
      (inputs[4] === "") |
      (inputs[5] === false)
    ) {
      this.setState({
        error:
          "Please make sure that you have chosen right value for dates, Area and LAM point ID fields!",
      });
    } else {
      this.setState({
        error: "",
        message: "Please wait while the data is beeing processed!",
        btnDisabled: true,
      });
      this.setState({ startDayNumber: dayNumber }, () => {
        this.getData();
        console.log("Sending request to server!");
      });

      //console.log(this.state)
    }
  };

  render() {
    let id,
      name,
      coordinates,
      status,
      address,
      municipality,
      province,
      direction1,
      direction2,
      startTime = "";
    if (this.state.info["id"] !== undefined) {
      id = this.state.info.id;
      status = this.state.info.status;
      name = this.state.info.name;
      coordinates = this.state.info.coordinatesETRS89.toString();
      address = this.state.info.address.en;
      municipality = this.state.info.municipality;
      province = this.state.info.province;
      startTime = this.state.info.startTime;
      direction1 = this.state.info.direction1;
      direction2 = this.state.info.direction2;
    }

    let graphWidth;
    if (this.state.windowWidth < 975) graphWidth = 350;
    else graphWidth = 550;
    return (
      <div className="oneDayGraphComponent">
        <div className="grid-container">
          <div className="grid-item-heading">Data analysis for one day</div>

          <div className="grid-item-form">
            <div style={{ fontSize: 16, color: "#eb4034" }}>
              {this.state.error}
            </div>

            <LAMpointsOneDay
              info={this.infoHandler}
              SelectedAreaID={this.areaHandler}
              selectedYear={this.yearHandler}
              selectedMonth={this.monthHandler}
              selectedDay={this.startDayNumberHandler}
              ready={this.isChildreadyHandler}
            />

            <Button
              type="button"
              className="my-1 mr-sm-2"
              id="drawGraph"
              onClick={this.buttonHandler}
              disabled={this.state.btnDisabled}
              block>
              {this.state.btnDisabled ? "Loading ..." : "Draw Graph"}
            </Button>

            <div style={{ fontSize: 16, color: "#1878b5" }}>
              {this.state.message}
            </div>
            <br />
            <div className="grid-item-info">
              <h5>TMS Information:</h5>
              <Table
                striped
                size="sm"
                style={{ fontSize: "16px", color: "#0077c7" }}>
                <tbody>
                  <tr>
                    <td> TMS ID: </td>
                    <td>{id}</td>
                  </tr>
                  <tr>
                    <td>Name: </td>
                    <td>{name}</td>
                  </tr>
                  <tr>
                    <td>Status: </td>
                    <td>{status}</td>
                  </tr>

                  <tr>
                    <td> Coordinates: </td>
                    <td>{coordinates}</td>
                  </tr>

                  <tr>
                    <td>Address: </td>
                    <td>{address}</td>
                  </tr>

                  <tr>
                    <td>Municipality: </td>
                    <td>{municipality}</td>
                  </tr>
                  <tr>
                    <td>Province: </td>
                    <td>{province}</td>
                  </tr>
                  <tr>
                    <td>Start Time: </td>
                    <td>{startTime}</td>
                  </tr>
                  <tr>
                    <td>Direction 1: </td>
                    <td>{direction1}</td>
                  </tr>
                  <tr>
                    <td>Direction 2: </td>
                    <td>{direction2}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>

          <div className="grid-item-filter">
            <Form style={{ width: "100%" }}>
              <Form.Label
                className="my-1 mr-2"
                htmlFor="inlineFormCustomSelectPref">
                <h5>Filters:</h5>
              </Form.Label>
              <br />

              <Form.Label
                className="my-1 mr-2"
                htmlFor="inlineFormCustomSelectPref">
                vehicle Category
              </Form.Label>
              <Form.Control
                as="select"
                className="my-1 mr-sm-2"
                id="vehicleClass"
                custom
                onChange={this.vehicleClassHandler}
                disabled={this.state.toggleDisabled}>
                <option value="8">All</option>
                <option value="1">1 HA-PA (henkilö- tai pakettiauto)</option>
                <option value="2">2 KAIP (kuorma-auto ilman perävaunua)</option>
                <option value="3">3 Linja-autot</option>
                <option value="4">
                  4 KAPP (kuorma-auto ja puoliperävaunu)
                </option>
                <option value="5">5 KATP (kuorma-auto ja täysperävaunu)</option>
                <option value="6">6 HA + PK (henkilöauto ja peräkärry)</option>
                <option value="7">
                  7 HA + AV (henkilöauto ja asuntovaunu)
                </option>
              </Form.Control>

              <ButtonGroup
                size="sm"
                className="mb-2 "
                style={{ width: "100%" }}
                hidden={this.state.toggleHide}>
                <Button
                  type="button"
                  className="my-4"
                  id="direction1"
                  onClick={this.trafficDirectionHandler}>
                  Direction 1
                </Button>

                <Button
                  type="button"
                  className="my-4"
                  id="direction2"
                  onClick={this.trafficDirectionHandler}>
                  Direction 2
                </Button>

                <Button
                  style={{ minWidth: 120 }}
                  type="button"
                  className="my-4"
                  id="bothDirection"
                  onClick={this.trafficDirectionHandler}>
                  Both Direction
                </Button>
              </ButtonGroup>
            </Form>
          </div>

          <div className="grid-item-graph1">
            <div className="grid-item-graph-child">
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="bar"
                width={graphWidth}
              />
            </div>
          </div>

          <div className="grid-item-graph2">
            <div className="grid-item-graph-child">
              <Chart
                options={this.state.options2}
                series={this.state.series2}
                type="bar"
                width={graphWidth}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default OneDayGraph;
