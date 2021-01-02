import React from "react";
import Table from "react-bootstrap/Table";
import StationInfo from "./StationInfo";

const styles = {
  root: {
    width: "100%",
    fontSize: "13px",
    color: "#1d648c",
  },
  heading: {
    fontSize: "14px",
    color: "#6b6b6b",
  },
};

export default class TrainInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  oneTrainInfo = () => {
    let trainNumber = "";
    let category = "";
    let operator = "";
    let departure = "";
    var selectedTrainInfo = {};

    if (
      this.props.selectedTrain !== 0 &&
      Object.keys(this.props.cargoTrainsInfo).length > 0
    ) {
      selectedTrainInfo = this.props.cargoTrainsInfo[this.props.selectedTrain];
      trainNumber = selectedTrainInfo.trainNumber;
      category = selectedTrainInfo.trainCategory;
      operator = selectedTrainInfo.operatorShortCode;
      departure = selectedTrainInfo.departureDate;
    }

    return (
      <div style={styles.root} className="">
        <Table
          responsive="sm"
          style={{ fontSize: "14px", color: "#1d648c", marginTop: "10px" }}>
          <tbody>
            <tr>
              <td>Train Number</td>
              <td>{trainNumber}</td>
            </tr>
            <tr>
              <td>Category</td>
              <td>{category}</td>
            </tr>
            <tr>
              <td>Operator</td>
              <td>{operator}</td>
            </tr>
            <tr>
              <td>Departure Date</td>
              <td>{departure}</td>
            </tr>
          </tbody>
        </Table>
        <h6>Time table and stations:</h6>

        <StationInfo
          selectedTrainInfo={selectedTrainInfo}
          allStationData={this.props.allStationData}
          causeCategory={this.props.causeCategory}
          detailedCause={this.props.detailedCause}
        />
      </div>
    );
  };
  render() {
    return <div>{this.oneTrainInfo()}</div>;
  }
}
