import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import iovLogo from "./assets/iov-logo.svg";

class Header extends React.Component<{}, {}> {
  public render(): JSX.Element {
    return (
      <Row>
        <Col>
          <img className="mt-3 mb-3" alt="IOV logo" src={iovLogo} height={56} />
        </Col>
      </Row>
    );
  }
}

export default Header;
