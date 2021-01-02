import Control from "react-leaflet-control";
import React, { Component } from "react";

class Legend extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Control position="topright">
        <div
          style={{
            fontSize: "12px",
            fontWeight: "",
            backgroundColor: "#fafafa",
            padding: "5px",
            borderRadius: "4px",
            textAlign: "left",
          }}>
          <div>
            <svg height="10" width="42">
              <line
                x1="0"
                y1="5"
                x2="35"
                y2="5"
                style={{ stroke: "#326fa8", strokeWidth: 3 }}
              />
              Sorry, your browser does not support inline SVG.
            </svg>
            H
          </div>
          <div>
            <svg height="10" width="42">
              <line
                x1="0"
                y1="5"
                x2="35"
                y2="5"
                style={{ stroke: "#0a8024", strokeWidth: 3 }}
              />
              Sorry, your browser does not support inline SVG.
            </svg>
            H+T
          </div>

          <div>
            <svg height="10" width="42">
              <line
                x1="0"
                y1="5"
                x2="35"
                y2="5"
                style={{ stroke: "#cc720a", strokeWidth: 3 }}
              />
              Sorry, your browser does not support inline SVG.
            </svg>
            T
          </div>

          <div>
            <svg height="10" width="42">
              <line
                x1="0"
                y1="5"
                x2="35"
                y2="5"
                style={{ stroke: "#db0404", strokeWidth: 3 }}
              />
              Sorry, your browser does not support inline SVG.
            </svg>
            SULJETTU
          </div>

          <div>
            <svg height="10" width="42">
              <line
                x1="0"
                y1="5"
                x2="35"
                y2="5"
                style={{ stroke: "#5c3ccf", strokeWidth: 3 }}
              />
              Sorry, your browser does not support inline SVG.
            </svg>
            MUSEO
          </div>
        </div>
      </Control>
    );
  }
}

export default Legend;
