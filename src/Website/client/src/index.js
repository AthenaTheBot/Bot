import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import UserState from "./context/user/userState";

ReactDOM.render(
  <UserState>
    <App />
  </UserState>,
  document.getElementById("root")
);
