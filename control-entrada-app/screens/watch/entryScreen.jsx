import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
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
import { MainColor, ligthColor, Danger } from "../../assets/colors";
import { connect } from "react-redux";
import { storage } from "../../helpers/asyncStorage";
import { LoadingModal } from "../../components/loadingModal";
import { StatusModal } from "../../components/statusModal";
import { FormContainer } from "../../components/formContainer";
import { CameraModal } from "../../components/cameraModal";
import { helpers } from "../../helpers";
import { BackAction } from "../../helpers/ui/ui";
import { routes } from "../../assets/routes";
import Avatar from "../../components/avatar.component";

let destinyCaption, imageCaption, imageVisitCaption;

let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};

let visitInitialValues = {
  name: "",
  lastName: "",
  dni: "",
  descriptionEntry: null,
  entryDate: new Date(),
  userZoneId: null,
  profileUri: null,
  profileFileName: null,
  profileFileType: null,
  visitUri: null,
  visitFileName: null,
  visitFileType: null,
};
let shortVisitValues = {
  descriptionEntry: null,
  entryDate: new Date(),
  visitUri: null,
  visitFileName: null,
  visitFileType: null,
  userZoneId: null,
  citizenId: null,
};

const EntryScreen = ({ navigation, profile, saveVisit }) => {
  const destinys = profile.userZone[0].Zona.Destinos;
  const userZoneId = profile.userZone[0].id;

  const [visitData, setVisitData] = useState(visitInitialValues);
  const [shortVisitData, setShortVisitData] = useState(shortVisitValues);
  const [statusModalProps, setStatusModalProps] = useState(statusModalValues);
  const [camera, setCamera] = useState(false);
  const [type, setType] = useState("");
  const [profileCaption, setProfileCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [changeImg, setChangeImg] = useState(false);

  const [destinyId, setDestinyId] = useState(destinys[0].id);

  const [editable, setEditable] = useState(true);
  const nameRef = useRef();
  const lastNameRef = useRef();
  const dniRef = useRef();
  const destinyRef = useRef();

  //CLEAR INPUTS
  const clearInputs = () => {
    setName("");
    setLastName("");
    setDni("");
    setDestiny("");
    setSaveImg("");
    setImgUrl("");
    setVisitImg("");
  };
  //CREATE VISIT
  const registerVisit = async () => {
    setLoading(true);
    if (
      visitData.name.length === 0 ||
      visitData.lastName.length === 0 ||
      visitData.dni.length === 0
    ) {
      setProfileCaption("Debe llenar todos los campos");
      setLoading(false);
      return;
    }
    const token = await storage.getItem("userToken");
    //CREAR VISITA DE USUARIO YA REGISTRADO
    if (changeImg) {
      shortVisitData.destinyId = destinyId;
      shortVisitData.userZoneId = userZoneId;
      //console.log(shortVisitData);
      const res = await helpers.createVisit(shortVisitData, token);
      console.log("RES FROM CREATE VISIT SHORT--", res.data);
      if (!res.data.error) {
        setLoading(false);
        saveVisit(res.data.data);
        setStatusModalProps((values) => ({
          ...values,
          visible: true,
          status: true,
          message: res.data.msg,
        }));
      } else {
        setLoading(false);
        setStatusModalProps((values) => ({
          ...values,
          visible: true,
          status: false,
          message: res.data.msg,
        }));
      }
    } else {
      //CREAR VISITA DE USUARIO NUEVO CON TODOS LOS DATOS
      visitData.destinyId = destinyId;
      visitData.userZoneId = userZoneId;
      const res = await helpers.createCitizen(visitData, token);
      console.log(res.data)
      if (res.data.msg === "Usuario ya registrado") {
        setLoading(false);
        setStatusModalProps((values) => ({
          ...values,
          visible: true,
          status: false,
          message: res.data.msg,
        }));
        let citizen = res.data.data;
        setVisitData((values) => ({
          ...values,
          name: citizen.name,
          lastName: citizen.lastName,
          profileUri: citizen.picture,
        }));
        setShortVisitData((values) => ({ ...values, citizenId: citizen.id }));
        setChangeImg(true);
        setEditable(false);
        return;
      } else if (!res.data.error) {
        setLoading(false);
        saveVisit(res.data.data);
        setStatusModalProps((values) => ({
          ...values,
          visible: true,
          status: true,
          message: res.data.msg,
        }));
      }
    }
  };
  //CHECK DNI
  const checkDni = async () => {
    const token = await storage.getItem("userToken");
    const res = await helpers.findCitizendni(visitData.dni, token);
    // console.log(res.data);
    if (!res.data.error) {
      let citizen = res.data.data;
      setVisitData((values) => ({
        ...values,
        name: citizen.name,
        lastName: citizen.lastName,
        profileUri: citizen.picture,
      }));
      setShortVisitData((values) => ({ ...values, citizenId: citizen.id }));
      setChangeImg(true);
      setEditable(false);
    } else {
      setStatusModalProps((values) => ({
        ...values,
        visible: true,
        status: false,
        message: res.data.msg,
      }));
    }
  };

  const profilePic = (uri, fileName, fileType, caption, changeImg) => {
    setVisitData((values) => ({
      ...values,
      profileUri: uri,
      profileFileName: fileName,
      profileFileType: fileType,
    }));
    setChangeImg(false);
  };
  const visitPic = (uri, fileName, fileType, caption) => {
    setVisitData((values) => ({
      ...values,
      visitUri: uri,
      visitFileName: fileName,
      visitFileType: fileType,
    }));
    setShortVisitData((values) => ({
      ...values,
      visitUri: uri,
      visitFileName: fileName,
      visitFileType: fileType,
    }));
    //imageVisitCaption = caption,
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
      <TopNavigation title="Entrada" leftControl={BackAction(navigation)} />
      <KeyboardAvoidingView style={styles.containerKeyboard} behavior="padding">
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <FormContainer title="Datos Personales">
            <View style={styles.pictureContainer}>
              {visitData.profileUri ? (
                <Avatar.Picture
                  size={120}
                  uri={
                    changeImg
                      ? `${API_PORT()}/public/imgs/${visitData.profileUri}`
                      : visitData.profileUri
                  }
                />
              ) : (
                <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
              )}

              <TouchableOpacity
                style={styles.openCameraButton}
                onPress={() => {
                  setCamera(true), setType("profile");
                }}
              >
                <Ionicons name="ios-camera" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <Input
              title="Nombre"
              icon="ios-person"
              shape="flat"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current.focus()}
              onChangeText={(name) => {
                setVisitData((values) => ({ ...values, name }));
              }}
              value={visitData.name}
              editable={editable}
              ref={nameRef}
            />
            <Input
              title="Apellido"
              icon="ios-person"
              shape="flat"
              returnKeyType="next"
              onSubmitEditing={() => dniRef.current.focus()}
              onChangeText={(lastName) => {
                setVisitData((values) => ({ ...values, lastName }));
              }}
              value={visitData.lastName}
              editable={editable}
              ref={lastNameRef}
            />
            <View>
              <Input
                title="dni"
                icon="ios-card"
                shape="flat"
                keyBoradType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => destinyRef.current.focus()}
                onChangeText={(dni) => {
                  setVisitData((values) => ({ ...values, dni }));
                }}
                ref={dniRef}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => checkDni()}
              >
                <Ionicons name="ios-search" size={28} color="grey" />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.captionText}>{profileCaption}</Text>
            </View>
          </FormContainer>
          <FormContainer title="Datos de Ingreso">
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
              <Text style={styles.labelText}>* Foto de Entrada.</Text>

              <View>
                <Text style={styles.captionText}>{imageVisitCaption}</Text>
              </View>
              <View style={styles.pictureVisitContainer}>
                {visitData.visitUri ? (
                  <Image
                    source={{ uri: visitData.visitUri }}
                    style={{
                      width: "100%",
                      height: 250,
                      overflow: "hidden",
                      borderRadius: 5,
                    }}
                  />
                ) : (
                  <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
                )}
                <TouchableOpacity
                  onPress={() => {
                    setCamera(true), setType("visit");
                  }}
                  style={styles.openCameraButton}
                >
                  <Ionicons name="ios-camera" size={32} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <Input
              title="Descipcion Entrada (opcional)"
              icon="md-create"
              shape="flat"
              onChangeText={(descriptionEntry) => {
                setVisitData((values) => ({ ...values, descriptionEntry }));
                setShortVisitData((values) => ({
                  ...values,
                  descriptionEntry,
                }));
              }}
            />
            <View>
              <Text style={styles.captionText}>{destinyCaption}</Text>
            </View>
          </FormContainer>
          <View style={{ width: "90%" }}>
            <MainButton
              title="Registrar Entrada"
              style={{ marginVertical: 5 }}
              onPress={() => registerVisit()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <CameraModal
        status={camera}
        onClose={() => setCamera(false)}
        profile={profilePic}
        anotherPic={visitPic}
        type={type}
      />
      <LoadingModal visible={loading} message="Guardando..." />
      <StatusModal
        {...statusModalProps}
        onClose={() =>
          setStatusModalProps((values) => ({ ...values, visible: false }))
        }
      />
    </View>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
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
  pictureVisitContainer: {
    alignSelf: "center",
    position: "relative",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 5,
    borderRadius: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 250,
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
  captionText: {
    fontSize: 15,
    fontWeight: "600",
    color: Danger,
  },
  labelText: {
    color: "#8e8e8e",
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
