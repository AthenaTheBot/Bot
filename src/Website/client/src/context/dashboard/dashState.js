import { useReducer } from "react";
import dashContext from "./dashContext";
import DashContext from "./dashContext";
import DashReducer from "./dashReducer";
import $ from 'jquery';

const initialData = {
    server: null,
}

const DashState = (props) => {
    const [state, dispath] = useReducer(DashReducer, initialData);

    const getServer = async (guildId) => {
      if (!guildId) return;
      const server = await $.get(`/api/guilds/${guildId}`).then(res => res.data).catch(err => {});
      if (!server) return;
      dispath({
        type: "GET_SERVER",
        payload: server
      });
    }

  return <dashContext.Provider value={...state}>{props.children}</dashContext.Provider>;
};

export default DashState;
