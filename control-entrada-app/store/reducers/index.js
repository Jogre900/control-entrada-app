import { combineReducers } from "redux";
import ProfileReducer from "./profile";
import ApplicationReducer from "./application";
import EmployeeReducer from "./employies";
import VisitsReducer from "./visits";
import ZonesReducer from "./zones";

export default combineReducers({
  profile: ProfileReducer,
  employies: EmployeeReducer,
  application: ApplicationReducer,
  zones: ZonesReducer,
  visits: VisitsReducer,
});
