import "react-bootstrap-typeahead/css/Typeahead.css";

import React from "react";
import ReactDOM from "react-dom";
import { Redirect, Route, Switch } from "react-router";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/mainnet" component={() => <App network="mainnet" />} />
      <Route exact path="/testnet" component={() => <App network="testnet" />} />
      <Route component={() => <Redirect to="/mainnet" />} />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root"),
);
