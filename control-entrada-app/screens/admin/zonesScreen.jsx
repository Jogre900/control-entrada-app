import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-community/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

//componentes
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import Input from "../../components/input.component.jsx";
import { MainButton } from "../../components/mainButton.component";
import moment from "moment";
import { Maincolor } from "../../assets/colors";
const adminId = "e6cf69f4-e718-4b5f-a127-c1910db5f162";

const DEVICE_WIDTH = Dimensions.get("window").width;

const ZonasScreen = ({ navigation, companyRedux, saveZones, zonesRedux }) => {
  console.log("company REdux  ", companyRedux);
  console.log("company REdux  ", zonesRedux);
  const [zone, setZone] = useState([]);
  const [zoneName, setZoneName] = useState("");
  const [create, setCreate] = useState(false);
  const [deleteZone, setDeleteZone] = useState(false);
  const [company, setCompany] = useState(companyRedux);
  const [companyId, setCompanyId] = useState(companyRedux.id);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [entranceTime, setEntranceTime] = useState(new Date());
  const [departureTime, setDepartureTime] = useState(new Date());
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const goBackAction = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            navigation.navigate("admin-home");
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
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

  //CLEAR INPUTS
  const clearInputs = () => setZoneName("");

  //TIMEPICKER
  const displayTimePicker = () => {
    setShow1(true);
  };

  const showMode = (currentMode) => {
    setShow1(true);
    //setMode(currentMode);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || entranceTime;
    setShow1(false);
    setEntranceTime(currentDate);
  };

  const displayTimePicker2 = () => {
    showMode2("date");
  };

  const showMode2 = (currentMode) => {
    setShow2(true);
    //setMode(currentMode);
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || departureTime;
    setShow2(Platform.OS === "ios");
    setDepartureTime(currentDate);
  };

  // const requestCompany = async () => {
  //   setLoading(true);
  //   try {
  //     let res = await axios.get(`${API_PORT()}/api/findCompany/${adminId}`);
  //     console.log("res.data: ", res.data);
  //     if (!res.data.error) {
  //       alert("busqueda exitosa");
  //       setCompany(res.data.data);
  //       setCompanyId(res.data.data[0].id);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  //ZONE API

  const requestZone = async () => {
    try {
      let res = await axios.get(`${API_PORT()}/api/findZones/${companyId}`);
      if (!res.data.error) {
        setZone(res.data.data);
        await saveZones(res.data.data);
        console.log("zones:-------", res.data.data);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const createZone = async () => {
    console.log("company id:----", companyId);
    setCreate(false);
    setSaving(true);
    try {
      let res = await axios.post(`${API_PORT()}/api/createZone/${companyId}`, {
        zone: zoneName,
        firsEntryTime: entranceTime.toString(),
        firsDepartureTime: departureTime.toString(),
      });
      if (!res.data.error) {
        console.log(res);
        setCreate(true);
        setSaving(false);
        setSuccess(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const deleteZones = async (id) => {
    setDeleteZone(false);
    try {
      let res = await axios.delete(`${API_PORT()}/api/deleteZone/${id}`);
      if (res) setDeleteZone(true);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate("zone_detail", {
              id: item.id,
              zone: item.zone,
              destinys: item.Destinos,
              watchmen: item.encargado_zona,
              entryTime: item.firsEntryTime,
              departureTime: item.firsDepartureTime,
            })
          }
          style={styles.zones}
        >
          <Text>{item.zone}</Text>
          <Text>Entrada: {moment(item.firsEntryTime).format("HH: mm a")}</Text>
          <Text>
            Salida: {moment(item.firsDepartureTime).format("HH:mm a")}
          </Text>
          <Ionicons name="md-pin" size={28} color="grey" />
        </TouchableOpacity>

        <View>
          <TouchableOpacity onPress={() => deleteZones(item.id)}>
            <Ionicons name="ios-trash" size={28} color="#cccc" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  // useEffect(() => {
  //   requestCompany();
  // }, []);
  useEffect(() => {
    requestZone();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Zonas" leftControl={goBackAction()} />
      <ScrollView>
        <View>
          {/* <View>
            //company box
            <Text>Selecione Empresa:</Text>
            {loading ? (
              <Splash />
            ) : (
              <Picker
                mode="dropdown"
                selectedValue={companyId}
                onValueChange={(itemValue, itemIndex) =>
                  setCompanyId(itemValue)
                }
              >
                {Object.values(company).map((item, i) => (
                  
                   <Picker.Item
                     label={item}
                     value={item}
                     key={item}
                   />
                 ))}
              </Picker>
            )}
          </View> */}
          <View>
            <Text>company ID: {companyId}</Text>
          </View>
          <View>
            <Text>Zonas:</Text>
            {zone ? (
              zone.map((item, i) => (
                <View key={i}>
                  {console.log(item)}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("zone_detail", {
                        id: item.id,
                        zone: item.zone,
                        destinys: item.Destinos,
                        watchmen: item.encargado_zona,
                        entryTime: item.firsEntryTime,
                        departureTime: item.firsDepartureTime,
                      })
                    }
                    style={styles.zones}
                  >
                    <Text>{item.zone}</Text>
                    <Text>
                      Entrada: {moment(item.firsEntryTime).format("HH: mm a")}
                    </Text>
                    <Text>
                      Salida: {moment(item.firsDepartureTime).format("HH:mm a")}
                    </Text>
                    <Ionicons name="md-pin" size={28} color="grey" />
                  </TouchableOpacity>
                  <View>
                    <TouchableOpacity onPress={() => deleteZones(item.id)}>
                      <Ionicons name="ios-trash" size={28} color="#cccc" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              // <FlatList data={zone} renderItem={renderItem} numColumns={3} />
              <ActivityIndicator size="large" color={MainColor} />
            )}
          </View>
          <Text>Crear Zona</Text>

          <Input
            style={{ borderColor: "black", marginBottom: 10 }}
            styleInput={{ color: "black" }}
            title="NombreZona"
            textColor="black"
            shape="square"
            alignText="center"
            returnKeyType="next"
            onChangeText={(nombre) => {
              setZoneName(nombre);
            }}
            value={zoneName}
          />
          <View>
            <TouchableOpacity onPress={() => displayTimePicker()}>
              <Text>Hora de Entrada</Text>
            </TouchableOpacity>
            <Text>
              hora de entrada: {moment(entranceTime).format("HH:mm a")}
            </Text>
            {show1 && (
              <DateTimePicker
                value={entranceTime}
                mode={"time"}
                is24Hour={false}
                display="default"
                onChange={onChange}
              />
            )}
          </View>
          <View>
            <TouchableOpacity onPress={() => displayTimePicker2()}>
              <Text>Hora de Salida</Text>
            </TouchableOpacity>
            <Text>
              hora de salida: {moment(departureTime).format("HH:mm a")}
            </Text>
            {show2 && (
              <DateTimePicker
                value={departureTime}
                mode={"time"}
                is24Hour={false}
                display="default"
                onChange={onChange2}
              />
            )}
          </View>
          {entranceTime > departureTime
            ? console.log("Es mayor!!!")
            : console.log("Es menor.!!")}

          <MainButton
            title="Registrar Zona"
            onPress={() => {
              createZone();
            }}
          />
        </View>
        {saving ? <Splash /> : null}
        {success && saveSuccess()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  zones: {
    borderWidth: 1,
    borderColor: "grey",
    borderStyle: "dotted",
    //backgroundColor: "pink",
    alignItems: "center",
    margin: 0.5,
    padding: 10,
    //minWidth: Math.floor(DEVICE_WIDTH / 3),
  },
});
const stateToProps = (state) => ({
  companyRedux: state.profileReducer.company,
  zonesRedux: state.zonesReducer.zones,
});

const mapDispatchToProps = (dispatch) => ({
  saveZones(zones) {
    dispatch({
      type: "setZones",
      payload: zones,
    });
  },
});

export default connect(stateToProps, mapDispatchToProps)(ZonasScreen);
