import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch } from "react-router-dom";

import "./axios/config";

import { refreshToken } from "./actions/auth";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import store, { history } from "./store/configureStore";
import "assets/css/material-dashboard-react.css?v=1.5.0";
import "assets/css/styles.css";

import indexRoutes from "routes/index.jsx";

if (localStorage.jwtToken) {
  const token = localStorage.jwtToken.split(" ")[1];
  store.dispatch(refreshToken({ token }));
}

const app = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        {indexRoutes.map((prop, key) => {
          return (
            <Route path={prop.path} component={prop.component} key={key} />
          );
        })}
      </Switch>
    </ConnectedRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
