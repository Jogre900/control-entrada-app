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
import { helpers } from "../../helpers";
import { storage } from "../../helpers/asyncStorage";
import { BackAction } from '../../helpers/ui/ui'
import { routes } from '../../assets/routes'
import { connect } from "react-redux";

let initialValues = {
  pass: undefined,
  repPass: undefined,
  uri: undefined,
  fileName: undefined,
  fileType: undefined,
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
const EditWatchProfileScreen = ({
  profile,
  saveLogin,
  saveProfile,
  navigation,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [modalProps, setModalProps] = useState(statusModalValues);
  const [cameraProps, setCameraProps] = useState(cameraValues);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");

  const profilePic = (uri, fileName, fileType, caption, changeImg) => {
    setFormValues((values) => ({ ...values, uri, fileName, fileType }));
  };

  const updateWatchProfile = async () => {
    setLoading(true);
    const { pass, repPass } = formValues;
    // if (pass === repPass) {
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

        saveLogin(slogin);
        saveProfile(sprofile);
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
      <TopNavigation title="Editar" leftControl={BackAction(navigation)} />
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
              onPress={updateWatchProfile}
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditWatchProfileScreen);

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
