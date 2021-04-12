import * as actionTypes from "../actions/actionTypes";
const initialState = {
  destinys: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case "SAVE_DESTINY":
    //console.log("SAVE DESTINY-----", action.payload)  
    return {
        ...state,
        destinys: action.payload
      };
    case "ADD_DESTINY":
      return {
        ...state,
        destinys: state.destinys.concat(action.payload),
      };
    case "REMOVE_DESTINY":
      
    let removed = state.destinys.filter(({id}) => !action.payload.includes(id));
      return {
        ...state,
        destinys: removed,
      };
    case "CLEAR_STORAGE":
      return {
        destinys: []
      }  
    default:
      return state;
  }
};
