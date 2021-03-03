import * as actionTypes from "../actions/actionTypes";
const initialState = {
  zones: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case "setZones":
      return {
        ...state,
        zones: action.payload
      };
    case "addZones":
      return {
        ...state,
        zones: state.zones.concat(action.payload),
      };
    case "REMOVE_ZONES":
     
      let newZone = state.zones.filter(({id}) => !action.payload.includes(id));
      return {
        ...state,
        zones: newZone,
      };
    case "CLEAR_STORAGE":
      return {
        zones: []
      }  
    default:
      return state;
  }
};
