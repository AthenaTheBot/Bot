import { useEffect, useContext } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./components/pages/Main/Main";
import Commands from "./components/pages/Commands/Commands";
import Servers from "./components/pages/Servers/Servers";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import PageNotFound from "./components/pages/PageNotFound/PageNotFound";
import Legal from "./components/pages/Legal/Legal";
import Error from "./components/pages/Error/Error";
import RickRoll from "./components/pages/RickRoll/RİckRoll";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import userContext from "./context/user/userContext";

const App = () => {
  const { getUser, getUserServers } = useContext(userContext);

  useEffect(() => {
    getUser();
    getUserServers();
  }, []);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Main />
        </Route>
        <Route exact path="/dashboard">
          <Servers />
        </Route>
        <Route path="/dashboard/:id/:category?">
          <Dashboard />
        </Route>
        <Route exact path="/commands">
          <Commands />
        </Route>
        <Route exact path="/privacy">
          <Legal page="privacy" />
        </Route>
        <Route exact path="/tos">
          <Legal page="terms" />
        </Route>
        <Route exact path="/error">
          <Error />
        </Route>
        <Route exact path="/source">
          <RickRoll />
        </Route>
        <Route exact>
          <PageNotFound />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
