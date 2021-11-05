import types from "../types";

export default (state, action) => {
  switch (action.type) {
    case types.GET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case types.GET_USER_SERVERS:
      return {
        ...state,
        userServers: action.payload,
      };

    default:
      return state;
  }
};
