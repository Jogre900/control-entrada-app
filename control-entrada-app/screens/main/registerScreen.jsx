import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";


import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { MainColor } from "../../assets/colors";
import * as ImagePicker from "expo-image-picker";
// import * as ImagePicker from 'react-native-image-picker'
import { Ionicons } from "@expo/vector-icons";
import { storage } from "../../helpers/asyncStorage";
import { createCompany, login } from "../../helpers";
import { StatusModal } from "../../components/statusModal";
import { LoadingModal } from "../../components/loadingModal";
import { AdminForm } from '../../components/forms/adminForm'
import { CompanyForm } from '../../components/forms/companyForm'
import {
  validateName,
  validateEmail,
  validatePass,
  validatePhone,
  validateDni,
  validateLastName,
  validateRepPass,
  validateBusiness,
  validateCompany,
} from "../../helpers/forms";
import { connect } from "react-redux";
import { routes } from '../../assets/routes'
import { BackAction } from '../../helpers/ui/ui'

let statusModalValues = {
  visible: false,
  status: null,
  message: null,
};
let loadingModalValues = {
  status: false,
  message: null,
};

let captionInitialValues = {
  name: null,
  lastName: null,
  email: null,
  dni: null,
  password: null,
  repPass: null,
  companyName: null,
  businessName: null,
  nic: null,
  phoneNumber: null,
};

