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
import { MainColor, ThirdColor, lightColor } from "../../assets/colors.js";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-community/picker";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";

import { FormContainer } from "../../components/formContainer";
import { LoadingModal } from "../../components/loadingModal";
import { StatusModal } from "../../components/statusModal";
import { connect } from "react-redux";
const companyId = "9a28095a-9029-40ec-88c2-30e3fac69bc5";

const CreateEmployeScreen = ({
  navigation,
  zonesRedux,
  companyRedux,
  addEmployee,
}) => {
  // console.log("zonesRedux---", zonesRedux);
  // console.log("company Redux-----", companyRedux);

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
  const [image, setImage] = useState();
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
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
    setEntryHolder(true);
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || changeTurn;
    setShow2(Platform.OS === "ios");
    setChangeTurn(currentDate);
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

  const createEmploye = async () => {
    setVisible(true);
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
          //setSaving(false);
        } else {
          alert(res.data.msg);
          setVisible(false);
        }
      }
    } catch (error) {
      setVisible(false)
      console.log("error-----: ", error);
      alert(error.message);
    }
  };

  const requestZone = async () => {
    try {
      let res = await axios.get(`${API_PORT()}/api/findZones/${companyId}`);
      if (!res.data.error) {
        console.log("zones array:-----", res.data.data[0]);
        setZones(res.data.data);
        setZoneId(res.data.data[0].id);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const getImage = async (type) => {
    const options = {
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    };
    if (type === "galery") {
      try {
        var result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          ...options,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        var result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          ...options,
        });
      } catch (error) {
        console.log(error);
      }
    }

    if (!result.cancelled) {
      console.log(result);
      setImage(result.uri);
      let filename = result.uri.split("/").pop();
      setFileName(filename);
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      setFileType(type);
      console.log("fileName: ", filename);
      console.log("file type: ", type);
    }
  };

  // useEffect(() => {
  //   requestZone();
  // }, []);
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Crear Empleado" leftControl={goBackAction()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <View style={image ? styles.imageContainer2 : styles.imageContainer}>
            <View style={styles.imageBox}>
              {image ? (
                <Image
                  source={{ uri: image }}
                  style={{ width: 150, height: 150 }}
                />
              ) : (
                <TouchableOpacity
                  style={{ justifyContent: "center", alignItems: "center" }}
                  onPress={() => getImage()}
                >
                  <Ionicons name="md-photos" size={28} color={lightColor} />
                  <Text>Agregar Foto</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* <View style={styles.photoButtonBox}>
              <TouchableOpacity onPress={() => getImage("camera")}>
                <Ionicons name="ios-camera" size={28} color={lightColor} />
              </TouchableOpacity>
            </View> */}
          </View>

          <FormContainer title="Datos Personales">
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              title="Nombre"
              textColor="black"
              icon="ios-person"
              //shape="square"
              //alignText="center"
              returnKeyType="next"
              onChangeText={(nombre) => {
                setName(nombre);
              }}
              value={name}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              icon="ios-people"
              title="Apellido"
              textColor="black"
              //shape="square"
              //alignText="center"
              returnKeyType="next"
              onChangeText={(apellido) => {
                setLastName(apellido);
              }}
              value={lastName}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              title="DNI"
              icon="ios-card"
              textColor="black"
              //shape="square"
              //alignText="center"
              returnKeyType="next"
              onChangeText={(dni) => {
                setDni(dni);
              }}
              value={dni}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              title="Email"
              icon="ios-mail"
              textColor="black"
              //shape="flat"
              //alignText="center"
              returnKeyType="next"
              onChangeText={(email) => {
                setEmail(email);
              }}
              value={email}
            />
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
              {zonesRedux && (
                <Picker
                  mode="dropdown"
                  selectedValue={zoneId}
                  onValueChange={(value) => setZoneId(value)}
                >
                  {zonesRedux.map((item, i) => (
                    <Picker.Item label={item.zone} value={item.id} key={i} />
                  ))}
                </Picker>
              )}
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
      <LoadingModal status={visible} message='Guardando...'/>
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
  imageContainer: {
    //backgroundColor: "#f09",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2.5,
    height: 250,
    borderColor: "#ccc",
    borderWidth: 2,
    borderStyle: "dotted",
  },
  imageContainer2: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2.5,
    height: 250,
    // borderColor: "#ccc",
    // borderWidth: 2,
    // borderStyle: "dotted",
  },
  imageBox: {
    justifyContent: "center",
    alignItems: "center",
    //height: 150
    //backgroundColor: "red",
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
