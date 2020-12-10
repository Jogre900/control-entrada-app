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
  TouchableWithoutFeedback
} from "react-native";

import axios from "axios";
import { API_PORT } from "../../config/index.js";
import { MainColor, lightColor } from "../../assets/colors.js";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-community/picker";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import { Divider } from "../../components/Divider";
import {connect} from 'react-redux'
const companyId = "9a28095a-9029-40ec-88c2-30e3fac69bc5";

const CreateEmployeScreen = ({navigation, zonesRedux, addEmployee}) => {
  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState("");
  const [privilege, setPrivilege] = useState("Supervisor");
  const [date, setDate] = useState(new Date());
  const [changeTurn, setChangeTurn] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [mode2, setMode2] = useState("date");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [create, setCreate] = useState(false);
  const [image, setImage] = useState();
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [saving, setSaving] = useState(false);
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

  //LOADING
  const Splash = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="#ff7e00" />
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
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || changeTurn;
    setShow2(Platform.OS === "ios");
    setChangeTurn(currentDate);
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
    setSaving(true);
    setSuccess(false);
    setCreate(false);
    let data = new FormData();
    data.append("file", { uri: image, name: fileName, type: fileType });
    data.append("name", name);
    data.append("lastName", lastName);
    data.append("dni", dni);
    data.append("email", email);
    data.append("password", "12345");
    data.append("zoneId", zoneId);
    data.append("assignationDate", date.toString());
    data.append("changeTurnDate", changeTurn.toString());
    data.append("companyId", companyId);

    try {
      let res = await axios.post(
        `${API_PORT()}/api/createUser/${privilege}`,
        data,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );

      if (!res.data.error) {
        console.log(res.data.data);
        addEmployee(res.data.data)
        setCreate(true);
        setSaving(false);
        setSuccess(true);
      }
    } catch (error) {
      console.log("error-----: ", error.message);
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

  useEffect(() => {
    requestZone();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Crear Empleado" leftControl={goBackAction()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.mainWrapper}>
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

          <View style={styles.dataContainer}>
            <Text style={styles.containerTitle}>Datos Personales</Text>
            <Divider size="small" />
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
          </View>

          {/* ----ROLL---- */}
          <View style={styles.dataContainer}>
            <Text style={styles.containerTitle}>Tipo Usuario</Text>
            <Divider size="small" />
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
          </View>

          <View style={styles.dataContainer}>
            <Text style={styles.containerTitle}>Horario</Text>
            <Divider size="small"/>
            <View>
              <TouchableOpacity onPress={() => showDatepicker()}>
                <Text>Fecha de Asignacion</Text>
                
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity onPress={() => showDatepicker2()}>
                <Text>Cambio de Turno</Text>
                
              </TouchableOpacity>
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
          </View>
          <View>
            <Text>{moment(date).format("D MMM YYYY")}</Text>
          </View>
          <View>
            <Text>{moment(changeTurn).format('D MMM YYYY')}</Text>
          </View>
          <MainButton
            title="Crear Empleado"
            outlined
            onPress={() => {
              createEmploye();
            }}
          />
          {saving ? <Splash /> : null}
          {success && saveSuccess()}
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = state => ({
  zonesRedux: state.zonesReducer.zones,
})

const mapDispatchToProps = dispatch => ({
  addEmployee(employee){
    dispatch({
      type: 'ADD_EMPLOYEE',
      payload: employee
    })
  }
})
export default connect(mapStateToProps, mapDispatchToProps)(CreateEmployeScreen)
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
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
});
