import * as actionTypes from "../actions/actionTypes";
const initialState = {
  employee: [],
  available: [],
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
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
      return state;
  }
};
