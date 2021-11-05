export default (state = {}, action) => {
  switch (action.type) {
    case "GET_SERVER":
      return {
        ...state,
        server: action.payload,
      };
    default:
      return state;
  }
};
