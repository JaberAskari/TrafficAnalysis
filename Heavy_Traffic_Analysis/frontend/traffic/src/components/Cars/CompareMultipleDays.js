import React, { Component } from "react";
import Chart from "react-apexcharts";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import LAMpoints from "./LAMpoints";
import "../CSS/Campare2Days.css";
import serverURL from "../Url";

var year = "";

var interval;
var interval2;
var VehicleNumberDataObjectForMultipleDay = {};
var AvgSpeedDataObjectForMultipleDay = {};

var VehicleNumberDataObjectForMultipleDay2 = {};
var AvgSpeedDataObjectForMultipleDay2 = {};

export class CompareMultipleDays extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {},
      series: [],

      options2: {},
      series2: [],

      info: {},
      info2: {},
      year: "",
      year2: "",
      month: "",
      month2: "",
      day: "",
      day2: "",
      endDay: "",
      endDay2: "",
      areaID: "",
      areaID2: "",
      lamID: "",
      lamID2: "",
      startDayNumber: "",
      startDayNumber2: "",
      endDayNumber: "",
      endDayNumber2: "",
      vehicleClass: "8", //8 means all classes
      trafficDirection: "both",

      counter: 0,
      counter2: 0,
      childReady: false,
      childReady2: false,
      error: "",
      error2: "",
      message: "",
      message2: "",
      toggleDisabled: true,
      btnDisabled: false,
      btnDisabled2: false,
      toggleHide: true,
      isloading: false,

      windowWidth: 970,
    };
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

  async getDataAsStream(btn) {
    console.log("sending req!");
    var year_, areaID, lamID, startDayNumber_, endDayNumber_;
    if (btn === 1) {
      year_ = this.state.year;
      areaID = this.state.areaID;
      lamID = this.state.lamID;
      startDayNumber_ = this.state.startDayNumber;
      endDayNumber_ = this.state.endDayNumber;

      interval = endDayNumber_ - startDayNumber_;
      VehicleNumberDataObjectForMultipleDay = {};
      AvgSpeedDataObjectForMultipleDay = {};
    } else {
      year_ = this.state.year2;
      areaID = this.state.areaID2;
      lamID = this.state.lamID2;
      startDayNumber_ = this.state.startDayNumber2;
      endDayNumber_ = this.state.endDayNumber2;

      interval2 = endDayNumber_ - startDayNumber_;
      VehicleNumberDataObjectForMultipleDay2 = {};
      AvgSpeedDataObjectForMultipleDay2 = {};
    }

    var escapedDays = 0;
    var counter = 1;
    //console.log({interval})
    var url = `${serverURL}/api/vehicle/?year=${year_}&areaID=${areaID}&lamID=${lamID}&startDayNumber=${startDayNumber_}&endDayNumber=${endDayNumber_}`; //&vehicleClass=${vehicleClass}
    //var url = `http://localhost:3030/api/vehicle/?year=2019&areaID=01&lamID=101&startDayNumber=5&endDayNumber=30`;//&vehicleClass=${vehicleClass}

    try {
      // Step 1: start the fetch and obtain a reader
      var response = await fetch(url);

      if (response.status === 200) {
        const reader = response.body.getReader();

        // Step 2: get total length
        //const contentLength = +response.headers.get('Content-Length');

        // Step 3: read the data
        var resultList = [];
        //let receivedLength = 0; // received that many bytes at the moment
        //let chunks = []; // array of received binary chunks (comprises the body)
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          //chunks.push(value);
          //receivedLength += value.length;

          //console.log(`Received ${receivedLength} of ${contentLength}`)
          try {
            let result_ = new TextDecoder("utf-8").decode(value);
            var result = JSON.parse(result_);
            resultList.push(resultList);
            //console.log(result)

            //getting the vehicle number in each our based on vehicle class from response of the request
            var vehicle_number = result.vehicle_number;

            //filling the missing values of vehicle number to zero
            let final_Vehicle_number = this.fillMissingValues(vehicle_number);
            let vehicleNumber = this.filterData(final_Vehicle_number);

            //getting the cars average speed  based on car category
            var avg_speed = result.avg_speed_km_h;
            //filling the missing values of average speed to zero
            let final_avg_speed = this.fillMissingValues(avg_speed);
            //filtering the data and making it as a nested object
            let avgSpeed_ = this.filterData(final_avg_speed);
            //using the calculateAvgSpeed function it will claculate the avarage speed for each vehicle class
            let avgSpeed = this.calculateAvgSpeed(avgSpeed_);

            let date = Object.keys(avgSpeed)[0];
            //checking what button is pressed, then based on the button number the data will be saved
            // to the object that responds the the selected lam point
            if (btn === 1) {
              //saving all days in one object
              VehicleNumberDataObjectForMultipleDay[date] = vehicleNumber[date];
              AvgSpeedDataObjectForMultipleDay[date] = avgSpeed[date];

              this.setState({ counter });
            } else {
              //saving all days in one object
              VehicleNumberDataObjectForMultipleDay2[date] =
                vehicleNumber[date];
              AvgSpeedDataObjectForMultipleDay2[date] = avgSpeed[date];

              this.setState({ counter2: counter });
            }

            //using setDataForGraph function to set the filtered and sorted data as graph's data set
            this.setDataForGraph(
              VehicleNumberDataObjectForMultipleDay,
              AvgSpeedDataObjectForMultipleDay,
              VehicleNumberDataObjectForMultipleDay2,
              AvgSpeedDataObjectForMultipleDay2
            );
            counter++;

            //console.log({vehicleNumber,avgSpeed});
          } catch (error) {
            console.log("escaped one day!");
            escapedDays++;
            continue;
          }
        }
        if (btn === 1) {
          this.setState({
            toggleDisabled: false,
            btnDisabled: false,
            toggleHide: false,
            message: `Faulty days: ${escapedDays}`,
          });
        } else {
          this.setState({
            toggleDisabled: false,
            btnDisabled2: false,
            toggleHide: false,
            message2: `Faulty days: ${escapedDays}`,
          });
        }
        console.log("all days; ", VehicleNumberDataObjectForMultipleDay);
      } else {
        let errormsg = "";
        if (response.status === 404) {
          errormsg =
            "No data found for the selected date! Error code " +
            response.status;
        } else
          errormsg = "Oops something went wrong! Error code " + response.status;

        if (btn === 1) {
          this.setState({ error: errormsg, btnDisabled: false, message: "" });
        } else {
          this.setState({
            error2: errormsg,
            btnDisabled2: false,
            message2: "",
          });
        }

        //alert("Could not connect to server! no data found for selected date and location! code:",response.status)
      }
    } catch (er) {
      console.log(er);
      let errormsg = "";
      if (response.status === 404) {
        errormsg =
          "No data found for the selected date! Error code " + response.status;
      } else
        errormsg = "Oops something went wrong! Error code " + response.status;

      if (btn === 1) {
        this.setState({ error: errormsg, btnDisabled: false, message: "" });
      } else {
        this.setState({ error2: errormsg, btnDisabled2: false, message2: "" });
      }
    }
  }
  calculateAvgSpeed(input) {
    //getting the avarage speed of all cars in each hour and saving them i class '8'
    Object.keys(input).forEach((hour) => {
      let direction1 = [];
      let direction2 = [];
      let Vclasses = input[hour];
      Object.keys(Vclasses).forEach((vclass) => {
        if (vclass === "8") {
          const arrSum = (arr) => arr.reduce((a, b) => a + b, 0);
          input[hour]["8"]["1"] = arrSum(direction1) / direction1.length;
          input[hour]["8"]["2"] = arrSum(direction2) / direction2.length;

          let both = direction1.concat(direction2);
          input[hour]["8"]["both"] =
            Math.round((arrSum(both) / both.length) * 10) / 10;
        } else {
          if (input[hour][vclass]["1"] !== 0) {
            direction1.push(input[hour][vclass]["1"]);
          }
          if (input[hour][vclass]["2"] !== 0) {
            direction2.push(input[hour][vclass]["2"]);
          }
          let avg = (input[hour][vclass]["1"] + input[hour][vclass]["2"]) / 2;

          input[hour][vclass]["both"] = Math.round(avg * 10) / 10;
        }
      });
    });
    return input;
  }

  setDataForGraph = (Vnumber, Vspeed, Vnumber2, Vspeed2) => {
    var VCLASS = this.state.vehicleClass;
    var trafficDirection = this.state.trafficDirection;

    var numberData = [];
    var speedData = [];
    var dates = [];
    var lamid = this.state.lamID;

    //data for graph

    if (Object.keys(Vnumber).length !== 0) {
      Object.keys(Vnumber).forEach((key) => {
        //changing to date time
        let list = key.split(".");

        let time = new Date(list[2], parseInt(list[1]) - 1, list[0]);
        dates.push(time.toDateString());

        numberData.push(Vnumber[key][VCLASS][trafficDirection]);
      });
      Object.keys(Vspeed).forEach((key) => {
        speedData.push(Vspeed[key][VCLASS][trafficDirection]);
      });
    }

    var numberData2 = [];
    var speedData2 = [];
    var dates2 = [];
    var lamid2 = this.state.lamID2;

    if (Object.keys(Vnumber2).length !== 0) {
      Object.keys(Vnumber2).forEach((key) => {
        //changing to date time
        let list = key.split(".");
        let time = new Date(list[2], parseInt(list[1]) - 1, list[0]);
        dates2.push(time.toDateString());
        numberData2.push(Vnumber2[key][VCLASS][trafficDirection]);
      });
      Object.keys(Vspeed2).forEach((key) => {
        speedData2.push(Vspeed2[key][VCLASS][trafficDirection]);
      });
    }

    //making a multi index x axis
    var xaxis = [];
    let dt1 = dates.length;
    let dt2 = dates2.length;
    if (dt1 >= dt2) {
      for (let i = 0; i < dt1; i++) {
        if (i < dt2) xaxis.push([dates[i], dates2[i]]);
        else xaxis.push([dates[i], ""]);
      }
    }
    if (dt1 < dt2) {
      for (let i = 0; i < dt2; i++) {
        if (i < dt1) xaxis.push([dates[i], dates2[i]]);
        else xaxis.push(["", dates2[i]]);
      }
    }

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
          categories: xaxis, //dates,
          title: {
            text: "Date",
          },
          labels: {
            show: false,
          },
        },
        yaxis: {
          title: {
            text: "Vehicle Number",
          },
          opposite: false,
        },

        colors: ["#0398fc", "#cc3b31"],
        title: {
          text: "Number of vehicles per hour",
          align: "left",
          margin: 0,
          offsetX: 10,
          offsetY: -3,
          floating: false,
        },
        legend: {
          position: "bottom",
          horizontalAlign: "left",
          floating: true,
          offsetY: 10,
          offsetX: 10,

          onItemClick: {
            toggleDataSeries: false,
          },
          onItemHover: {
            highlightDataSeries: true,
          },
        },
      },
      series: [
        {
          name: "TMS ID " + lamid,
          data: numberData,
        },
        {
          name: "TMS ID " + lamid2,
          data: numberData2,
        },
      ],

      //data for avarage speed garaph
      options2: {
        chart: {
          id: "basic-bar2",
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: xaxis,
          title: {
            text: "Date",
          },
          labels: {
            show: false,
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
        colors: ["#0398fc", "#cc3b31"],

        title: {
          text: "Average speed per hour",
          align: "left",
          margin: 0,
          offsetX: 10,
          offsetY: -3,
          floating: false,
        },
        legend: {
          position: "bottom",
          horizontalAlign: "left",
          floating: true,
          offsetY: 10,
          offsetX: 10,

          onItemClick: {
            toggleDataSeries: false,
          },
          onItemHover: {
            highlightDataSeries: true,
          },
        },
      },
      series2: [
        {
          name: "TMS ID " + lamid,
          data: speedData,
        },
        {
          name: "TMS ID " + lamid2,
          data: speedData2,
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
    let firstkey = Object.keys(input);
    let year = firstkey[0].split("_")[0];

    let final = {};
    for (let i = 0; i <= 14; i++) {
      for (let j = 1; j <= 7; j++) {
        for (let x = 1; x <= 2; x++) {
          const key = [`${year}_${j}_${x}`];
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

  yearHandler = (e) => {
    year = e;
    this.setState({ year });
  };
  yearHandler2 = (e) => {
    let year2 = e;
    this.setState({ year2 });
  };

  monthHandler = (e) => {
    this.setState({ month: e });
  };
  monthHandler2 = (e) => {
    this.setState({ month2: e });
  };

  startDayNumberHandler = (e) => {
    this.setState({ day: e });
  };
  startDayNumberHandler2 = (e) => {
    this.setState({ day2: e });
  };
  endDaynumberHandler = (e) => {
    console.log(e);
    this.setState({ endDay: e });
  };
  endDaynumberHandler2 = (e) => {
    console.log(e);
    this.setState({ endDay2: e });
  };

  vehicleClassHandler = (e) => {
    var vehicleClass = e.target.value;
    this.setState({ vehicleClass }, () => {
      //one day data
      //using setDataForGraph function to set the filtered and sorted data as graph's data set
      this.setDataForGraph(
        VehicleNumberDataObjectForMultipleDay,
        AvgSpeedDataObjectForMultipleDay,
        VehicleNumberDataObjectForMultipleDay2,
        AvgSpeedDataObjectForMultipleDay2
      );
    });
  };

  trafficDirectionHandler = (e) => {
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
        VehicleNumberDataObjectForMultipleDay,
        AvgSpeedDataObjectForMultipleDay,
        VehicleNumberDataObjectForMultipleDay2,
        AvgSpeedDataObjectForMultipleDay2
      );
    });
  };

  infoHandler = (info) => {
    var lamID = info.id;
    this.setState({ lamID, info });
  };
  infoHandler2 = (info2) => {
    var lamID2 = info2.id;
    this.setState({ lamID2, info2 });
  };

  areaHandler = (id) => {
    var areaID = id;
    this.setState({ areaID });
  };
  areaHandler2 = (id) => {
    var areaID2 = id;
    this.setState({ areaID2 });
  };

  isChildreadyHandler = (e) => {
    this.setState({
      childReady: e,
    });
  };
  isChildreadyHandler2 = (e) => {
    this.setState({
      childReady2: e,
    });
  };

  buttonHandler = () => {
    let selectedYear = this.state.year;
    let selectedMonth = this.state.month;
    let selectedDay = this.state.day;
    let selectedEndDay = this.state.endDay;

    let startDayNumber = this.dateTodaynumber(
      selectedYear,
      selectedMonth,
      selectedDay
    );
    let endDayNumber = this.dateTodaynumber(
      selectedYear,
      selectedMonth,
      selectedEndDay
    );

    var inputs = [
      this.state.year,
      this.state.areaID,
      this.state.lamID,
      this.state.month,
      this.state.day,
      this.state.endDay,
      this.state.childReady,
    ];
    if (
      (inputs[0] === "") |
      (inputs[1] === "") |
      (inputs[2] === "") |
      (inputs[3] === "") |
      (inputs[4] === "") |
      (inputs[5] === "") |
      (inputs[6] === false)
    ) {
      this.setState({
        error:
          "Please make sure that you have chosen right value for dates, Area and LAM point ID fields!",
      });
    } else if (
      (startDayNumber === endDayNumber) |
      (startDayNumber > endDayNumber)
    ) {
      this.setState({
        error: "End day can not be equal or smaller then the start day!",
      });
    } else {
      this.setState({
        error: "",
        message: "Please wait while the data is beeing processed!",
        btnDisabled: true,
      });

      this.setState({ startDayNumber, endDayNumber }, () => {
        this.getDataAsStream(1);
        console.log("Sending request to server!");
      });

      //console.log(this.state)
    }
  };

  buttonHandler2 = () => {
    let selectedYear = this.state.year2;
    let selectedMonth = this.state.month2;
    let selectedDay = this.state.day2;
    let selectedEndDay = this.state.endDay2;

    let startDayNumber = this.dateTodaynumber(
      selectedYear,
      selectedMonth,
      selectedDay
    );
    let endDayNumber = this.dateTodaynumber(
      selectedYear,
      selectedMonth,
      selectedEndDay
    );

    var inputs = [
      this.state.year2,
      this.state.areaID2,
      this.state.lamID2,
      this.state.month2,
      this.state.day2,
      this.state.endDay2,
      this.state.childReady2,
    ];
    if (
      (inputs[0] === "") |
      (inputs[1] === "") |
      (inputs[2] === "") |
      (inputs[3] === "") |
      (inputs[4] === "") |
      (inputs[5] === "") |
      (inputs[6] === false)
    ) {
      this.setState({
        error2:
          "Please make sure that you have chosen right value for dates, Area and LAM point ID fields!",
      });
    } else if (
      (startDayNumber === endDayNumber) |
      (startDayNumber > endDayNumber)
    ) {
      this.setState({
        error2: "End day can not be equal or smaller then the start day!",
      });
    } else {
      this.setState({
        error2: "",
        message2: "Please wait while the data is beeing processed!",
        btnDisabled2: true,
      });

      this.setState(
        { startDayNumber2: startDayNumber, endDayNumber2: endDayNumber },
        () => {
          this.getDataAsStream(2);
          console.log("Sending request to server!");
        }
      );

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

    let id2,
      name2,
      coordinates2,
      status2,
      address2,
      municipality2,
      province2,
      direction12,
      direction22,
      startTime2 = "";
    if (this.state.info2["id"] !== undefined) {
      id2 = this.state.info2.id;
      status2 = this.state.info2.status;
      name2 = this.state.info2.name;
      coordinates2 = this.state.info2.coordinatesETRS89.toString();
      address2 = this.state.info2.address.en;
      municipality2 = this.state.info2.municipality;
      province2 = this.state.info2.province;
      startTime2 = this.state.info2.startTime;
      direction12 = this.state.info2.direction1;
      direction22 = this.state.info2.direction2;
    }

    let graphWidth;
    if (this.state.windowWidth < 975) graphWidth = 350;
    else graphWidth = 550;

    return (
      <div className="campare">
        <div className="grid-container-campare ">
          <div className="grid-item-heading-campare ">
            Compare multiple days
          </div>

          <div className="grid-item-form1-campare ">
            <div style={{ fontSize: 16, color: "#eb4034" }}>
              {this.state.error}
            </div>

            <LAMpoints
              info={this.infoHandler}
              SelectedAreaID={this.areaHandler}
              selectedYear={this.yearHandler}
              selectedMonth={this.monthHandler}
              selectedDay={this.startDayNumberHandler}
              selectedEndDay={this.endDaynumberHandler}
              ready={this.isChildreadyHandler}
              endDayDisabled={false}
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
              <div hidden={!this.state.btnDisabled}>
                Loading {this.state.counter} of {interval + 1}
              </div>
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

          <div className="grid-item-form2-campare ">
            <div style={{ fontSize: 16, color: "#eb4034" }}>
              {this.state.error2}
            </div>

            <LAMpoints
              info={this.infoHandler2}
              SelectedAreaID={this.areaHandler2}
              selectedYear={this.yearHandler2}
              selectedMonth={this.monthHandler2}
              selectedDay={this.startDayNumberHandler2}
              selectedEndDay={this.endDaynumberHandler2}
              ready={this.isChildreadyHandler2}
              endDayDisabled={false}
            />

            <Button
              type="button"
              className="my-1 mr-sm-2"
              id="drawGraph"
              onClick={this.buttonHandler2}
              disabled={this.state.btnDisabled2}
              block
              variant="danger">
              {this.state.btnDisabled2 ? "Loading ..." : "Draw Graph"}
            </Button>

            <div style={{ fontSize: 16, color: "#1878b5" }}>
              {this.state.message2}
              <div hidden={!this.state.btnDisabled}>
                Loading {this.state.counter2} of {interval2 + 1}
              </div>
            </div>
            <br />
            <div className="grid-item-info">
              <h5>TMS Information:</h5>
              <Table
                striped
                size="sm"
                style={{ fontSize: "16px", color: "#cc3b31" }}>
                <tbody>
                  <tr>
                    <td> TMS ID: </td>
                    <td>{id2}</td>
                  </tr>
                  <tr>
                    <td>Name: </td>
                    <td>{name2}</td>
                  </tr>
                  <tr>
                    <td>Status: </td>
                    <td>{status2}</td>
                  </tr>

                  <tr>
                    <td> Coordinates: </td>
                    <td>{coordinates2}</td>
                  </tr>

                  <tr>
                    <td>Address: </td>
                    <td>{address2}</td>
                  </tr>

                  <tr>
                    <td>Municipality: </td>
                    <td>{municipality2}</td>
                  </tr>
                  <tr>
                    <td>Province: </td>
                    <td>{province2}</td>
                  </tr>
                  <tr>
                    <td>Start Time: </td>
                    <td>{startTime2}</td>
                  </tr>
                  <tr>
                    <td>Direction 1: </td>
                    <td>{direction12}</td>
                  </tr>
                  <tr>
                    <td>Direction 2: </td>
                    <td>{direction22}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </div>

          <div className="grid-item-filter-campare ">
            <Form style={{ width: "100%" }}>
              <Form.Label
                className="my-1 mr-2"
                htmlFor="inlineFormCustomSelectPref">
                <h5>Filters:</h5>
              </Form.Label>
              <br></br>

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

          <div className="grid-item-graph1-campare ">
            <div className="grid-item-graph-child">
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="area"
                width={graphWidth}
              />
            </div>
          </div>

          <div className="grid-item-graph2-campare ">
            <div className="grid-item-graph-child">
              <Chart
                options={this.state.options2}
                series={this.state.series2}
                type="line"
                width={graphWidth}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CompareMultipleDays;
