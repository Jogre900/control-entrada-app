import * as actionTypes from "../actions/actionTypes";

const initialState = {
  login: {
    token: "",
    userId: "",
    privilege: "",
  },
  profile: {
    id: "",
    dni: "",
    name: "",
    lastName: "",
    picture: "",
    email: "",
    userZone: [],
  },
  company: [
    {
      id: "",
      companyName: "",
      businessName: "",
      nic: "",
      city: "",
      address: "",
      phoneNumber: "",
      phoneNumberOther: "",
      logo: "",
      privilege: "",
      select: false,
    },
  ],
  notification: [],
  notificationNotRead: [],
  tutorial: false,
  deviceToken: "",
};

const companySelect = (state) => {
  return state.company.filter((c) => c.select == true)[0];
};

//UPDATE NOTIFICATION
const updateNoti = (newNoti, state) => {
  let prueba = [];
  //console.log("state noti--", state.notification);
  prueba = state.notification.map(
    (obj) => newNoti.find((o) => o.id === obj.id) || obj
  );
  //console.log("PRUEBA--", prueba);
  return prueba;
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case "SAVE_TOKEN":
      console.log("deviceToken", action.payload);
      return {
        ...state,
        deviceToken: action.payload,
      };
    case actionTypes.SET_LOGIN:
      return {
        ...state,
        login: action.payload,
        //company: companySelect(state),
      };
    case "SAVE_PROFILE":
      return {
        ...state,
        profile: action.payload,
        //companySelect: companySelect(state),
      };
    case "SAVE_COMPANY":
      return {
        ...state,
        company: action.payload,
        //companySelect: companySelect(state),
      };
    case "setCompanySelect":
      let setComapny = state.company.map((c) => {
        if (c.id == action.payload) {
          c.select = true;
        } else {
          c.select = false;
        }
      });
      return {
        ...state,
        company: setComapny,
        companySelect: companySelect(state),
      };
    case "SAVE_PRIVILEGE":
      return {
        ...state,
        login: { ...state.login, privilege: action.payload },
        companySelect: companySelect(state),
      };
    case "SAVE_NOTI":
      return {
        ...state,
        notification: action.payload,
      };
    case "SAVE_NOTI_NOT_READ":
      return {
        ...state,
        notificationNotRead: action.payload,
      };
    case "UPDATE_READ":
      console.log("PAYLOAD NOTI-", action.payload);
      console.log(state.notificationNotRead)
      
      let notReadFilter = state.notificationNotRead.filter(
        ({ id }) => action.payload.find((elem) => elem.id !== id));
      console.log(notReadFilter)
      return {
        ...state,
        notificationNotRead: notReadFilter,
        notification: updateNoti(action.payload, state),
      };
    case "TUTORIAL":
      return {
        ...state,
        tutorial: action.payload,
      };
    case "TURN_OFF":
      return {
        ...state,
        tutorial: action.payload,
      };
    case "CLEAR_STORAGE":
      return {
        company: [],
        profile: {},
        login: {},
        notification: [],
        notificationNotRead: [],
      };
    default:
      return state;
  }
};
