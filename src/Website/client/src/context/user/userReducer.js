import types from "../types";

export default (state, action) => {
  switch (action.type) {
    case types.GET_USER:
      return {
        ...state,
        user: action.payload,
      };

    case types.GET_SERVERS:
      return {
        ...state,
        servers: action.payload,
      };

    default:
      return state;
  }
};
