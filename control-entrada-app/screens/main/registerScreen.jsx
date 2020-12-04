import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import axios from "axios";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Divider } from "../../components/Divider";
import { MainColor } from "../../assets/colors";
import * as ImagePicker from "expo-image-picker";
// import * as ImagePicker from 'react-native-image-picker'
import { Ionicons } from "@expo/vector-icons";
import { API_PORT } from "../../config";
import { storage } from "../../helpers/asyncStorage";
import Modal from "react-native-modal";
import { connect } from "react-redux";

const inputProps = {
  shape: "flat",
  textColor: "grey",
};

const RegisterScreen = ({ navigation, saveProfile }) => {
  const [statusPermissions, setStatusPermissions] = useState("")
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [imgUrl, setImgUrl] = useState();
  const [fileName, setFileName] = useState();
  const [fileType, setFileType] = useState();
  const [pass, setPass] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [caption, setCaption] = useState("");
  const [dniCaption, setDniCaption] = useState("");
  const [emailCaption, setEmailCaption] = useState("");
  const [passCaption, setPassCaption] = useState("");
  const [repeatCaption, setRepeatCaption] = useState("");
  const [check, setCheck] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  //GOBACK
  const goBackAction = () => {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableWithoutFeedback>
      </View>
    );
  };
  //LOADING
  const LoadingModal = () => {
    return (
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(!modalVisible)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={MainColor} />
        </View>
      </Modal>
    );
  };
  //PICK PHOTO
  const pickImage = async () => {
    let options = {
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    };
    // let result = await ImagePicker.lauchCamera({
    //   mediaType: 'photo',
    //   includeBase64: false,
    //   maxHeight: 200,
    //   maxWidth: 200,
    // })
    
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        ...options,
      });
      if (!result.cancelled) {
        setImgUrl(result.uri);
        let filename = result.uri.split("/").pop();
        setFileName(filename);
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
        setFileType(type);
      }
  };

  const clearCaption = () => {
    setCaption("");
    setEmailCaption("");
    setDniCaption("");
    setPassCaption("");
    setRepeatCaption("");
  };

  //CREATE USER
  const createUser = async () => {
    clearCaption();
    setModalVisible(true);
    if (!name || !lastName || !dni || !email || !pass || !repeatPass) {
      setModalVisible(true);
      setCaption("* Debe Llenar todos los datos");
    } else if (!check) {
      setModalVisible(true);
      setCaption("* Debe aceptar los terminos y condiciones");
    } else {
      let data = new FormData();
      data.append("name", name);
      data.append("lastName", lastName);
      data.append("dni", dni);
      data.append("email", email);
      //data.append("privilege", "Admin")
      data.append("password", repeatPass);
      data.append("file", { uri: imgUrl, name: fileName, type: fileType });
      try {
        let res = await axios.post(
          `${API_PORT()}/api/createUser/${"Admin"}`,
          data,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        );
        if (!res.data.error) {
          console.log(res.data);
          storage.setItem(res.data.token);
          saveProfile(res.data.data);
          setModalVisible(false);
          navigation.navigate("admin");
        }
      } catch (error) {
        alert(error.message);
        setModalVisible(false);
      }
    }
  };
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status
        } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Registro" leftControl={goBackAction()} />
      <ScrollView>
        <View style={{ alignItems: "center" }}>
          <View style={styles.buttonContainer}>
            <Text style={styles.containerTitle}>Datos Personales</Text>
            <Divider size="small" />
            <Input
              title="Nombres"
              icon="ios-person"
              onChangeText={(value) => setName(value)}
              value={name}
              {...inputProps}
            />
            <Input
              title="Apellidos"
              icon="ios-person"
              onChangeText={(value) => setLastName(value)}
              value={lastName}
              {...inputProps}
            />
            <Input
              title="DNI"
              icon="ios-card"
              onChangeText={(value) => setDni(value)}
              value={dni}
              caption={dniCaption}
              {...inputProps}
            />
            <Input
              title="Correo"
              icon="ios-mail"
              onChangeText={(value) => setEmail(value)}
              value={email}
              caption={emailCaption}
              {...inputProps}
            />
            <Input
              title="Contraseña"
              onChangeText={(value) => setPass(value)}
              value={pass}
              caption={passCaption}
              secureTextEntry
              {...inputProps}
            />
            <Input
              title="Repetir Contraseña"
              onChangeText={(value) => setRepeatPass(value)}
              value={repeatPass}
              caption={repeatCaption}
              secureTextEntry
              {...inputProps}
            />
            <View>
              <Text style={styles.caption}>{caption}</Text>
            </View>
          </View>
          <View
            style={[
              styles.buttonContainer,
              { height: 150, justifyContent: "center", alignItems: 'center' },
            ]}
          >
            <View
              style={{
                height: 130,
                width: 130,
                borderRadius: 130 / 2,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 0.5,
                borderStyle: "dotted",
                borderColor: "#09f",
              }}
            >
              {imgUrl ? (
                <View style={{ position: "relative" }}>
                  <Image
                    source={{ uri: imgUrl }}
                    style={{
                      width: 130,
                      height: 130,
                      borderRadius: 130/2,
                      //resizeMode: "cover",
                    }}
                  />
                  <MainButton.Icon
                    style={{ position: "absolute", top: 0, left: 0 }}
                    onPress={() => pickImage()}
                    name="ios-close" size={28} color={MainColor}
                  >
                  </MainButton.Icon>
                </View>
              ) : (
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TouchableOpacity
                    style={{ justifyContent: "center", alignItems: "center" }}
                    onPress={() => pickImage()}
                  >
                    <Ionicons name="md-photos" size={28} color={MainColor} />
                    <Text>Agregar Foto.</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
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
            <MainButton title="Enviar" onPress={() => createUser()} />
          </View>
          <LoadingModal />
        </View>
      </ScrollView>
    </View>
  );
};
const mapDispatchToProps = (dispatch) => ({
  saveProfile(profile) {
    dispatch({
      type: "setProfile",
      payload: profile,
    });
  },
});

export default connect(null, mapDispatchToProps)(RegisterScreen);

const styles = StyleSheet.create({
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
});
