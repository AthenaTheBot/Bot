import { useReducer } from "react";
import { useCookies } from "react-cookie";
import $ from "jquery";
import UserContext from "./userContext";
import UserReducer from "./userReducer";

const initialState = {
  user: null,
  userServers: [],
  cookies: {},
};

// TODO: Don't stress back end if there isn't any session token.
const UserState = (props) => {
  const [state, dispatch] = useReducer(UserReducer, initialState);
  const [cookies] = useCookies(0);

  const getUser = async () => {
    if (!cookies?.session) return;
    const user = await $.get("/api/users/@me")
      .then((res) => res.data)
      .catch((err) => {});
    if (!user) return;
    dispatch({ type: "GET_USER", payload: user });
  };

  const getServers = async () => {
    const servers = await $.get("/api/users/@me/guilds?selectManageable=true")
      .then((res) => res.data)
      .catch((err) => {});
    if (!servers) return;
    dispatch({ type: "GET_SERVERS", payload: servers });
  };

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        servers: state.servers,
        getUser,
        getServers,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
