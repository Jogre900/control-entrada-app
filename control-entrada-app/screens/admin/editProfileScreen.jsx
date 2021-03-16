import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
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
import { connect } from "react-redux";
import axios from "axios";

let formInitialValues = {
  email: null,
  pass: null,
  repPass: null,
  nic: null,
  number: null,
  numberTwo: null,
};
let fileInitialValues = {
  uri: null,
  fileName: null,
  fileType: null,
};
let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};
const EditProfileScreen = ({
  profile,
  privilege,
  saveLogin,
  saveProfile,
  saveCompany,
  navigation,
}) => {
  const [formValues, setFormValues] = useState(formInitialValues);
  const [fileValues, setFileValues] = useState(fileInitialValues);
  const [modalProps, setModalProps] = useState(statusModalValues);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");

  const profilePic = (uri, fileName, fileType, caption, changeImg) => {
    setFileValues((values) => ({ ...values, uri, fileName, fileType }));
  };

  const updateProfile = async () => {
    setLoading(true);
    const { email, pass, repPass, nic, number, numberTwo } = formValues;
    const { uri, fileName, fileType } = fileValues;

    // if (pass !== repPass) {
    //   alert("las contraseña deben ser iguales");
    //   return;
    // }
    let data = new FormData();
    if (email) {
      data.append("email", email);
    }
    if (repPass) {
      data.append("password", repPass);
    }
    if (nic) {
      data.append("nic", nic);
    }
    if (number) {
      data.append("number", number);
    }
    if (numberTwo) {
      data.append("numberTwo", numberTwo);
    }
    if (uri) {
      data.append("file", { uri, name: fileName, type: fileType });
    }
    console.log(data);
    try {
      const res = await axios.put(
        `${API_PORT()}/api/profile/${profile.id}`,
        data,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
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
        await storage.removeItem("userToken");
        await storage.setItem("userToken", res.data.token);
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
  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Editar" leftControl={goBackAction()} />
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <FormContainer title="Perfil">
            <View style={styles.pictureContainer}>
              <Avatar.Picture
                size={120}
                uri={
                  fileValues.uri ||
                  `${API_PORT()}/public/imgs/${profile.picture}`
                }
              />
              <TouchableOpacity
                style={styles.openCameraButton}
                onPress={() => {
                  setVisible(true), setType("profile");
                }}
              >
                <Avatar.Icon name="ios-camera" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <Input
              title="Email"
              icon="ios-mail"
              shape="flat"
              onChangeText={(email) =>
                setFormValues((value) => ({ ...value, email }))
              }
            />
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
            <FormContainer title="Empresa">
              <Input
                title="Rif"
                icon="ios-card"
                shape="flat"
                onChangeText={(nic) =>
                  setFormValues((value) => ({ ...value, nic }))
                }
              />
              <Input
                title="Telefono"
                icon="md-call"
                shape="flat"
                onChangeText={(number) =>
                  setFormValues((value) => ({ ...value, number }))
                }
              />
              <Input
                title="Telefono Adicional"
                icon="md-call"
                shape="flat"
                onChangeText={(numberTwo) =>
                  setFormValues((value) => ({ ...value, numberTwo }))
                }
              />
            </FormContainer>
          )}
          <CameraModal
            status={visible}
            onClose={() => setVisible(false)}
            profile={profilePic}
            type={type}
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
