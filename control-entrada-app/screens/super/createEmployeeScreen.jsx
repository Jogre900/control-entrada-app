import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Button,
  ScrollView,
  Image,
} from "react-native";

import axios from "axios";
import { API_PORT } from "../../config/index.js";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-community/picker";
import * as ImagePicker from "expo-image-picker";
import { ZoneDetailScreen } from "./zoneDetailScreen.jsx";

const rol = [{ rol: "Super" }, { rol: "Vigilante" }];

export const CreateEmployeScreen = (props) => {
  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState("");
  const [privilege, setPrivilege] = useState("");
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
  const goBackAction = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
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
    setCreate(false);
    let data = new FormData();
    data.append("file", { uri: image, name: fileName, type: fileType });
    data.append("name", name);
    data.append("lastName", lastName);
    data.append("dni", dni);
    data.append("email", email);
    data.append("picture", fileName);
    data.append("password", "12345");
    data.append("privilege", privilege);
    data.append("assignationDate", date.toString());
    data.append("changeTurnDate", changeTurn.toString());
    // let data = {
    //   name,
    //   lastName,
    //   dni,
    //   email,
    //   password: "12345",
    //   picture,
    //   privilege,
    //   assignationDate: date,
    //   changeTurnDate: changeTurn,
    // };
    console.log("zine Id:", zoneId);
    console.log(data);
    try {
      let res = await axios.post(
        `${API_PORT()}/api/createUser/${zoneId}`,
        data,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      console.log(res.data);
      if (res.data.error === false) {
        console.log("asigna: ", date);
        console.log("turno: ", changeTurn);
        console.log(res.data);
        setCreate(true);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const requestZone = async () => {
    try {
      let res = await axios.get(`${API_PORT()}/api/findZones`);
      if (res) setZones(res.data.data);
    } catch (error) {
      console.log("error: ", error);
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
      setImage(result.uri);
      let filename = result.uri.split("/").pop();
      setFileName(filename);
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
      setFileType(type);
      console.log("fileName: ", fileName);
      console.log("file type: ", fileType);
    }
  };

  useEffect(() => {
    requestZone();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Crear Empleado" leftControl={goBackAction()} />
      <ScrollView>
        <View>
          <Input
            style={{ borderColor: "black", marginBottom: 10 }}
            styleInput={{ color: "black" }}
            title="Nombre"
            textColor="black"
            shape="square"
            alignText="center"
            returnKeyType="next"
            onChangeText={(nombre) => {
              setName(nombre);
            }}
            value={name}
          />
          <Input
            style={{ borderColor: "black", marginBottom: 10 }}
            styleInput={{ color: "black" }}
            title="Apellido"
            textColor="black"
            shape="square"
            alignText="center"
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
            textColor="black"
            shape="square"
            alignText="center"
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
            textColor="black"
            shape="square"
            alignText="center"
            returnKeyType="next"
            onChangeText={(email) => {
              setEmail(email);
            }}
            value={email}
          />
          <View>
            {image && (
              <View>
                <Image
                  source={{ uri: image }}
                  style={{ width: 120, height: 120 }}
                />
              </View>
            )}
            <Button title="Galeria" onPress={() => getImage("galery")} />
            <Button title="Camara" onPress={() => getImage("camera")} />
          </View>
          <Picker
            mode="dropdown"
            selectedValue={privilege}
            onValueChange={(value) => setPrivilege(value)}
          >
            {rol.map((item, i) => (
              <Picker.Item label={item.rol} value={item.rol} key={i} />
            ))}
          </Picker>
          {
            <View style={{ backgroundColor: "red" }}>
              <Text>algo{privilege}</Text>
            </View>
          }
          {privilege === "Vigilante" ? (
            <View>
              <Text>Zonas</Text>
              {zones && (
                <Picker
                  mode="dropdown"
                  selectedValue={zoneId}
                  onValueChange={(value) => setZoneId(value)}
                >
                  {zones.map((item, i) => (
                    <Picker.Item label={item.zone} value={item.id} key={i} />
                  ))}
                </Picker>
              )}
            </View>
          ) : null}
          <View style={{ backgroundColor: "orange" }}>
            <Text>Zone id: {zoneId}</Text>
          </View>

          <View>
            <View>
              <Button onPress={showDatepicker} title="Fecha de asignacion" />
            </View>
            <View>
              <Button onPress={showDatepicker2} title="Cambio de Turno" />
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
            <Text>{date.toString()}</Text>
          </View>
          <View>
            <Text>{changeTurn.toString()}</Text>
          </View>

          <MainButton
            title="Crear Empleado"
            onPress={() => {
              createEmploye();
            }}
          />
          {create ? (
            <View>
              <Text>Creacion Exitosa!</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create();
