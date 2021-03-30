import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { FormContainer } from "../../components/formContainer";
import Input from "../../components/input.component";
import Avatar from "../../components/avatar.component";
import { CameraModal } from "../../components/cameraModal";
import { MainButton } from "../../components/mainButton.component";
import { API_PORT } from "../../config/index";
import { TopNavigation } from "../../components/TopNavigation.component";
import { StatusModal } from "../../components/statusModal";
import { LoadingModal } from "../../components/loadingModal";
import { Ionicons } from "@expo/vector-icons";
import { MainColor } from "../../assets/colors";
import { storage } from "../../helpers/asyncStorage";
import { routes } from "../../assets/routes";
import { BackAction } from "../../helpers/ui/ui";
import { helpers } from "../../helpers";
import { connect } from "react-redux";
import axios from "axios";

let formInitialValues = {
  email: null,
  pass: null,
  repPass: null,
  nic: null,
  address: null,
  city: null,
  number: null,
  numberTwo: null,
  uri: null,
  fileName: null,
  fileType: null,
  logouri: null,
  logofileName: null,
  logofileType: null,
};
let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};
let cameraValues = {
  status: false,
  profile: null,
  anotherPic: null,
  type: null,
};
const EditProfileScreen = ({
  profile,
  privilege,
  company,
  saveLogin,
  saveProfile,
  saveCompany,
  navigation,
}) => {
  const [formValues, setFormValues] = useState(formInitialValues);
  const [modalProps, setModalProps] = useState(statusModalValues);
  const [cameraProps, setCameraProps] = useState(cameraValues);
  const [loading, setLoading] = useState(false);

  const profilePic = (uri, fileName, fileType, caption, changeImg) => {
    setFormValues((values) => ({ ...values, uri, fileName, fileType }));
  };
  const logoPic = (uri, fileName, fileType, caption, changeImg) => {
    setFormValues((values) => ({
      ...values,
      logouri: uri,
      logofileName: fileName,
      logofileType: fileType,
    }));
  };

  const updateProfile = async () => {
    setLoading(true);

    // if (pass !== repPass) {
    //   alert("las contraseña deben ser iguales");
    //   return;
    // }

    try {
      const res = await helpers.updateProfile(formValues, profile.id);
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
          userZone: res.data.data.userZone,
        };
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
        setLoading(false);
        setModalProps((values) => ({
          ...values,
          visible: true,
          message: res.data.msg,
          status: true,
        }));
      }
    } catch (error) {
      setLoading(false);
      setModalProps((values) => ({
        ...values,
        visible: true,
        message: error.message,
        status: false,
      }));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation
        title="Editar"
        leftControl={BackAction(navigation, routes.PROFILE)}
      />
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <FormContainer title="Perfil">
            <View style={styles.pictureContainer}>
              <Avatar.Picture
                size={120}
                uri={
                  formValues.uri ||
                  `${API_PORT()}/public/imgs/${profile.picture}`
                }
              />
              <TouchableOpacity
                style={styles.openCameraButton}
                onPress={() => {
                  setCameraProps((values) => ({
                    ...values,
                    status: true,
                    profile: profilePic,
                    type: "profile",
                  }));
                }}
              >
                <Avatar.Icon name="ios-camera" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <Input
              title="Nueva Clave"
              icon="ios-eye-off"
              shape="flat"
              secureTextEntry={true}
              onChangeText={(pass) => {
                setFormValues((values) => ({ ...values, pass }));
              }}
              //value={passChange}
            />
            <Input
              icon="ios-eye-off"
              title="Repetir Clave"
              secureTextEntry={true}
              shape="flat"
              onChangeText={(repPass) => {
                setFormValues((values) => ({ ...values, repPass }));
              }}
            />
          </FormContainer>
          {privilege === "Admin" && (
            <FormContainer title={company[0].companyName}>
              <View
                style={
                  !company[0].logo && !formValues.logouri 
                    ? styles.emptyPictureContainer
                    : styles.pictureContainer
                }
              >
                {company[0].logo || formValues.logouri ? (
                  <Avatar.Picture
                    size={120}
                    uri={
                      formValues.logouri ||
                      `${API_PORT()}/public/imgs/${company[0].logo}`
                    }
                  />
                ) : (
                  <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
                )}
                <TouchableOpacity
                  style={styles.openCameraButton}
                  onPress={() => {
                    setCameraProps((values) => ({
                      ...values,
                      status: true,
                      anotherPic: logoPic,
                      type: "logo",
                    }));
                  }}
                >
                  <Avatar.Icon name="ios-camera" size={32} color="#fff" />
                </TouchableOpacity>
              </View>
              <Input
                title={company[0].nic}
                icon="ios-card"
                shape="flat"
                onChangeText={(nic) =>
                  setFormValues((value) => ({ ...value, nic }))
                }
              />
              <Input
                title={
                  company[0].address
                    ? company[0].address
                    : "Direccion (Opcional)"
                }
                icon="ios-pin"
                onChangeText={(address) =>
                  setFormValues((values) => ({ ...values, address }))
                }
                shape="flat"
              />
              <Input
                title={company[0].city ? company[0].city : "Ciudad (Opcional)"}
                icon="ios-home"
                onChangeText={(city) =>
                  setFormValues((values) => ({ ...values, city }))
                }
                shape="flat"
              />
              <Input
                title={company[0].phoneNumber}
                icon="md-call"
                shape="flat"
                onChangeText={(number) =>
                  setFormValues((value) => ({ ...value, number }))
                }
              />
              <Input
                title={
                  company[0].phoneNumberOther
                    ? company[0].phoneNumberOther
                    : "Telefono Adicional"
                }
                icon="md-call"
                shape="flat"
                onChangeText={(numberTwo) =>
                  setFormValues((value) => ({ ...value, numberTwo }))
                }
              />
            </FormContainer>
          )}
          <CameraModal
            {...cameraProps}
            onClose={() =>
              setCameraProps((values) => ({ ...values, status: false }))
            }
          />
          <View
            style={{
              width: "90%",
            }}
          >
            <MainButton
              title="Guardar"
              onPress={updateProfile}
              style={styles.buttonMargin}
            />
          </View>
        </View>
      </ScrollView>
      <StatusModal
        onClose={() =>
          setModalProps((values) => ({ ...values, visible: false }))
        }
        {...modalProps}
      />
      <LoadingModal visible={loading} message="Guardando..." />
    </View>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  privilege: state.profile.login.privilege,
  company: state.profile.company,
});

const mapDispatchToProps = (dispatch) => ({
  saveLogin(login) {
    dispatch({
      type: "SET_LOGIN",
      payload: login,
    });
  },
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
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);

const styles = StyleSheet.create({
  profileTopContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 5,
    padding: 8,
    elevation: 5,
  },
  pictureContainer: {
    //height: 120,
    //width: 120,
    alignSelf: "center",
    position: "relative",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
    borderRadius: 120 / 2,
    backgroundColor: "#fff",
  },
  emptyPictureContainer: {
    height: 120,
    width: 120,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "relative",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
    borderRadius: 120 / 2,
    backgroundColor: "#fff",
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
  buttonMargin: {
    marginBottom: 10,
  },
});
