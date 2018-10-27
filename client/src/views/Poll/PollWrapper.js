/*eslint-disable*/
import React from "react";
import { Route } from "react-router-dom";
import Poll from "./index";

const PollWrapp = props => {
  return (
    <div>
      <Route path={"/poll/:id"} component={Poll} />
      {props.location.pathname === "/poll" && <div><h4>Select any poll from <a href="/dashboard" >
              Dashboard
            </a></h4>
            </div>
          }
    </div>
  );
};

export default PollWrapp;
