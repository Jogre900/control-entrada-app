import * as actionTypes from "../actions/actionTypes";
const initialState = {
  today: [],
};

//UPDATE VISIT
const updateVisit = (newVisit, state) => {
  let filterVisit = state.today.filter(({ id }) => id !== newVisit.id);
  let newArray = filterVisit.concat(newVisit);
  return newArray;
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case "SAVE_VISITS":
      return {
        ...state,
        today: action.payload,
      };
    case "UPDATE_VISIT":
      return {
        ...state,
        today: updateVisit(action.payload, state),
      };
    case "REMOVE_VISIT":
      const newVisits = state.today.filter(
        ({ id }) => !action.payload.includes(id)
      );
      return {
        ...state,
        today: newVisits,
      };
    case "CLEAR_STORAGE":
      return {
        today: [],
      };
    default:
      return state;
  }
};
