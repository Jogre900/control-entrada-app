import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";

import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { MainColor, Success } from "../../assets/colors";
import * as ImagePicker from "expo-image-picker";
// import * as ImagePicker from 'react-native-image-picker'
import { Ionicons } from "@expo/vector-icons";
import { storage } from "../../helpers/asyncStorage";
import { FormContainer } from "../../components/formContainer";
import { CameraModal } from "../../components/cameraModal";
import Avatar from "../../components/avatar.component";
import { createCompany, login } from "../../helpers";
import { StatusModal } from "../../components/statusModal";
import { LoadingModal } from "../../components/loadingModal";
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

const inputProps = {
  shape: "flat",
  textColor: "grey",
};

let registerValues = {
  companyName: null,
  businessName: null,
  nic: null,
  city: null,
  address: null,
  phoneNumber: null,
  phoneNumberOther: null,
  dni: null,
  name: null,
  lastName: null,
  email: null,
  password: null,
  repPass: null,
};
let profilePicValues = {
  uri: null,
  fileName: null,
  fileType: null,
};
let compLogoValues = {
  uriLogo: null,
  fileNameLogo: null,
  fileTypeLogo: null,
};

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
  const [dataComp, setDataComp] = useState(registerValues);
  const [profilePicData, setProfilePicData] = useState(profilePicValues);
  const [compPicData, setCompPicData] = useState(compLogoValues);
  const [camera, setCamera] = useState(false);
  const [type, setType] = useState("");
  const [statusModal, setStatusModal] = useState(statusModalValues);
  const [loadingModal, setLoadingModal] = useState(loadingModalValues);
  const [registerCaption, setRegisterCaption] = useState(captionInitialValues);
  const [passEqual, setPassEqual] = useState(false);

  const [caption, setCaption] = useState("");

  const [repeatCaption, setRepeatCaption] = useState("");
  const [check, setCheck] = useState(false);
  //GOBACK
  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  const profilePic = (uri, fileName, fileType) => {
    setProfilePicData((values) => ({ ...values, uri, fileName, fileType }));
  };
  const companyPic = (uri, fileName, fileType) => {
    setCompPicData((values) => ({
      ...values,
      uriLogo: uri,
      fileNameLogo: fileName,
      fileTypeLogo: fileType,
    }));
  };

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
    const res = await createCompany(dataComp, profilePicData, compPicData);
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
      const resLogin = await login(dataComp.email, dataComp.repPass);

      
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

  useEffect(() => {
    if (dataComp.password && dataComp.repPass) {
      if (dataComp.password === dataComp.repPass) {
        setPassEqual(true);
      } else setPassEqual(false);
    }
  }, [dataComp.password, dataComp.repPass]);

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Registro" leftControl={goBackAction()} />
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <FormContainer title="Datos Personales">
            <View style={styles.pictureContainer}>
              {profilePicData.uri ? (
                <Avatar.Picture size={120} uri={profilePicData.uri} />
              ) : (
                <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
              )}
              <TouchableOpacity
                onPress={() => {
                  setCamera(true), setType("profile");
                }}
                style={styles.openCameraButton}
              >
                <Ionicons name="ios-camera" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <Input
              title="Nombres"
              icon="ios-person"
              onChangeText={(name) =>
                setDataComp((values) => ({ ...values, name }))
              }
              {...inputProps}
              caption={registerCaption.name}
            />
            <Input
              title="Apellidos"
              icon="ios-person"
              onChangeText={(lastName) =>
                setDataComp((values) => ({ ...values, lastName }))
              }
              {...inputProps}
              caption={registerCaption.lastName}
            />
            <Input
              title="DNI"
              icon="ios-card"
              onChangeText={(dni) =>
                setDataComp((values) => ({ ...values, dni }))
              }
              caption={registerCaption.dni}
              {...inputProps}
            />
            <Input
              title="Correo"
              icon="ios-mail"
              onChangeText={(email) =>
                setDataComp((values) => ({ ...values, email }))
              }
              caption={registerCaption.email}
              {...inputProps}
            />
            <Input
              style={{ borderColor: passEqual && Success }}
              title="Contraseña"
              onChangeText={(password) =>
                setDataComp((values) => ({ ...values, password }))
              }
              caption={registerCaption.password}
              secureTextEntry
              {...inputProps}
            />
            <Input
              style={{ borderColor: passEqual && Success }}
              title="Repetir Contraseña"
              onChangeText={(repPass) =>
                setDataComp((values) => ({ ...values, repPass }))
              }
              caption={registerCaption.repPass}
              secureTextEntry
              {...inputProps}
            />
            <View>
              <Text style={styles.caption}>{caption}</Text>
            </View>
          </FormContainer>
          <FormContainer title="Datos de la empresa">
            <Text style={styles.labelText}>
              Puedes agregar un logo para tu empresa
            </Text>
            <View style={styles.pictureContainer}>
              {compPicData.uriLogo ? (
                <Avatar.Picture size={120} uri={compPicData.uriLogo} />
              ) : (
                <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
              )}
              <TouchableOpacity
                onPress={() => {
                  setCamera(true), setType("logo");
                }}
                style={styles.openCameraButton}
              >
                <Ionicons name="ios-camera" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <Input
              title="Empresa"
              icon="md-business"
              onChangeText={(companyName) =>
                setDataComp((values) => ({ ...values, companyName }))
              }
              {...inputProps}
              caption={registerCaption.companyName}
            />
            <Input
              title="Razon social"
              icon="ios-briefcase"
              onChangeText={(businessName) =>
                setDataComp((values) => ({ ...values, businessName }))
              }
              {...inputProps}
              caption={registerCaption.businessName}
            />
            <Input
              title="nic"
              onChangeText={(nic) =>
                setDataComp((values) => ({ ...values, nic }))
              }
              {...inputProps}
              caption={registerCaption.nic}
            />
            <Input
              title="Direccion (Opcional)"
              icon="ios-pin"
              onChangeText={(address) =>
                setDataComp((values) => ({ ...values, address }))
              }
              {...inputProps}
            />
            <Input
              title="Ciudad (Opcional)"
              icon="ios-home"
              onChangeText={(city) =>
                setDataComp((values) => ({ ...values, city }))
              }
              {...inputProps}
            />
            <Input
              title="Telefono"
              icon="md-call"
              onChangeText={(phoneNumber) =>
                setDataComp((values) => ({ ...values, phoneNumber }))
              }
              {...inputProps}
              caption={registerCaption.phoneNumber}
            />
            <Input
              title="Telefono adicional (Opcional)"
              icon="md-call"
              onChangeText={(phoneNumberOther) =>
                setDataComp((values) => ({ ...values, phoneNumberOther }))
              }
              {...inputProps}
            />
          </FormContainer>
          <View
            style={{ width: "90%", flexDirection: "row", alignItems: "center" }}
          >
            <CheckBox onChange={() => setCheck(!check)} value={check} />
            <View style={{ flexDirection: "row" }}>
              <Text>Acepto los</Text>
              <TouchableOpacity
                style={{ marginLeft: 2 }}
                onPress={() => navigation.navigate("terms")}
              >
                <Text style={{ color: MainColor }}>Terminos y Condiciones</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ width: "90%" }}>
            <MainButton title="Enviar" onPress={createAdmin} />
          </View>
        </View>
      </ScrollView>

      <CameraModal
        status={camera}
        onClose={() => setCamera(false)}
        profile={profilePic}
        anotherPic={companyPic}
        type={type}
      />
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

const styles = StyleSheet.create({
  pickPictureContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 5,
    padding: 8,
    elevation: 5,
  },
  pictureContainer: {
    height: 120,
    width: 120,
    alignSelf: "center",
    position: "relative",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
    borderRadius: 120 / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  openCameraButton: {
    position: "absolute",
    bottom: 0,
    right: -15,
    backgroundColor: MainColor,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
  },
  buttonContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 2,
    color: MainColor,
  },
  caption: {
    fontSize: 16,
    fontWeight: "500",
    color: "red",
    letterSpacing: 0.5,
    marginLeft: 5,
  },
  labelText: {
    color: "#8e8e8e",
    fontSize: 14,
    fontWeight: "600",
  },
});
