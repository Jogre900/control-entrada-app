import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import axios from "axios";
import { Picker } from "@react-native-community/picker";
import { API_PORT } from "../../config/index";
import { Divider } from "../../components/Divider";
import { MainColor, ligthColor } from "../../assets/colors";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { storage } from "../../helpers/asyncStorage";

const EntryScreen = ({ navigation, profile, saveVisit }) => {
  console.log("profile from redux---", profile);

  const destinys = profile.userZone[0].Zone.Destinos;
  const userZoneId = profile.userZone[0].id;

  const [saveImg, setSaveImg] = useState();
  const [changeImg, setChangeImg] = useState(false);
  const [userId, setUserId] = useState();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [destiny, setDestiny] = useState("");
  const [entry, setEntry] = useState("");
  const [imgUrl, setImgUrl] = useState();
  const [visitImg, setVisitImg] = useState();
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileName2, setFileName2] = useState("");
  const [fileType2, setFileType2] = useState("");
  const [destinyId, setDestinyId] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [profileCaption, setProfileCaption] = useState("");
  const [destinyCaption, setDestinyCaption] = useState("");
  const [editable, setEditable] = useState(true);
  const nameRef = useRef();
  const lastNameRef = useRef();
  const dniRef = useRef();
  const destinyRef = useRef();

  //REQUEST USERZONE
  const requestUserZone = async () => {
    if (userId) {
      try {
        const res = await axios.get(
          `${API_PORT()}/api//findUserZone/${userId}`
        );
        if (!res.data.error) {
          setDestiny(res.data.data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  //CREATE VISIT
  const createVisit = async () => {
    //console.log("destiny id---------------", destinyId);
    let token = await storage.getItem("userToken");
    console.log("TOKEN FROM STORAGE-----",token)
    if (!name || !lastName || !dni) {
      setProfileCaption("Debe ingresar todos los datos");
      return;
    } else {
      setModalVisibility(true);
      let data = new FormData();
      data.append("name", name);
      data.append("lastName", lastName);
      data.append("dni", dni);
      data.append("file", { uri: imgUrl, name: fileName, type: fileType });
      data.append("file", { uri: visitImg, name: fileName2, type: fileType2 });
      data.append("entryDate", moment().toString());
      data.append("departureDate", moment().toString());
      data.append("descriptionEntry", entry);
      data.append("userZoneId", userZoneId);

      try {
        let res = await axios.post(
          `${API_PORT()}/api/createVisit/${destinyId}`,
          data,
          {
            headers: {
              "content-type": "multipart/form-data",
              Authorization: `bearer ${token}`,
            },
          }
        );
        if (!res.data.error) {
          console.log(res.data);
          saveVisit(res.data.data);
          setModalVisibility(false);
          alert("Registro exitoso!");
          clearInputs();
        }
      } catch (error) {
        setModalVisibility(false);
        alert(error.message);
      }
    }
  };
  //CHECK DNI
  const checkDni = async () => {
    try {
      let res = await axios.get(`${API_PORT()}/api/findVisit/${dni}`);
      console.log(res.data);
      if (!res.data.error) {
        console.log(res.data);
        let citizen = res.data.data;
        //console.log(citizen)
        setName(citizen.name);
        setLastName(citizen.lastName);
        setImgUrl(citizen.picture);
        setEditable(false);
      }else{
        console.log(res.data.msg)
      }
    } catch (error) {
      console.log("error:---", error.message);
    }
  };
  //PICK IMAGE
  const pickImage = async (type) => {
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

      switch (type) {
        case "profile":
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
          break;
        case "visit":
          if (!result.cancelled) {
            setVisitImg(result.uri);
            let filename2 = result.uri.split("/").pop();
            setFileName2(filename2);
            // Infer the type of the image
            let match2 = /\.(\w+)$/.exec(filename2);
            let type2 = match2 ? `image/${match2[1]}` : `image`;
            setFileType2(type2);
            setChangeImg(true);
          } else {
            setChangeImg(false);
          }
          break;

        default:
          break;
      }
    } catch (error) {
      console.log("error: ", error.message);
    }
  };

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
        isVisible={modalVisibility}
        onBackdropPress={() => setModalVisibility(!modalVisibility)}
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

  const clearInputs = () => {
    setName("");
    setLastName("");
    setDni("");
    setDestiny("");
    setSaveImg("");
    setImgUrl("");
  };
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.containerKeyboard} behavior="padding">
        <TopNavigation title="Entrada" leftControl={goBackAction()} />
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <View style={styles.imgBackground}>
            <View style={styles.profilePicBox}>
              {imgUrl ? (
                <Image source={{ uri: imgUrl }} style={styles.profilePic} />
              ) : (
                <TouchableOpacity onPress={() => pickImage("profile")}>
                  <Ionicons name="ios-camera" size={48} color="grey" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => pickImage("profile")}
                style={styles.cameraIcon}
              >
                {changeImg && (
                  <Ionicons name="ios-close" size={42} color="#ff7e00" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.containerTitle}>Datos Personales</Text>
            <Divider size="small" />
            <Input
              title="Nombre"
              secureTextEntry={false}
              shape="flat"
              icon="ios-person"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current.focus()}
              onChangeText={(name) => setName(name)}
              editable={editable}
              value={name}
              ref={nameRef}
            />
            <Input
              title="Apellido"
              secureTextEntry={false}
              shape="flat"
              icon="ios-person"
              returnKeyType="next"
              onSubmitEditing={() => dniRef.current.focus()}
              onChangeText={(lastname) => setLastName(lastname)}
              editable={editable}
              value={lastName}
              ref={lastNameRef}
            />
            <View>
              <Input
                title="DNI"
                secureTextEntry={false}
                shape="flat"
                icon="ios-card"
                keyBoradType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => destinyRef.current.focus()}
                onChangeText={(dni) => setDni(dni)}
                value={dni}
                ref={dniRef}
              />
              <TouchableOpacity onPress={() => checkDni()}>
                <Ionicons name="ios-search" size={28} color="grey" />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.captionText}>{profileCaption}</Text>
            </View>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.containerTitle}>Datos de Ingreso</Text>
            <Divider size="small" />
            <View>
              <Text>Selecione un destino:</Text>
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
            </View>
            <View>
              <Text>Foto de Entrada</Text>
              <TouchableOpacity onPress={() => pickImage("visit")}>
                <Ionicons name="ios-camera" size={48} color="grey" />
              </TouchableOpacity>
              <View>
                <Image
                  source={{ uri: visitImg }}
                  style={{ width: 100, height: 100 }}
                />
              </View>
            </View>
            <Input
              title="Descipcion Entrada (opcional)"
              secureTextEntry={false}
              shape="flat"
              icon="ios-person"
              onChangeText={(entry) => setEntry(entry)}
              value={entry}
            />
            <View>
              <Text style={styles.captionText}>{destinyCaption}</Text>
            </View>
          </View>
          <LoadingModal />
          <View style={{ width: "90%" }}>
            <MainButton
              title="Registrar Entrada"
              style={{ marginTop: 10 }}
              onPress={() => createVisit()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile
});

const mapDispatchToProps = (dispatch) => ({
  saveVisit(visit) {
    dispatch({
      type: "SAVE_VISIT",
      payload: visit,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EntryScreen);

const styles = StyleSheet.create({
  containerKeyboard: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#eee",
  },
  imgBackground: {
    width: "90%",
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "10%",
  },
  profilePicBox: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "pink",
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    //resizeMode: 'contain'
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  dateContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: "normal",
    color: MainColor,
  },
  captionText: {
    fontSize: 16,
    fontWeight: "normal",
    color: "red",
  },
});
