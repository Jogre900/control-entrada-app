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
import { updateProfile } from "../../helpers/index";
import { connect } from "react-redux";

let initialValues = {
  email: undefined,
  pass: undefined,
  repPass: undefined,
};
let fileInitialValues = {
  uri: undefined,
  fileName: undefined,
  fileType: undefined,
};
let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};
const EditWatchProfileScreen = ({
  profile,
  saveLogin,
  saveProfile,
  navigation,
}) => {
  const [formValues, setFormValues] = useState(initialValues);
  const [fileValues, setFileValues] = useState(fileInitialValues);
  const [modalProps, setModalProps] = useState(statusModalValues);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("");

  const profilePic = (uri, fileName, fileType, caption, changeImg) => {
    setFileValues((values) => ({ ...values, uri, fileName, fileType }));
  };

  const updateWatchProfile = async () => {
    setLoading(true);
    const { pass, repPass } = formValues;
    if (pass !== repPass) {
      alert("las contraseña deben ser iguales");
      return;
    }
    try {
      const { slogin, sprofile, res } = await updateProfile(
        formValues,
        fileValues,
        profile.id
      );
      saveLogin(slogin);
      saveProfile(sprofile);
      setLoading(false);
      setModalProps((values) => ({
        ...values,
        visible: true,
        message: res.data.msg,
        status: true,
      }));
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
        <TouchableOpacity onPress={() => navigation.navigate("watch-profile")}>
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
          <View style={styles.profileTopContainer}>
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
          </View>
          <FormContainer title="Perfil">
            <Input
              title="Email"
              icon="ios-mail"
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
