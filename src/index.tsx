import "react-bootstrap-typeahead/css/Typeahead.css";

import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" render={() => <App network="mainnet" />} />
      <Route exact path="/mainnet" render={() => <App network="mainnet" />} />
      <Route exact path="/testnet" render={() => <App network="testnet" />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root"),
);
