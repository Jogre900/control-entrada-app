import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import CheckBox from "@react-native-community/checkbox";

import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { MainColor } from "../../assets/colors";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "../../helpers/asyncStorage";
import { createCompany, helpers } from "../../helpers";
import { StatusModal } from "../../components/statusModal";
import { LoadingModal } from "../../components/loadingModal";
import { AdminForm } from "../../components/forms/adminForm";
import { CompanyForm } from "../../components/forms/companyForm";
import { FormContainer } from '../../components/formContainer'
import { CameraModal } from '../../components/cameraModal'
import Avatar from '../../components/avatar.component'
import Input from '../../components/input.component'
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
  validateNic
} from "../../helpers/forms";
import { connect } from "react-redux";
import { routes } from "../../assets/routes";
import { BackAction } from "../../helpers/ui/ui";

const inputProps = {
  shape: "flat",
  textColor: "grey",
};
let statusModalValues = {
  visible: false,
  status: null,
  message: null,
};
let loadingModalValues = {
  visible: false,
  message: null,
};

const RegisterScreen = ({
  navigation,
  saveProfile,
  saveCompany,
  saveLogin,
  savePrivilege,
  activeTutorial,
}) => {
  const [adminData, setAdminData] = useState({
    name: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
    repeatPass: "",
    companyName: "",
    businessName: "",
    nic: "",
    address: "",
    city: "",
    phoneNumber: "",
    uri: '',
    fileType: '',
    fileName: '',
    uriLogo: '',
    fileTypeLogo: '',
    fileNameLogo: ''
  });
  const [companyData, setCompanyData] = useState({});
  const [statusModal, setStatusModal] = useState(statusModalValues);
  const [loadingModal, setLoadingModal] = useState(loadingModalValues);
  const [registerCaption, setRegisterCaption] = useState({});
  //const [passEqual, setPassEqual] = useState(false);

  const [caption, setCaption] = useState({
    name: "",
    lastName: "",
    dni: "",
    email: "",
    password: "",
    repeatPass: "",
    companyName: "",
    businessName: "",
    nic: "",
    address: "",
    city: "",
    phoneNumber: "",
  });

  const [repeatCaption, setRepeatCaption] = useState("");
  const [check, setCheck] = useState(false);
  const [camera, setCamera] = useState({
    visible: false,
    type: "",
  });
  const openCamera = (type) => {
    setCamera({ ...camera, visible: true, type });
  };

  const profilePic = (uri, fileName, fileType) => {
    
    
    handleChange("uri", uri);
    handleChange("fileName", fileName);
    handleChange("fileType", fileType);
  };
  const companyPic = (uri, fileName, fileType) => {
    
    
    handleChange("uriLogo", uri);
    handleChange("fileNameLogo", fileName);
    handleChange("fileTypeLogo", fileType);
  };

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

  const handleChange = (name, value) => {
    setAdminData((values) => ({ ...values, [name]: value }));
  };

  //CREATE USER
  const createAdmin = async () => {
    let validate = {
      name: validateName(adminData.name),
      lastName: validateLastName(adminData.lastName),
      dni: validateDni(adminData.dni),
      email: validateEmail(adminData.email),
      password: validatePass(adminData.password),
      repeatPass: validatePass(adminData.repeatPass),
      companyName: validateCompany(adminData.companyName),
      businessName: validateBusiness(adminData.businessName),
      nic: validateNic(adminData.nic),
      address: "",
      city: "",
      phoneNumber: validatePhone(adminData.phoneNumber),
      profilePic: adminData.uri ? "" : "Debe agregar una foto de perfil."
    };

    setCaption(validate);

    if (
      caption.name ||
      caption.lastName ||
      caption.email ||
      caption.dni ||
      caption.password ||
      caption.repeatPass ||
      caption.companyName ||
      caption.businessName ||
      caption.nic ||
      caption.profilePic
    ) {
      return;
    }

    // setLoadingModal({ visible: true, message: "Guardando..." });
    // //clearCaption();
    // try {
    //   const res = await createCompany(adminData);
    //   //console.log("RES DE CREAT----", res.data);
    //   if (!res.data.error) {
    //     setLoadingModal((values) => ({ ...values, visible: false }));
    //     setStatusModal((values) => ({
    //       ...values,
    //       visible: true,
    //       status: true,
    //       message: res.data.msg,
    //     }));
    //     //console.log(dataComp.email, dataComp.repPass)
    //     setLoadingModal({ visible: true, message: "Iniciando Sesión..." });
    //     const resLogin = await helpers.login(
    //       adminData.email,
    //       adminData.repPass
    //     );

    //     if (!resLogin.data.error) {
    //       console.log(
    //         "RES DE LOGIN---------",
    //         resLogin.data.data.UserCompany[0].privilege
    //       );
    //       let slogin = {
    //         token: resLogin.data.token,
    //         userId: resLogin.data.data.id,
    //       };

    //       let sprofile = {
    //         id: resLogin.data.data.Employee.id,
    //         dni: resLogin.data.data.Employee.dni,
    //         name: resLogin.data.data.Employee.name,
    //         lastName: resLogin.data.data.Employee.lastName,
    //         picture: resLogin.data.data.Employee.picture,
    //         email: resLogin.data.data.email,
    //         userZone: resLogin.data.data.userZone[0],
    //       };
    //       if (resLogin.data.data.userZone.length > 0) {
    //         sprofile.userZone = resLogin.data.data.userZone;
    //       }
    //       let company = [];
    //       resLogin.data.data.UserCompany.map((comp) => {
    //         company.push({
    //           id: comp.Company.id,
    //           companyName: comp.Company.companyName,
    //           businessName: comp.Company.businessName,
    //           nic: comp.Company.nic,
    //           city: comp.Company.city,
    //           address: comp.Company.address,
    //           phoneNumber: comp.Company.phoneNumber,
    //           phoneNumberOther: comp.Company.phoneNumberOther,
    //           logo: comp.Company.logo,
    //           privilege: comp.privilege,
    //           select: true,
    //         });
    //       });
    //       let privilege = resLogin.data.data.UserCompany[0].privilege;

    //       await storage.setItem("userToken", resLogin.data.token);
    //       saveLogin(slogin);
    //       saveProfile(sprofile);
    //       saveCompany(company);
    //       savePrivilege(privilege);
    //       activeTutorial(true);
    //       setLoadingModal((values) => ({ ...values, visible: false }));
    //       switch (privilege) {
    //         case "Watchman":
              
    //           navigation.navigate(routes.WATCH, {
    //             screen: routes.WATCH_HOME,
    //           });
    //           break;
    //         case "Admin":
    //         case "Supervisor":
              
    //           navigation.navigate(routes.ADMIN);
    //           break;
    //         default:
    //           break;
    //       }
    //     }
    //   } else {
        
    //     setStatusModal((values) => ({
    //       ...values,
    //       visible: true,
    //       status: false,
    //       message: res.data.msg,
    //     }));
    //   }
    // } catch (error) {
    //   setStatusModal((values) => ({
    //     ...values,
    //     visible: true,
    //     status: false,
    //     message: error.message,
    //   }));
    // }
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
      <TopNavigation
        title="Registro"
        leftControl={BackAction(navigation, routes.MAIN)}
      />
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <AdminForm
            handleChange={handleChange}
            value={adminData}
            caption={caption}
          />
          {/* <CompanyForm
            handleChange={companyHandleChange}
            value={companyData}
          /> */}
          {/* <FormContainer title="Datos Personales">
        <View style={styles.pictureContainer}>
          {adminData && adminData.uri ? (
            <Avatar.Picture size={120} uri={adminData.uri} />
          ) : (
            <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
          )}
          <TouchableOpacity
            onPress={() => {
              openCamera("profile");
            }}
            style={styles.openCameraButton}
          >
            <Ionicons name="ios-camera" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
        <Input
          title="Nombre"
          icon="ios-person"
          onChangeText={(name) => handleChange("name", name)}
          value={adminData.name}
          {...inputProps}
          caption={caption.name}
        />
        <Input
          title="Apellido"
          icon="ios-person"
          onChangeText={(lastName) => handleChange("lastName", lastName)}
          value={adminData.lastName}
          {...inputProps}
          caption={caption.lastName}
        />
        <Input
          title="DNI"
          icon="ios-card"
          onChangeText={(dni) => handleChange("dni", dni)}
          value={adminData.dni}
          caption={caption.dni}
          {...inputProps}
        />
        <Input
          title="Correo"
          icon="ios-mail"
          onChangeText={(email) => handleChange("email", email)}
          value={adminData.email}
          caption={caption.email}
          {...inputProps}
        />
        <Input
          //style={{ borderColor: passEqual && Success }}
          title="Contraseña"
          onChangeText={(password) => handleChange("password", password)}
          value={adminData.password}
          caption={caption.password}
          secureTextEntry
          {...inputProps}
        />
        <Input
          //style={{ borderColor: passEqual && Success }}
          title="Repetir Contraseña"
          onChangeText={(repPass) => handleChange("repPass", repPass)}
          value={adminData.repPass}
          caption={caption.repeatPass}
          secureTextEntry
          {...inputProps}
        />
      </FormContainer>
      <FormContainer title="Datos de la empresa">
        <Input
          title="Empresa"
          icon="md-business"
          onChangeText={(companyName) =>
            handleChange("companyName", companyName)
          }
          {...inputProps}
          caption={caption.companyName}
        />
        <Input
          title="Razon social"
          icon="ios-briefcase"
          onChangeText={(businessName) =>
            handleChange("businessName", businessName)
          }
          {...inputProps}
          //   caption={registerCaption.businessName}
        />
        <Input
          title="nic"
          icon="ios-card"
          onChangeText={(nic) => handleChange("nic", nic)}
          {...inputProps}
          caption={caption.nic}
        />
        <Input
          title="Direccion (Opcional)"
          icon="ios-pin"
          onChangeText={(address) => handleChange("address", address)}
          {...inputProps}
        />
        <Input
          title="Ciudad (Opcional)"
          icon="ios-home"
          onChangeText={(city) => handleChange("city", city)}
          {...inputProps}
        />
        <Input
          title="Telefono"
          icon="md-call"
          keyboardType="numeric"
          returnKeyType='next'
          onChangeText={(phoneNumber) =>
            handleChange("phoneNumber", phoneNumber)
          }
          {...inputProps}
          caption={caption.phoneNumber}
        />
        <Input
          title="Telefono adicional (Opcional)"
          icon="md-call"
          keyboardType="numeric"
          onChangeText={(phoneNumberOther) =>
            handleChange("phoneNumberOther", phoneNumberOther)
          }
          {...inputProps}
        />
        <Text style={styles.labelText}>
          *Puedes agregar un logo para tu empresa
        </Text>
        <View style={styles.pictureContainer}>
          {adminData.uriLogo ? (
            <Avatar.Picture size={120} uri={adminData.uriLogo} />
          ) : (
            <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
          )}
          <TouchableOpacity
            onPress={() => {
              openCamera("company");
            }}
            style={styles.openCameraButton}
          >
            <Ionicons name="ios-camera" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
        <CameraModal
          status={camera.visible}
          onClose={() => setCamera({ ...camera, visible: false })}
          profile={profilePic}
          anotherPic={companyPic}
          type={camera.type}
        />
      </FormContainer> */}
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
            <MainButton
              title="Enviar"
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
  labelText:{
    fontSize: 14,
    color: '#8e8e8e'
  },
  caption: {
    fontSize: 16,
    fontWeight: "500",
    color: "red",
    letterSpacing: 0.5,
    marginLeft: 5,
  },
});