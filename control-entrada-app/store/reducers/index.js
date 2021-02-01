import { combineReducers } from "redux";
import ProfileReducer from "./profile";
import ApplicationReducer from "./application";
import EmployeeReducer from "./employee";
import VisitsReducer from "./visits";
import ZonesReducer from "./zones";

export default combineReducers({
  profile: ProfileReducer,
  employee: EmployeeReducer,
  application: ApplicationReducer,
  zones: ZonesReducer,
  visits: VisitsReducer,
});