const RegisterScreen = ({
  navigation,
  saveProfile,
  saveCompany,
  saveLogin,
  savePrivilege,
  activeTutorial,
}) => {
  const [adminData, setAdminData] = useState({});
  const [companyData, setCompanyData] = useState({});
  const [statusModal, setStatusModal] = useState(statusModalValues);
  const [loadingModal, setLoadingModal] = useState(loadingModalValues);
  const [registerCaption, setRegisterCaption] = useState({});
  //const [passEqual, setPassEqual] = useState(false);

  const [caption, setCaption] = useState("");

  const [repeatCaption, setRepeatCaption] = useState("");
  const [check, setCheck] = useState(false);
 
  // const profilePic = (uri, fileName, fileType) => {
  //   setProfilePicData((values) => ({ ...values, uri, fileName, fileType }));
  // };
  // const companyPic = (uri, fileName, fileType) => {
  //   setCompPicData((values) => ({
  //     ...values,
  //     uriLogo: uri,
  //     fileNameLogo: fileName,
  //     fileTypeLogo: fileType,
  //   }));
  // };

const adminHandleChange = (name, value) => {
    setAdminData(values => ({...values, [name]: value}))
}

const companyHandleChange = (name, value) => {
  setCompanyData(values => ({...values, [name]: value}))
}
  const validateForm = (data) => {
    const nameError = validateName(data.name);
    const lastNameError = validateLastName(data.lastName);
    const emailError = validateEmail(data.email);
    const dniError = validateDni(data.dni);
    const passError = validatePass(data.password);
    const repPassError = validateRepPass(data.repPass);
    const companyError = validateCompany(data.companyName);
    const businessError = validateBusiness(data.businessName);
    const phoneError = validatePhone(data.phoneNumber);
    if (
      nameError ||
      lastNameError ||
      emailError ||
      dniError ||
      passError ||
      repPassError ||
      companyError ||
      businessError ||
      phoneError
    ) {
      setRegisterCaption((values) => ({
        ...values,
        name: nameError,
        lastName: lastNameError,
        email: emailError,
        password: passError,
        repPass: repPassError,
        dni: dniError,
        companyName: companyError,
        businessName: businessError,
        phoneError: phoneError,
      }));
      return true;
    }
  };

  //CREATE USER
  const createAdmin = async () => {
    // if (validateForm(dataComp)) {
    //   return;
    // }
    setLoadingModal({ status: true, message: "Guardando..." });
    //clearCaption();
    const res = await createCompany(adminData, companyData);
    //console.log("RES DE CREAT----", res.data);
    if (!res.data.error) {
      setLoadingModal((values) => ({ ...values, status: false }));
      setStatusModal((values) => ({
        ...values,
        visible: true,
        status: true,
        message: res.data.msg,
      }));
      //console.log(dataComp.email, dataComp.repPass)
      setLoadingModal({ visible: true, message: "Iniciando Sesión..." });
      const resLogin = await login(adminData.email, adminData.repPass);

      
      if (!resLogin.data.error) {
        console.log("RES DE LOGIN---------", resLogin.data.data.UserCompany[0].privilege);
        let slogin = {
          token: resLogin.data.token,
          userId: resLogin.data.data.id,
        };

        let sprofile = {
          id: resLogin.data.data.Employee.id,
          dni: resLogin.data.data.Employee.dni,
          name: resLogin.data.data.Employee.name,
          lastName: resLogin.data.data.Employee.lastName,
          picture: resLogin.data.data.Employee.picture,
          email: resLogin.data.data.email,
          userZone: resLogin.data.data.userZone[0],
        };
        if (resLogin.data.data.userZone.length > 0) {
          sprofile.userZone = resLogin.data.data.userZone;
        }
        let company = [];
        resLogin.data.data.UserCompany.map((comp) => {
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
        let privilege = resLogin.data.data.UserCompany[0].privilege;

        await storage.setItem("userToken", resLogin.data.token,);
        saveLogin(slogin);
        saveProfile(sprofile);
        saveCompany(company);
        savePrivilege(privilege);
        activeTutorial(true);

        switch (privilege) {
          case "Watchman":
            setLoadingModal((values) => ({ ...values, visible: false }));
            navigation.navigate("watch", {
              screen: "watch-home",
            });
            break;
          case "Admin":
          case "Supervisor":
            setLoadingModal((values) => ({ ...values, visible: false }));
            navigation.navigate("admin");
            break;
          default:
            break;
        }
      }
    } else {
      setLoadingModal((values) => ({ ...values, status: false }));
      setStatusModal((values) => ({
        ...values,
        visible: true,
        status: false,
        message: res.data.msg,
      }));
    }
  };
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  // useEffect(() => {
  //   if (dataComp.password && dataComp.repPass) {
  //     if (dataComp.password === dataComp.repPass) {
  //       setPassEqual(true);
  //     } else setPassEqual(false);
  //   }
  // }, [dataComp.password, dataComp.repPass]);

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Registro" leftControl={BackAction(navigation, routes.MAIN)} />
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <AdminForm
            handleChange={adminHandleChange}
            value={adminData}
            //caption={registerCaption}
          />
          <CompanyForm
            handleChange={companyHandleChange}
            value={companyData}
          />
          <View
            style={{ width: "90%", flexDirection: "row", alignItems: "center" }}
          >
            <CheckBox onChange={() => setCheck(!check)} value={check} />
            <View style={{ flexDirection: "row" }}>
              <Text>Acepto los</Text>
              <TouchableOpacity
                style={{ marginLeft: 2 }}
                onPress={() => navigation.navigate(routes.TERMS)}
              >
                <Text style={{ color: MainColor }}>Terminos y Condiciones</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: "90%" }}>
            <MainButton title="Enviar" 
            // onPress={() => console.log(adminData, companyData)}
            onPress={createAdmin} 
            />
          </View>
        </View>
      </ScrollView>
      <LoadingModal {...loadingModal} />
      <StatusModal
        {...statusModal}
        onClose={() =>
          setStatusModal((values) => ({ ...values, visible: false }))
        }
      />
    </View>
  );
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
  savePrivilege(privilege) {
    dispatch({
      type: "SAVE_PRIVILEGE",
      payload: privilege,
    });
  },
  activeTutorial(value) {
    dispatch({
      type: "TUTORIAL",
      payload: value,
    });
  },
});

export default connect(null, mapDispatchToProps)(RegisterScreen);

