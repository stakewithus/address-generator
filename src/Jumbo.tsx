import React from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

interface JumboProps {
  readonly network?: "mainnet" | "testnet";
}

class Jumbo extends React.Component<JumboProps, {}> {
  public render(): JSX.Element {
    const otherLink =
      this.props.network === "mainnet" ? (
        <Link to="/testnet">Testnet</Link>
      ) : (
        <Link to="/mainnet">Mainnet</Link>
      );

    return (
      <Row>
        <Col>
          <Jumbotron>
            <Container>
              <h2>
                <span className="display-2 d-inline-block mr-2">Address Generator</span>
                <small className="badge badge-primary align-top" hidden={!this.props.network}>
                  {this.props.network}
                </small>
              </h2>
              <p className="mb-0" hidden={!this.props.network}>
                Here you can generate an IOV address for {this.props.network}. Switch to the address generator
                for {otherLink} instead.
              </p>
            </Container>
          </Jumbotron>
        </Col>
      </Row>
    );
  }
}

export default Jumbo;
