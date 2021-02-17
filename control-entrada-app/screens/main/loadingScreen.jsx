import React, {useEffect} from 'react'

import {SplashScreen} from '../../components/splashScreen.component'
import {storage} from '../../helpers/asyncStorage'
import axios from 'axios'
import {API_PORT} from '../../config/index'
import {connect} from 'react-redux'
const LoadingScreen = ({navigation, saveProfile, saveCompany, saveLogin}) => {
    
    const signInStatus = async () => {
        const token = await storage.getItem("userToken")
        if (token) {
          try {
            //TODO verificar esta ruta en la api para que de la estructura nueva
            let res = await axios.get(`${API_PORT()}/api/verifyToken`, {
              headers: {
                Authorization: `bearer ${token}`,
              },
            });
            console.log(res.data)
            //console.log("RES DE TOKEN----", res.data.data.UserCompany[0].privilege)
            if (res.data.error && res.data.msg === "jwt expired") {
              navigation.navigate('Main')
              return;
            }
            if (!res.data.error) {
              let slogin = {
                token: res.data.token,
                userId: res.data.data.id,
                privilege: res.data.data.UserCompany[0].privilege
              };
              let sprofile = {
                id: res.data.data.Employee.id,
                dni: res.data.data.Employee.dni,
                name: res.data.data.Employee.name,
                lastName: res.data.data.Employee.lastName,
                picture: res.data.data.Employee.picture,
                email: res.data.data.email,
              };
              if(res.data.data.userZone.length > 0){
                sprofile.userZone = res.data.data.userZone
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
                  select: true,
                });
              });
      
              saveLogin(slogin);
              saveProfile(sprofile);
              saveCompany(company);
              switch (res.data.data.UserCompany[0].privilege) {
                case "Admin":
                  navigation.navigate("admin", { screen: "admin-home" });
                case "Supervisor":
                  navigation.navigate("admin", { screen: "admin-home" });
                  break;
                case "Watchman":
                  navigation.navigate("watch", { screen: "watch-home" });
                  break;
                default:
                  break;
              }
            }
          } catch (error) {
            alert(error.message);
          }
        }else navigation.navigate('Main')
      };

    useEffect(() => {
        signInStatus();
      }, []);
    return (
     <SplashScreen/>   
    )
}

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
    saveLogin(login){
      dispatch({
        type: 'SET_LOGIN',
        payload: login
      })
    }
  });
export default connect(null, mapDispatchToProps)(LoadingScreen)
