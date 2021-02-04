import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Vibration,
  Animated,
} from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";

//componentes
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import { Header } from "../../components/header.component";
import Input from "../../components/input.component.jsx";
import { MainButton } from "../../components/mainButton.component";
import moment from "moment";
import { MainColor } from "../../assets/colors";

const ZonasScreen = ({
  navigation,
  companyRedux,
  saveZones,
  addZones,
  removeZones,
  zonesRedux,
  setAvailable
}) => {
  //console.log("company REdux  ", companyRedux);
  console.log("zonas desde REdux  ", zonesRedux);
  console.log("Company from redux", companyRedux[0].id)
  const [selectItem, setSeletedItem] = useState([]);
  const [changeStyle, setChangeStyle] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [zone, setZone] = useState([]);
  const [zoneName, setZoneName] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [entranceTime, setEntranceTime] = useState(new Date());
  const [departureTime, setDepartureTime] = useState(new Date());
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [scaleUp, setScaleUp] = useState(new Animated.Value(0));
  // const opacityInterpolate = scaleUp.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0.1, 1],
  // });

  const showCheckMark = () => {
    Animated.timing(scaleUp, {
      toValue: 1,
      duration: 1000,
    }).start();
  };
  const hideCheckMark = () => {
    Animated.timing(scaleUp, {
      toValue: 0,
      duration: 1000,
    }).start();
  };

  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("admin-home")}>
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  //LOADING
  const Splash = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="red" />
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

  //ZONE API

  const requestZone = async () => {
    try {
      let res = await axios.get(
        `${API_PORT()}/api/findZones/${companyRedux.id}`
      );
      if (!res.data.error && res.data.data.length > 0) {
        setZone(res.data.data);
        await saveZones(res.data.data);
      } else {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const createZone = async () => {
    console.log("hora 1", moment(entranceTime).format("HH:mm a").toString())
    console.log("hora 2", moment(departureTime).format("HH:mm a").toString())
    try {
      let res = await axios.post(
        `${API_PORT()}/api/createZone/${companyRedux[0].id}`,
        {
          zone: zoneName,
          firsEntryTime: moment(entranceTime).format("HH:mm").toString(),
          firsDepartureTime: moment(departureTime).format("HH:mm").toString(),
        }
      );
      console.log("res crear zonas--", res.data)
      if (!res.data.error) {
        addZones(res.data.data);
        alert("Creacion con exito!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const getUserZone = (selectedItem) => {
    let userZone = []
    console.log("zona selec---", selectItem)
      //zonesRedux.encargado_zona.map(e => console.log("encargado_zona---",e))
    
    return userZone
  }
  
  const deleteZones = async (zonesId) => {
    setDeleted(false);
    try {
      let res = await axios({
        method: "DELETE",
        url: `${API_PORT()}/api/deleteZone`,
        data: {
          zonesId,
        },
      });
      console.log(res.data)
      if (!res.data.error) {
        await setAvailable(res.data.data)
        await removeZones(zonesId);
        setSeletedItem([]);
        alert("Borrado!!");
        setDeleted(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  const clearSelect = () => {
    setSeletedItem([]);
  };

  
  const onLong = (id) => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      hideCheckMark();
      return;
    }
    Vibration.vibrate(100),
      setSeletedItem(selectItem.concat(id)),
      showCheckMark();
    setChangeStyle(!changeStyle);
  };
  // useEffect(() => {
  //   requestCompany();
  // }, []);
  // useEffect(() => {
  //   requestZone();
  // }, [deleted]);

  useFocusEffect(
    React.useCallback(() => {
      //setZone([]);
      setSeletedItem([]);
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      {selectItem.length >= 1 ? (
        <Header
          value={selectItem.length}
          clearAction={() => clearSelect()}
           deleteAction={() => deleteZones(selectItem)}
          //deleteAction={() => getUserZone(selectItem)}
        />
      ) : (
        <TopNavigation title="Zonas" leftControl={goBackAction()} />
      )}
      <ScrollView>
        <View>
          <View>
            {zonesRedux.length > 0 ? (
              zonesRedux.map((item, i) => (
                <View key={i}>
                  <TouchableOpacity
                    onPress={
                      selectItem.length > 0
                        ? () => onLong(item.id)
                        : () =>
                            navigation.navigate("zone_detail", {zoneId: item.id})
                    }
                    onLongPress={() => onLong(item.id)}
                    delayLongPress={200}
                    style={[
                      selectItem.includes(item.id)
                        ? { backgroundColor: "rgba(20, 144, 150, 0.4)" }
                        : { backgroundColor: "#fff" },
                      styles.listItemBox,
                    ]}
                  >
                    <View>
                      <Text>{item.zone}</Text>
                      {/* {selectItem.includes(item.id) ? (
                        <Animated.View
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: 22,
                            width: 22,
                            borderRadius: 22 / 2,
                            borderColor: "#fff",
                            borderWidth: 0.5,
                            transform: [{ scale: scaleUp }],
                          }}
                        >
                          <Ionicons
                            name="md-checkmark-circle"
                            size={22}
                            color="#09f"
                          />
                        </Animated.View>
                      ) : null} */}
                    </View>
                    <Text>
                      Entrada: {item.firsEntryTime}
                    </Text>
                    <Text>
                      Salida: {item.firsDepartureTime}
                    </Text>
                    <Ionicons name="md-pin" size={28} color="grey" />
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text>No hay zonas creadas!</Text>
              </View>
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

const stateToProps = (state) => ({
  companyRedux: state.profile.company,
  zonesRedux: state.zones.zones,
});

const mapDispatchToProps = (dispatch) => ({
  // saveZones(zones) {
  //   dispatch({
  //     type: "setZones",
  //     payload: zones,
  //   });
  // },
  addZones(zones) {
    dispatch({
      type: "addZones",
      payload: zones,
    });
  },
  removeZones(zonesId) {
    dispatch({
      type: "REMOVE_ZONES",
      payload: zonesId,
    });
  },
  setAvailable(users){
    dispatch({
      type: 'SET_AVAILABLE',
      payload: users
    })
  }
});

export default connect(stateToProps, mapDispatchToProps)(ZonasScreen);

const styles = StyleSheet.create({
  listItemBox: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 5,
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "#fff",
    marginVertical: 10,
  },
  selectedItem: {
    backgroundColor: "rgba(20, 144, 150, 0.4)",
  },
});
