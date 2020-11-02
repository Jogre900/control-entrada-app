import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import axios from "axios";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Divider } from "../../components/Divider";
import { MainColor } from "../../assets/colors";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { API_PORT } from "../../config";
import AsyncStorage from "@react-native-community/async-storage";
import Modal from "react-native-modal";

const inputProps = {
  shape: "flat",
  textColor: "grey",
  alignText: "center",
};

export const RegisterScreen = (props) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [imgUrl, setImgUrl] = useState();
  const [fileName, setFileName] = useState();
  const [fileType, setFileType] = useState();
  const [pass, setPass] = useState("")
  const [repeatPass, setRepeatPass] = useState("")
  const [check, setCheck] = useState(false);
  const [modalVisible, setModalVisible] = useState(false)
  //GOBACK
  const goBackAction = () => {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
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

  const storeToken = async (token) => {
    console.log("token:-------",token)
    try {
      await AsyncStorage.setItem("userToken", token)
    } catch (error) {
      console.log(error.message)
    }
  }
  //CREATE USER
  const createUser = async () => {
    setModalVisible(true)
    let data = new FormData();
    data.append("name", name);
    data.append("lastName", lastName);
    data.append("dni", dni);
    data.append("email", email);
    //data.append("privilege", "Admin")
    data.append("password", repeatPass)
    data.append("file", { uri: imgUrl, name: fileName, type: fileType });
    try {
      let res = await axios.post(`${API_PORT()}/api/createUser/${"Admin"}`, data, {
        headers: {
          "content-type": "multipart/form-data"
        }
      });
      if (res.data) {
        console.log(res.data);
        await storeToken(res.data.token);
        setModalVisible(false)
        props.navigation.navigate("admin", {profile: res.data.data})
      }
    } catch (error) {
      alert(error.message);
      setModalVisible(false)
    }
  };
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);
  
  return (
    <View style={{flex: 1}}>
      <TopNavigation title="Registro" leftControl={goBackAction()}/>
      <ScrollView>
        <View>
          <Text>Datos Personales</Text>
          <Divider size="small" />
          <Input
            title="Nombres"
            onChangeText={(value) => setName(value)}
            value={name}
            caption="Debe ingresar un nombre valido"
            {...inputProps}
          />
          <Input
            title="Apellidos"
            onChangeText={(value) => setLastName(value)}
            value={lastName}
            caption="Debe ingresar un apellido valido"
            {...inputProps}
          />
          <Input
            title="DNI"
            onChangeText={(value) => setDni(value)}
            value={dni}
            caption="Debe ingresar un dni valido"
            {...inputProps}
          />
          <Input
            title="Correo"
            onChangeText={(value) => setEmail(value)}
            value={email}
            caption="Debe ingresar un correo valido"
            {...inputProps}
          />
          <Input
            title="Contraseña"
            onChangeText={(value) => setPass(value)}
            value={pass}
            caption="Debe ingresar un correo valido"
            {...inputProps}
          />
          <Input
            title="Repetir Contraseña"
            onChangeText={(value) => setRepeatPass(value)}
            value={repeatPass}
            caption="Debe ingresar un correo valido"
            {...inputProps}
          />
        </View>
        <View>
          {imgUrl ? (
            <Image
              source={{ uri: imgUrl }}
              style={{ width: 100, height: 100 }}
            />
          ) : (
            <TouchableOpacity onPress={() => pickImage()}>
              <Ionicons name="ios-camera" size={22} color="grey" />
            </TouchableOpacity>
          )}
        </View>
        <View>
          <CheckBox onChange={() => setCheck(!check)} value={check} />
          <Text>Acepto los Terminos y Condiciones</Text>
        </View>
        <View>
          <MainButton title="Enviar" onPress={() => createUser()} />
        </View>
        <LoadingModal/>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});
