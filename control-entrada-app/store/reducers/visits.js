import * as actionTypes from "../actions/actionTypes";
const initialState = {
  today: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case "SAVE_VISITS":
      return {
        ...state,
        today: action.payload
      };
      case "REMOVE_VISIT":
      const newVisits = state.today.filter(({id}) => !action.payload.includes(id))  
      return {
          ...state,
          today: newVisits 
        }
        case "CLEAR_STORAGE":
      return {
        today: []
      }  
    default:
      return state;
  }
};
