import React, { useEffect } from "react";

import { SplashScreen } from "../../components/splashScreen.component";
import { storage } from "../../helpers/asyncStorage";
import axios from "axios";
import { API_PORT } from "../../config/index";
import { routes } from "../../assets/routes";
import { connect } from "react-redux";
const LoadingScreen = ({ navigation, saveProfile, saveCompany, saveLogin }) => {
  const signInStatus = async () => {
    const token = await storage.getItem("userToken");
    if (token) {
      try {
        //TODO verificar esta ruta en la api para que de la estructura nueva
        let res = await axios.get(`${API_PORT()}/api/verifyLogin`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });

        console.log("res de verifi Token---",res.data)
        if(res.data.msg === 'Cuenta suspendida'){
          alert(res.data.msg)
          navigation.navigate(routes.MAIN);
          return;
        }
        //console.log("RES DE TOKEN----", res.data.data.UserCompany[0].privilege)
        if (res.data.error || res.data.msg === "jwt expired") {
          navigation.navigate(routes.MAIN);
          return;
        }
        if (!res.data.error) {
          let slogin = {
            token: res.data.token,
            userId: res.data.data.id,
            privilege: res.data.data.UserCompany[0].privilege,
          };
          let sprofile = {
            id: res.data.data.Employee.id,
            dni: res.data.data.Employee.dni,
            name: res.data.data.Employee.name,
            lastName: res.data.data.Employee.lastName,
            picture: res.data.data.Employee.picture,
            email: res.data.data.email,
          };
          if (res.data.data.userZone.length > 0) {
            sprofile.userZone = res.data.data.userZone;
          }
          let company = [];
          res.data.data.UserCompany.map((comp) => {
            company.push({
              id: comp.Company.id,
              companyName: comp.Company.companyName,
              businessName: comp.Company.businessName,
              nic: comp.Company.nic,
              city: comp.Company.city,
              address: comp.Company.address,
              phoneNumber: comp.Company.phoneNumber,
              phoneNumberOther: comp.Company.phoneNumberOther,
              logo: comp.Company.logo,
              privilege: comp.privilege,
              visits: comp.visits,
              select: true,
            });
          });

          saveLogin(slogin);
          saveProfile(sprofile);
          saveCompany(company);
          switch (res.data.data.UserCompany[0].privilege) {
            case "Admin":
              navigation.navigate(routes.ADMIN, { screen: routes.ADMIN_HOME });
            case "Supervisor":
              navigation.navigate(routes.ADMIN, { screen: routes.ADMIN_HOME });
              break;
            case "Watchman":
              navigation.navigate(routes.WATCH, { screen: routes.WATCH_HOME });
              break;
            default:
              break;
          }
        }
      } catch (error) {
        alert(error);
        navigation.navigate(routes.MAIN);
      }
    } else navigation.navigate(routes.MAIN);
  };

  useEffect(() => {
    signInStatus();
  }, []);
  return <SplashScreen />;
};

const mapDispatchToProps = (dispatch) => ({
  saveProfile(profile) {
    dispatch({
      type: "SAVE_PROFILE",
      payload: profile,
    });
  },
  saveCompany(company) {
    dispatch({
      type: "SAVE_COMPANY",
      payload: company,
    });
  },
  saveLogin(login) {
    dispatch({
      type: "SET_LOGIN",
      payload: login,
    });
  },
});
export default connect(null, mapDispatchToProps)(LoadingScreen);
