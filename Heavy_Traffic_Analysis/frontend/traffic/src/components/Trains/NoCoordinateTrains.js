import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TrainInfo from "./TrainInfo";

class NoCoordinateTrains extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleChange = (panel) => (event, isExpanded) => {
    let x = isExpanded ? panel : false;
    this.setState({ expanded: x });
  };

  trainList = () => {
    var trainList = "";
    if (
      this.props.faultyCargoTrainIDs.length > 0 &&
      Object.keys(this.props.cargoTrainsInfo).length > 0 &&
      Object.keys(this.props.allStationData).length > 0 &&
      Object.keys(this.props.causeCategory).length > 0 &&
      Object.keys(this.props.detailedCause).length > 0
    ) {
      trainList = this.props.faultyCargoTrainIDs.map((value, i) => {
        return (
          <Accordion
            key={i}
            expanded={this.state.expanded === i}
            onChange={this.handleChange(i)}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header">
              <Typography
                style={{
                  color: "#0a8024",
                  fontSize: "14px",
                  flexBasis: "70%",
                  flexShrink: 0,
                }}>
                {value}
              </Typography>
            </AccordionSummary>
            <AccordionDetails style={{ color: "#6b6b6b", fontSize: "13px" }}>
              <TrainInfo
                selectedTrain={value}
                cargoTrainsInfo={this.props.cargoTrainsInfo}
                allStationData={this.props.allStationData}
                causeCategory={this.props.causeCategory}
                detailedCause={this.props.detailedCause}
              />
            </AccordionDetails>
          </Accordion>
        );
      });
    }
    return trainList;
  };

  trainList_ = () => {
    var trainList = "";
    if (
      this.props.faultyCargoTrainIDs.length > 0 &&
      Object.keys(this.props.cargoTrainsInfo).length > 0 &&
      Object.keys(this.props.allStationData).length > 0 &&
      Object.keys(this.props.causeCategory).length > 0 &&
      Object.keys(this.props.detailedCause).length > 0
    ) {
      trainList = this.props.faultyCargoTrainIDs.map((value, i) => {
        return (
          <div
            style={{
              borderStyle: "solid",
              borderColor: "#f2f2f2",
              borderRadius: "5px",
              padding: "10px",
              marginTop: "20px",
            }}
            key={i}>
            <h5
              style={{
                color: "#0a8024",
                textAlign: "center",
                flexBasis: "70%",
                flexShrink: 0,
              }}>
              {value}
            </h5>

            <div style={{ color: "#6b6b6b", fontSize: "13px" }}>
              <TrainInfo
                selectedTrain={value}
                cargoTrainsInfo={this.props.cargoTrainsInfo}
                allStationData={this.props.allStationData}
                causeCategory={this.props.causeCategory}
                detailedCause={this.props.detailedCause}
              />
            </div>
          </div>
        );
      });
    }
    return trainList;
  };

  render() {
    return (
      <div style={{ marginTop: "20px", color: "#497ec4", fontSize: "15px" }}>
        List of trains that has no active GPS:
        {this.trainList()}
      </div>
    );
  }
}

export default NoCoordinateTrains;
