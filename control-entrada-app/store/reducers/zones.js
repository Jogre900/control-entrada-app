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
      console.log("payload: ", action.payload);
      console.log("zonesState: ", state.zones);
      let newZone = state.zones.filter(({id}) => !action.payload.includes(id));
      console.log("nueva zona: ", newZone);
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
