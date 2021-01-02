import React, { Component } from "react";

export default class SVGIconComponent extends Component {
  render() {
    const perc = this.props.perc || 0;
    const color = this.props.color || "#6aa663";
    return (
      <svg
        width="40px"
        height="40px"
        viewBox="0 0 40 40"
        className="donut"
        aria-labelledby="beers-title beers-desc"
        role="img">
        <circle
          className="donut-hole"
          cx="20"
          cy="20"
          r="18"
          fill="white"
          role="presentation"></circle>
        <circle
          className="donut-ring"
          cx="20"
          cy="20"
          r="18"
          fill="transparent"
          stroke={color}
          strokeWidth="3"
          role="presentation"></circle>
        <g>
          <text
            style={{ fontSize: "10px" }}
            textAnchor="middle"
            x="50%"
            y="60%">
            {perc}
          </text>
        </g>
      </svg>
    );
  }
}
