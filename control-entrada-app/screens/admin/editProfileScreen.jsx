import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FormContainer } from "../../components/formContainer";
import Input from "../../components/input.component";
import Avatar from "../../components/avatar.component";
import { CameraModal } from "../../components/cameraModal";
import { MainButton } from "../../components/mainButton.component";
import { API_PORT } from "../../config/index";
import { TopNavigation } from "../../components/TopNavigation.component";
import { Ionicons } from "@expo/vector-icons";
import { MainColor } from "../../assets/colors";
import { connect } from "react-redux";
import axios from "axios";

let formInitialValues = {
  email: "",
  pass: "",
  repPass: "",
  nic: "",
  number: null,
  numberTwo: null,
};
let fileInitialValues = {
  uri: "",
  fileName: "",
  fileType: "",
};
const EditProfileScreen = ({ profile, company, navigation }) => {
  const [formValues, setFormValues] = useState(formInitialValues);
  const [fileValues, setFileValues] = useState(fileInitialValues);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState("");

  const profilePic = (uri, fileName, fileType, caption, changeImg) => {
    setFileValues((values) => ({ ...values, uri, fileName, fileType }));
    // setFileValues((values) => ({ ...values, name: fileName }));
    // setFileValues((values) => ({ ...values, type: fileType }));
  };

  const updateProfile = async () => {
    const { email, pass, repPass, nic, number, numberTwo } = formValues;
    const { uri, fileName, fileType } = fileValues;

    if (pass !== repPass) {
      alert("las contraseña deben ser iguales");
      return;
    }
    let data = new FormData();

    data.append("email", email);
    data.append("password", repPass);
    data.append("nic", nic);
    data.append("number", number);
    data.append("numberTwo", numberTwo);
    data.append("file", { uri, name: fileName, type: fileType });
    try {
      //   const res = await axios({
      //     method: "PUT",
      //     url: `${API_PORT()}/api/profile/${profile.id}`,
      //     data: data,
      //     headers: { "content-type": "multipart/form-data" },
      //   });
      const res = await axios.post(
        `${API_PORT()}/api/profile/${profile.id}`,
        data,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Editar" leftControl={goBackAction()} />
      <View style={styles.profileTopContainer}>
        <View
          style={{
            alignSelf: "center",
            position: "relative",
          }}
        >
          <Avatar.Picture
            size={120}
            uri={
              fileValues.uri || `${API_PORT()}/public/imgs/${profile.picture}`
            }
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
            onPress={() => {
              setVisible(true), setType("profile");
            }}
          >
            <Avatar.Icon
              name="ios-camera"
              size={32}
              color="#8e8e8e"
              style={{ backgroundColor: MainColor }}
            />
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
      <FormContainer title="Empresa">
        <Input
          title="Rif"
          icon="ios-card"
          onChangeText={(rif) => setFormValues((value) => ({ ...value, rif }))}
        />
        <Input
          title="Telefono"
          icon="md-call"
          onChangeText={(number) =>
            setFormValues((value) => ({ ...value, number }))
          }
        />
        <Input
          title="Telefono Adicional"
          icon="md-call"
          onChangeText={(numberTwo) =>
            setFormValues((value) => ({ ...value, numberTwo }))
          }
        />
      </FormContainer>
      <CameraModal
        status={visible}
        onClose={() => setVisible(false)}
        profile={profilePic}
        type={type}
      />
      <MainButton title="Guardar" onPress={updateProfile} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  company: state.profile.company,
});

export default connect(mapStateToProps, {})(EditProfileScreen);

const styles = StyleSheet.create({
  profileTopContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 5,
    padding: 8,
    elevation: 5,
  },
});
