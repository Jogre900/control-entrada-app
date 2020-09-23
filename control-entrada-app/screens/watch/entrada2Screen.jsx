import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import firebase from "../../lib/firebase";
import FireMethods from "../../lib/methods.firebase";
import moment from "moment";
import axios from "axios";
import { Picker } from "@react-native-community/picker";
import { API_PORT } from "../../config/index";

const { width } = Dimensions.get("window");
const cover = require("../../assets/images/background.jpg");
const profilePic = require("../../assets/images/profile-picture.png");
const watchPic = require("../../assets/images/male-2.jpg");

export const Entrada2Screen = (props) => {
  const [saveImg, setSaveImg] = useState();
  const [changeImg, setChangeImg] = useState(false);
  const [userId, setUserId] = useState();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [destiny, setDestiny] = useState("");
  const [entry, setEntry] = useState("");
  const [departure, setDeparture] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState("");
  const [destinys, setDestinys] = useState([]);
  const [destinyId, setDestinyId] = useState("");
  const [saving, setSaving] = useState();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const nameRef = useRef();
  const lastNameRef = useRef();
  const dniRef = useRef();
  const destinyRef = useRef();
  const getDate = () => {
    let date = moment().format("MMM D, h:mm");
    return date;
  };

  //ZONES
  const requestZone = async () => {
    try {
      let res = await axios.get(`${API_PORT()}/api/findZones`);
      if (res) {
        setZones(res.data.data);
        setZoneId(res.data.data[0].id);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  //DESTINYS
  const requestDestiny = async () => {
    if (zoneId) {
      try {
        let res = await axios.get(`${API_PORT()}/api/findDestiny/${zoneId}`);
        if (res) {
          console.log(res.data.data);
          setDestinys(res.data.data);
          setDestinyId(res.data.data[0].id);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    } else {
      console.log("error");
    }
  };

  //CREATE VISIT
  const createVisit = async () => {
    if (!name && !lastName) {
      alert("debe llenar los campos");
    } else {
      let data = new FormData();
      data.append("name", name);
      data.append("lastName", lastName);
      data.append("dni", dni);
      data.append("file", { uri: imgUrl, name: fileName, type: fileType });
      data.append("picture", fileName);
      data.append("entryDate", moment().toString());
      data.append("departureDate", moment().toString());
      data.append("descriptionEntry", entry);
      data.append("descriptionDeparture", departure);
      
      let data2 = new FormData();
      data2.append("name", "jose")
      try {
        let res = await axios.post(
          `${API_PORT()}/api/createVisit/${destinyId}`,
          data,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        );
        if (res) {
          console.log(res.data);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  useEffect(() => {
    requestDestiny();
  }, [zoneId]);
  useEffect(() => {
    requestZone();
  }, []);

  const pickImage = async () => {
    let options = {
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    };
    try {
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
        setChangeImg(true);
      } else {
        setChangeImg(false);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const goBackAction = () => {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const splash = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="#ff7e00" />
        <ActivityIndicator size="small" color="#ff7e00" />
      </View>
    );
  };

  const clearInputs = () => {
    setName("");
    setLastName("");
    setDni("");
    setDestiny("");
    setSaveImg("");
  };

  const savedSuccess = () => {
    return (
      <Text style={{ textAlign: "center", color: "green" }}>
        Guardado exitoso
      </Text>
    );
  };

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={() => Keyboard.dismiss()}
    >
      <KeyboardAvoidingView style={styles.containerKeyboard} behavior="padding">
        <TopNavigation title="Entrada" leftControl={goBackAction()} />
        <ScrollView>
          <ImageBackground source={cover} style={styles.imgBackground}>
            <View style={styles.cover}>
              <View style={{ position: "relative", marginBottom: 10 }}>
                {imgUrl ? (
                  <Image source={{ uri: imgUrl }} style={styles.profilePic} />
                ) : (
                  <View style={styles.profilePicBox}>
                    <Image source={profilePic} style={styles.profilePic} />
                    {/* <Ionicons name="ios-person" size={120} color="grey" /> */}
                  </View>
                )}
                <TouchableOpacity
                  onPress={() =>
                    pickImage((res) => {
                      console.log(res);
                    })
                  }
                  style={styles.cameraIcon}
                >
                  {changeImg ? (
                    <Ionicons name="ios-close" size={42} color="#ff7e00" />
                  ) : (
                    <Ionicons name="ios-camera" size={42} color="#ff7e00" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View
              style={{
                marginTop: 20,
                width: "75%",
              }}
            >
              <Input
                title="Nombre"
                secureTextEntry={false}
                shape="flat"
                icon="ios-person"
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current.focus()}
                onChangeText={(name) => setName(name)}
                value={name}
                ref={nameRef}
              />
              <Input
                title="Apellido"
                secureTextEntry={false}
                shape="flat"
                icon="ios-person"
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => dniRef.current.focus()}
                onChangeText={(lastname) => setLastName(lastname)}
                value={lastName}
                ref={lastNameRef}
              />
              <Input
                title="DNI"
                secureTextEntry={false}
                shape="flat"
                icon="ios-card"
                style={styles.input}
                keyBoradType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => destinyRef.current.focus()}
                onChangeText={(dni) => setDni(dni)}
                value={dni}
                ref={dniRef}
              />
              {zones ? (
                <Picker
                  selectedValue={zoneId}
                  onValueChange={(value) => setZoneId(value)}
                  mode="dropdown"
                >
                  {zones.map((elem) => (
                    <Picker.Item
                      label={elem.zone}
                      value={elem.id}
                      key={elem.id}
                    />
                  ))}
                </Picker>
              ) : null}
              {destinys ? (
                <Picker
                  selectedValue={destinyId}
                  onValueChange={(value) => setDestinyId(value)}
                  mode="dropdown"
                >
                  {destinys.map((elem) => (
                    <Picker.Item
                      label={elem.name}
                      value={elem.id}
                      key={elem.id}
                    />
                  ))}
                </Picker>
              ) : null}
              <Input
                title="Descipcion Entrada (opcional)"
                secureTextEntry={false}
                shape="flat"
                icon="ios-person"
                style={styles.input}
                onChangeText={(entry) => setEntry(entry)}
                value={entry}
              />
              <Input
                title="Descipcion Salida (opcional)"
                secureTextEntry={false}
                shape="flat"
                icon="ios-person"
                style={styles.input}
                onChangeText={(departure) => setDeparture(departure)}
                value={departure}
              />
              <View>
                <MainButton
                  title="Registrar Entrada"
                  style={{ marginTop: 10 }}
                  onPress={() => createVisit()}
                />
              </View>
              {saving ? splash() : null}
              {saveSuccess ? savedSuccess() : null}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  containerKeyboard: {
    flex: 1,
    justifyContent: "center",
  },
  imgBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  cover: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    opacity: 0.8,
    justifyContent: "center",
  },
  profilePicBox: {
    borderRadius: 70,
    backgroundColor: "white",
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  input: {
    marginBottom: 10,
  },
});
