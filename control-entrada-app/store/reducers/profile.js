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
};

const companySelect = (state) => {
  return state.company.filter((c) => c.select == true)[0];
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionTypes.SET_LOGIN:
      return {
        ...state,
        login: action.payload,
        //companySelect: companySelect(state),
      };
    case "setProfile":
      return {
        ...state,
        profile: action.payload,
        //companySelect: companySelect(state),
      };
    case "setCompany":
      return {
        ...state,
        company: action.payload
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
    case "setPrivilege":
      return {
        ...state,
        login: { ...state.login, privilege: action.payload },
        companySelect: companySelect(state),
      };
      case "LOG_OUT":
      return {
        state: initialState,
      };
    default:
      return state;
  }
};
