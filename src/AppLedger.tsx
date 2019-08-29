import { Address } from "@iov/bcp";
import { IovLedgerApp, isLedgerAppAddress, isLedgerAppVersion } from "@iov/ledger-bns";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import Header from "./Header";
import Jumbo from "./Jumbo";

interface AddressResponse {
  readonly address: Address;
  readonly network: "mainnet" | "testnet";
}

async function getAddressFromLedger(index: number): Promise<AddressResponse> {
  const transport = await TransportWebUSB.create(1000);
  const app = new IovLedgerApp(transport);
  const version = await app.getVersion();
  if (!isLedgerAppVersion(version)) throw new Error(version.errorMessage);
  const response = await app.getAddress(index);
  if (!isLedgerAppAddress(response)) throw new Error(response.errorMessage);
  transport.close();

  return {
    address: response.address as Address,
    network: version.testMode ? "testnet" : "mainnet",
  };
}

interface AppLedgerProps {
  readonly network: "mainnet" | "testnet";
}

interface AppLedgerState {
  readonly errorMessage: string | undefined;
  readonly address: string | undefined;
}

const emptyState: AppLedgerState = {
  errorMessage: undefined,
  address: undefined,
};

class AppLedger extends React.Component<AppLedgerProps, AppLedgerState> {
  public constructor(props: AppLedgerProps) {
    super(props);
    this.state = {
      ...emptyState,
    };
  }

  public render(): JSX.Element {
    return (
      <Container className="mb-5">
        <Header />
        <Jumbo title="IOV Ledger" network={this.props.network} />
        <Row>
          <Col>
            <h3>Use Ledger for address generation</h3>
            <p>Connect a Leder Nano S and continue.</p>
            <p className="text-center">
              <Button onClick={() => this.tryLedger()}>
                Get my {this.props.network} address from Ledger Nano S
              </Button>
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert variant="danger" hidden={!this.state.errorMessage}>
              <p className="mb-0">{this.state.errorMessage}</p>
            </Alert>
            <Alert variant="success" hidden={!this.state.address}>
              <p className="mb-0">
                <strong>Your IOV address:</strong>
                <br />
                {this.state.address}
              </p>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  private async tryLedger(): Promise<void> {
    this.setState({ ...emptyState });

    try {
      const result = await getAddressFromLedger(0);

      if (result.network !== this.props.network) {
        throw new Error(
          `Expected '${this.props.network}' but got response for '${result.network}'. Did you open the correct app on the Ledger?`,
        );
      }

      this.setState({
        address: result.address,
      });
    } catch (error) {
      console.warn(error);
      this.setState({
        errorMessage: error instanceof Error ? error.message : error.toString(),
      });
    }
  }
}

export default AppLedger;
