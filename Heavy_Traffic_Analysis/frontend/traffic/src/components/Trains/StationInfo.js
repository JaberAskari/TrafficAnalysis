import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "react-bootstrap/Table";

const styles = {
  root: {
    width: "100%",
    height: "100%",
  },
};

export default class StationInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      allStationData: {},
      causeCategory: {},
      detailedCause: {},
    };
  }

  handleChange = (panel) => (event, isExpanded) => {
    let x = isExpanded ? panel : false;
    this.setState({ expanded: x });
  };

  selectedTrainInfo = () => {
    if (this.props.selectedTrainInfo.trainNumber !== undefined) {
      let output = this.props.selectedTrainInfo.timeTableRows.map(
        (station, i) => {
          let stationUICCode = station.stationUICCode;
          let stationInfo = this.props.allStationData[stationUICCode];
          let stationFullName = stationInfo.stationName;
          let type = station.type;
          let scheduledTime = station.scheduledTime;
          let actualTime = station.actualTime;
          let differenceInMinutes = station.differenceInMinutes;
          let trainStopping = station.trainStopping;
          trainStopping = trainStopping ? "Yes" : "No";

          let causes = station.causes;
          let delayCauses = "";
          let _color = "#1d648c";
          if (causes.length > 0) {
            _color = "#d43c19";
            let firstCause = "";
            let detailedCause = "";
            if (causes[0].categoryCodeId !== undefined) {
              firstCause = this.props.causeCategory[causes[0].categoryCodeId]
                .categoryName;
            }
            if (causes[0].detailedCategoryCodeId !== undefined) {
              detailedCause = this.props.detailedCause[
                causes[0].detailedCategoryCodeId
              ].detailedCategoryName;
            }
            delayCauses = firstCause + ", " + detailedCause;
          }
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
                    color: _color,
                    fontSize: "14px",
                    flexBasis: "70%",
                    flexShrink: 0,
                  }}>
                  {stationFullName}
                </Typography>
              </AccordionSummary>
              <AccordionDetails style={{}}>
                <Table
                  responsive="sm"
                  style={{ color: "#1d648c", fontSize: "13px" }}>
                  <tbody>
                    <tr>
                      <td>Station UI Code</td>
                      <td>{stationUICCode}</td>
                    </tr>
                    <tr>
                      <td>Type</td>
                      <td>{type}</td>
                    </tr>
                    <tr>
                      <td>Scheduled Time</td>
                      <td>{scheduledTime}</td>
                    </tr>
                    <tr>
                      <td>Actual Time</td>
                      <td>{actualTime}</td>
                    </tr>
                    <tr>
                      <td>Time Difference (m)</td>
                      <td>{differenceInMinutes}</td>
                    </tr>
                    <tr>
                      <td>Delay Causes</td>
                      <td>{delayCauses}</td>
                    </tr>
                    <tr>
                      <td>Train Stopping</td>
                      <td>{trainStopping}</td>
                    </tr>
                  </tbody>
                </Table>
              </AccordionDetails>
            </Accordion>
          );
        }
      );
      return output;
    }
  };

  render() {
    return (
      <div style={styles.root} className="overflow-auto">
        {this.selectedTrainInfo()}
      </div>
    );
  }
}
