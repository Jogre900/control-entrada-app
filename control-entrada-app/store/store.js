import { createStore, combineReducers } from "redux";
import { xor } from "lodash.xor";

const initialState = {
  profile: {},
  company: {},
};

const employeeState = {
  employee: [],
  available: [],
};
const zonesState = {
  zones: [],
};

const visitsState = {
  today: [],
};
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
        zones: action.payload,
      };
    case "addZones":
      return {
        ...state,
        zones: state.zones.concat(action.payload),
      };
    case "REMOVE_ZONES":
      console.log("payload: ", action.payload);
      console.log("zonesState: ", state.zones);
      let newZone = state.zones.filter((z) => !action.payload.includes(z.id));
      console.log("nueva zona: ", newZone);
      return {
        ...state,
        zones: newZone,
      };
    default:
      break;
  }
  return state;
};

const visitsReducer = (state = visitsState, action) => {
  switch (action.type) {
    case "SAVE_VISIT":
      return {
        ...state,
        today: state.today.concat(action.payload),
      };
    default:
      break;
  }
  return state;
};

const employeeReducer = (state = employeeState, action) => {
  switch (action.type) {
    // ALL EMPLOYEE FROM DB
    case "SAVE_EMPLOYEE":
      return {
        ...state,
        employee: state.employee.concat(action.payload),
      };
    //ADD NEW EMPLOYEE
    case "ADD_EMPLOYEE":
    //console.log("new employee payload:--",action.payload)  
    return {
        ...state,
        employee: state.employee.concat(action.payload),
      };
      //console.log("todos los employee del state:", state.employee)
    // EMPLOYEE FROM DB
    case "SAVE_AVAILABLE":
      return {
        ...state,
        available: state.available.concat(action.payload),
      };
    // AFTER DELETE A ZONE
    case "SET_AVAILABLE":
      return {
        ...state,
        available: state.available.concat(action.payload),
      };
    case "ASIGN_EMPLOYEE":
      //console.log(action.payload);
      return {
        ...state,
        available: state.available.filter(({ id }) => id !== action.payload.id),
        //employee: state.employee.concat(action.payload)
      };
    default:
      break;
  }
  return state;
};

const reducers = combineReducers({
  profileReducer,
  employeeReducer,
  zonesReducer,
  visitsReducer,
});
export default createStore(reducers);
