import { ChainId } from "@iov/bcp";
import { bnsCodec } from "@iov/bns";
import { Bip39, EnglishMnemonic, Random } from "@iov/crypto";
import { Ed25519HdWallet, HdPaths } from "@iov/keycontrol";
import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Jumbotron from "react-bootstrap/Jumbotron";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";

import MnemonicInput from "./MnemonicInput";

interface AppProps {
  readonly network: "mainnet" | "testnet";
}

interface AppState {
  readonly generatedMnemonic: string | undefined;
  readonly step: "read" | "confirm" | "address";
  readonly words: readonly string[];
  readonly address: string | undefined;
}

function wordCountOk(count: number): boolean {
  return count === 12 || count === 15 || count === 18 || count === 21 || count === 24;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const emptyState: AppState = {
  generatedMnemonic: undefined,
  step: "read",
  words: [],
  address: undefined,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const confirmedState: AppState = {
  generatedMnemonic: "adjust fan defense project father wisdom early slender vicious song picnic detail",
  step: "address",
  words: [],
  address: "tiov12q9ngy4wl8tnl0px65e8f4zpcgspgcn05ncywj",
};

class App extends React.Component<AppProps, AppState> {
  public constructor(props: AppProps) {
    super(props);
    this.state = confirmedState;
  }

  public componentDidMount(): void {
    if (!this.state.generatedMnemonic) {
      this.randomize();
    }
  }

  public render(): JSX.Element {
    const otherLink =
      this.props.network === "mainnet" ? (
        <Link to="/testnet">Testnet mode</Link>
      ) : (
        <Link to="/mainnet">Mainnet mode</Link>
      );

    return (
      <Container>
        <Jumbotron>
          <Container>
            <h2>
              <span className="badge badge-primary">{this.props.network}</span>
            </h2>
            <h1>
              <span className="display-2">IOV Address Generator</span>
            </h1>
            <p>
              Here you can generate an IOV address for {this.props.network}. Please store this in a secure
              location. This is the only way to access your account. Lorem ipsum dolor sit amet, consetetur
              sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
              erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
            </p>
            <p>Switch to {otherLink} instead.</p>
          </Container>
        </Jumbotron>
        <Row>
          <Col></Col>
        </Row>
        <Row hidden={this.state.step !== "read"}>
          <Col>
            <Alert variant="info">
              <Alert.Heading>Your mnemonic:</Alert.Heading>
              <p>{this.state.generatedMnemonic}</p>
              <div className="d-flex justify-content-start">
                <Button onClick={() => this.randomize()} className="btn-sm" variant="outline-secondary">
                  Generate different one
                </Button>
              </div>

              <hr />

              <div className="d-flex justify-content-end">
                <Button
                  className="ml-2"
                  onClick={() => this.goToConfirm("discard")}
                  variant="outline-secondary"
                >
                  Skip (use externally generated mnemonic instead)
                </Button>
                <Button className="ml-2" onClick={() => this.goToConfirm("use")} variant="outline-primary">
                  Use this mnemonic
                </Button>
              </div>
            </Alert>
          </Col>
        </Row>
        <Row hidden={this.state.step !== "confirm"}>
          <Container>
            <div>
              <p>Type-in your mnemonic</p>
            </div>
            <div>
              <MnemonicInput id="input1" onWordsChanged={words => this.setState({ words: words })} />
              <p>
                <small>Enter 12, 15, 18, 21 or 24 words. {this.state.words.length} words entered.</small>
              </p>
            </div>
            <div className="d-flex justify-content-end">
              <Button disabled={!wordCountOk(this.state.words.length)} onClick={() => this.goToAddress()}>
                Generate {this.props.network} address
              </Button>
            </div>
          </Container>
        </Row>
        <Row hidden={this.state.step !== "address"}>
          <Container>{this.state.address}</Container>
        </Row>
      </Container>
    );
  }

  private goToConfirm(mnemonicAction: "discard" | "use"): void {
    if (mnemonicAction === "discard") {
      this.setState({
        generatedMnemonic: undefined,
      });
    }
    this.setState({ step: "confirm" });
  }

  private async goToAddress(): Promise<void> {
    try {
      const confirmed = new EnglishMnemonic(this.state.words.join(" "));

      if (this.state.generatedMnemonic) {
        if (this.state.generatedMnemonic !== confirmed.toString()) {
          throw new Error("The mnemonic you typed in does not match the generated mnemonic");
        }
      }

      const wallet = Ed25519HdWallet.fromMnemonic(confirmed.toString());
      const identity = await wallet.createIdentity("iov-lovenet" as ChainId, HdPaths.iov(0));
      const address = bnsCodec.identityToAddress(identity);

      this.setState({
        step: "address",
        address: address,
      });
    } catch (error) {
      console.error(error);
    }
  }

  private randomize(): void {
    (async () => {
      const mnemonic = Bip39.encode(await Random.getBytes(16)).toString();
      this.setState({ generatedMnemonic: mnemonic });
    })();
  }
}

export default App;
