import "./index.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

import React from "react";
import ReactDOM from "react-dom";
import { Redirect, Route, Switch } from "react-router";
import { HashRouter } from "react-router-dom";

import App from "./App";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route exact path="/mainnet" component={() => <App network="mainnet" />} />
      <Route exact path="/testnet" component={() => <App network="testnet" />} />
      <Route component={() => <Redirect to="/mainnet" />} />
    </Switch>
  </HashRouter>,
  document.getElementById("root"),
);
