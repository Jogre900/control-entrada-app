import { createStore, combineReducers } from "redux";

const initialState = {
  profile: {},
  company: {},
};

const employeeState = {
  employee: [],
  available: []
}
const zonesState = {
  zones: []
}

const visitsState = {
  today: []
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

const visitsReducer = (state = visitsState, action) => {
  switch (action.type) {
    case "SAVE_VISIT":
    return {
      ...state,
      today: state.today.concat(action.payload)
    }  
    default:
      break;
  }
  return state  
}

const employeeReducer = (state = employeeState, action) => {
  switch (action.type) {
    case "SAVE_EMPLOYEE":
      return {
        ...state,
        employee: state.employee.concat(action.payload)
      }
    case "SAVE_AVAILABLE":
      return {
        ...state,
        available: state.available.concat(action.payload)
      }
  
    default:
      break;
  }
  return state
}

const reducers = combineReducers({profileReducer, employeeReducer, zonesReducer, visitsReducer})
export default createStore(reducers);
