import { createStore, combineReducers } from "redux";

const initialState = {
  profile: {},
  company: {},
};

const zonesState = {
  zones: []
}
const profileReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case "setProfile":
      return {
        ...state,
        profile: action.payload,
      };
    default:
      break;
    case "setCompany":
      return {
        ...state,
        company: action.payload,
      };
  }
  return state;
};

const zonesReducer = (state = zonesState, action) => {
  switch (action.type) {
    case "setZones":
      return {
        ...state,
        zones: action.payload
      }
      case "addZones":
        return {
          ...state,
          zones: state.zones.concat(action.payload)
        }
    default:
      break;
  }
  return state
}

const reducers = combineReducers({profileReducer, zonesReducer})
export default createStore(reducers);
