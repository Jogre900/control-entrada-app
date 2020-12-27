import * as actionTypes from "../actions/actionTypes";
const initialState = {
  today: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case "SAVE_VISIT":
      return {
        ...state,
        today: state.today.concat(action.payload),
      };
    default:
      return state;
  }
};
