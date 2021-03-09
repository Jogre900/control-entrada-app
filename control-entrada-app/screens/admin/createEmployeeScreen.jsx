import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

import axios from "axios";
import { API_PORT } from "../../config/index.js";
import {
  MainColor,
  ThirdColor,
  lightColor,
  Danger,
} from "../../assets/colors.js";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-community/picker";

import moment from "moment";

import { FormContainer } from "../../components/formContainer";
import { LoadingModal } from "../../components/loadingModal";
import { StatusModal } from "../../components/statusModal";
import Avatar from "../../components/avatar.component";
import { CameraModal } from "../../components/cameraModal";
import { connect } from "react-redux";


const CreateEmployeScreen = ({
  navigation,
  zonesRedux,
  companyRedux,
  addEmployee,
}) => {
  const [caption, setCaption] = useState("");
  const [timeCaption, setTimeCaption] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [zoneId, setZoneId] = useState(zonesRedux[0].id);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState("");
  const [privilege, setPrivilege] = useState("Supervisor");
  const [date, setDate] = useState(new Date());
  const [entryHolder, setEntryHolder] = useState(false);
  const [changeTurn, setChangeTurn] = useState(new Date());
  const [departureHolder, setDepartureHolder] = useState(false);
  const [mode, setMode] = useState("date");
  const [mode2, setMode2] = useState("date");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [create, setCreate] = useState(false);
  const [changeImg, setChangeImg] = useState(false);
  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [camera, setCamera] = useState(false);
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("admin-home");
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  //REGISTER
  const saveSuccess = () => {
    Alert.alert("Registro Exitoso!");
    setSuccess(false);
  };

  //DATE PICKER CONFIG
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
    setTimeCaption("");
    setEntryHolder(true);
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || changeTurn;
    setShow2(Platform.OS === "ios");
    setChangeTurn(currentDate);
    setTimeCaption("");
    setDepartureHolder(true);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showDatepicker2 = () => {
    showMode2("date");
  };

  const showMode2 = (currentMode) => {
    setShow2(true);
  };

  const profilePic = (uri, fileName, fileType, caption, changeImg) => {
    setImage(uri),
      setFileName(fileName),
      setFileType(fileType),
      //imageCaption = caption,
      setChangeImg(changeImg);
  };

  //CREATE EMPLOYEE
  const createEmploye = async () => {
    setVisible(true);
    if (
      name.length === 0 ||
      lastName.length === 0 ||
      dni.length === 0 ||
      email.length === 0
    ) {
      setCaption("Debe llenar todos los campos");
      setVisible(false);
      return;
    }
    if (image.length === 0) {
      setImageCaption("Debe agregar una foto");
      setVisible(false);
      return;
    }
    if (!entryHolder || !departureHolder) {
      setTimeCaption("Debe seleccionar ambas horas.");
      setVisible(false);
      return;
    }
    if (
      moment(date).format("D MMM YYYY") >
      moment(changeTurn).format("D MMM YYYY")
    ) {
      setTimeCaption(
        "La fecha de inicio no puede ser mayor que la de culminacion"
      );
      setVisible(false);
      return;
    }

    if (
      moment(date).format("D MMM YYYY") ===
      moment(changeTurn).format("D MMM YYYY")
    ) {
      setTimeCaption("La fecha de inicio y culminacion deben ser distintas");
      setVisible(false);
      return;
    }
    let data = new FormData();
    data.append("file", { uri: image, name: fileName, type: fileType });
    data.append("name", name);
    data.append("lastName", lastName);
    data.append("dni", dni);
    data.append("email", email);
    data.append("password", "12345");
    data.append("zoneId", zoneId);
    data.append("privilege", privilege);
    data.append("assignationDate", date.toString());
    data.append("changeTurnDate", changeTurn.toString());
    data.append("companyId", companyRedux[0].id);

    try {
      if (privilege === "Supervisor") {
        const res = await axios.post(
          `${API_PORT()}/api/createUserSupervisor/`,
          data,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        );
        console.log("CREATE EMPLOYEE----", res.data);
        if (!res.data.error) {
          console.log(res.data.data);
          addEmployee(res.data.data);
          setVisible(false);
          setSuccess(true);
          //setCreate(true);
          //setSaving(false);
        } else {
          alert(res.data.msg);
          setVisible(false);
        }
      } else {
        const res = await axios.post(
          `${API_PORT()}/api/createUserWatchman`,
          data,
          {
            headers: {
              "content-type": "multipart/form-data",
            },
          }
        );
        if (!res.data.error) {
          console.log(res.data.data);
          addEmployee(res.data.data);
          setCreate(true);
          setVisible(false);
          setSuccess(true);
          setName("");
          setLastName("");
          setEmail("");
          setDni("");
          setImage("");
          setEntryHolder(false);
          setDepartureHolder(false);
          //setSaving(false);
        } else {
          alert(res.data.msg);
          setVisible(false);
        }
      }
    } catch (error) {
      setVisible(false);
      console.log("error-----: ", error);
      alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Crear Empleado" leftControl={goBackAction()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View style={styles.pickPictureContainer}>
            <View style={styles.pictureContainer}>
              {image ? (
                <Avatar.Picture size={120} uri={image} />
              ) : (
                <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
              )}
              <TouchableOpacity
                onPress={() => {
                  setCamera(true);
                }}
                style={styles.openCameraButton}
              >
                <Ionicons name="ios-camera" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <View>
              <Text
                style={{
                  color: Danger,
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {imageCaption}
              </Text>
            </View>
          </View>

          <FormContainer title="Datos Personales">
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              title="Nombre"
              icon="ios-person"
              returnKeyType="next"
              onChangeText={(nombre) => {
                setName(nombre), setCaption("");
              }}
              value={name}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              icon="ios-people"
              title="Apellido"
              returnKeyType="next"
              onChangeText={(apellido) => {
                setLastName(apellido), setCaption("");
              }}
              value={lastName}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              title="DNI"
              icon="ios-card"
              returnKeyType="next"
              onChangeText={(dni) => {
                setDni(dni), setCaption("");
              }}
              value={dni}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              title="Email"
              icon="ios-mail"
              returnKeyType="next"
              onChangeText={(email) => {
                setEmail(email), setCaption("");
              }}
              value={email}
            />
            <View>
              <Text
                style={{
                  color: Danger,
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {caption}
              </Text>
            </View>
          </FormContainer>

          {/* ----ROLL---- */}
          <FormContainer title="Tipo Usuario">
            <Picker
              mode="dropdown"
              selectedValue={privilege}
              onValueChange={(value) => setPrivilege(value)}
            >
              <Picker.Item label={"Supervisor"} value={"Supervisor"} />
              <Picker.Item label={"Vigilante"} value={"Watchman"} />
            </Picker>
            <View>
              <Text>Zonas</Text>
              {zonesRedux ? (
                <Picker
                  mode="dropdown"
                  selectedValue={zoneId}
                  onValueChange={(value) => setZoneId(value)}
                >
                  {zonesRedux.map((item, i) => (
                    <Picker.Item label={item.zone} value={item.id} key={i} />
                  ))}
                </Picker>
              ): alert("No hay zonas creadas, no podras registrar personal")}
            </View>
          </FormContainer>

          <FormContainer title="Horario">
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <View style={styles.pickerButtonContainer}>
                <MainButton
                  style={styles.pickerButton}
                  title="Inicio Contrato"
                  onPress={() => showDatepicker()}
                />
                <Text style={{ alignSelf: "center" }}>
                  {entryHolder ? moment(date).format("D MMM YYYY") : "----"}
                </Text>
              </View>
              <View style={styles.pickerButtonContainer}>
                <MainButton
                  style={styles.pickerButton}
                  title="Fin Contrato"
                  onPress={() => showDatepicker2()}
                />
                <Text style={{ alignSelf: "center" }}>
                  {departureHolder
                    ? moment(changeTurn).format("D MMM YYYY")
                    : "----"}
                </Text>
              </View>
            </View>
            {show && (
              <View>
                <DateTimePicker
                  testID="dateTimePicker1"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              </View>
            )}

            {show2 && (
              <DateTimePicker
                value={changeTurn}
                mode={"date"}
                is24Hour={true}
                display="default"
                onChange={onChange2}
              />
            )}
            <View>
              <Text
                style={{
                  color: Danger,
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                {timeCaption}
              </Text>
            </View>
          </FormContainer>
          <View
            style={{
              width: "90%",
            }}
          >
            <MainButton
              style={{ marginVertical: 5 }}
              title="Crear Empleado"
              onPress={() => {
                createEmploye();
              }}
            />
          </View>
        </View>
      </ScrollView>
      <CameraModal
        status={camera}
        onClose={() => setCamera(false)}
        profile={profilePic}
        type={"profile"}
      />
      <LoadingModal status={visible} message="Guardando..." />
      <StatusModal status={success} onClose={() => setSuccess(false)} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  zonesRedux: state.zones.zones,
  companyRedux: state.profile.company,
});

const mapDispatchToProps = (dispatch) => ({
  addEmployee(employee) {
    dispatch({
      type: "ADD_EMPLOYEE",
      payload: employee,
    });
  },
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateEmployeScreen);
const styles = StyleSheet.create({
  container: {
    // alignContent: "center",
    // justifyContent: 'center',
    // backgroundColor: 'red',
  },
  mainWrapper: {
    width: "90%",
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

  photoButtonBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: "normal",
    color: MainColor,
  },
  pickerButtonContainer: {
    width: "45%",
    justifyContent: "center",
  },
  pickerButton: {
    backgroundColor: ThirdColor,
    borderColor: ThirdColor,
    marginVertical: 5,
  },
});
