import Card from "react-bootstrap/Card";
import React from "react";
import "../App.css";

class Footer extends React.Component {
  render() {
    return (
      <Card.Footer
        className="text-muted "
        style={{ marginTop: "60px", backgroundColor: "#ebebeb" }}>
        <div className="Footer">
          <div className="FooterContainer">
            <div className="FooterContact">
              <h5>Contact:</h5>
              Jaber Askari <br />
              Institute of Technogy <br />
              JAMK Universtiy Of Applied Science <br />
              rebaj.askari@gmail.com
            </div>
            <div className="FooterSources">
              <h5>Sources:</h5>
              <a href="https://www.digitraffic.fi/">www.digiroad.fi</a>
              <br />
              <a href="https://vayla.fi/avoindata">vayla.fi/avoindata</a>
              <br />
            </div>
          </div>
        </div>
      </Card.Footer>
    );
  }
}

export default Footer;
