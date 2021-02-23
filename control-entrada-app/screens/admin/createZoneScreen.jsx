import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { API_PORT } from "../../config/index";
import { connect } from "react-redux";
import { MainButton } from "../../components/mainButton.component";
import { FormContainer } from "../../components/formContainer";
import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Input from "../../components/input.component.jsx";
import { StatusModal } from "../../components/statusModal";
import { MainColor, ThirdColor } from "../../assets/colors";

const timeState = {
  entry: false,
  exit: false,
};

const CreateZoneScreen = ({ navigation, addZones, companyRedux }) => {
  const [displayTime, setDisplayTime] = useState(timeState);
  const [zoneName, setZoneName] = useState();
  const [entranceTime, setEntranceTime] = useState(new Date());
  const [departureTime, setDepartureTime] = useState(new Date());
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [visible, setVisible] = useState(false);
  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Zones");
            setZoneName("");
            setDepartureTime(new Date());
            setEntranceTime(new Date());
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
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
    setDisplayTime({ ...displayTime, entry: true });
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
    setDisplayTime({ ...displayTime, exit: true });
  };
  const createZone = async () => {
    try {
      let res = await axios.post(
        `${API_PORT()}/api/createZone/${companyRedux[0].id}`,
        {
          zone: zoneName,
          firsEntryTime: moment(entranceTime).format("HH:mm").toString(),
          firsDepartureTime: moment(departureTime).format("HH:mm").toString(),
        }
      );
      console.log("res crear zonas--", res.data);
      if (!res.data.error) {
        addZones(res.data.data);
        setZoneName('')
        setVisible(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <>
      <TopNavigation title="Crear Zona" leftControl={goBackAction()} />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FormContainer title="Ingrese los datos de la zona">
          <Input
            style={{ borderColor: "black", marginBottom: 10 }}
            styleInput={{ color: "black" }}
            title="Nombre de la Zona"
            icon="md-globe"
            textColor="black"
            shape="square"
            //alignText="center"
            returnKeyType="next"
            onChangeText={(nombre) => {
              setZoneName(nombre);
            }}
            value={zoneName}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={styles.buttomTimeContainer}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => displayTimePicker()}
              >
                {/* <Ionicons name="ios-timer" size={20} color="green" /> */}
                <Text style={styles.buttonText}>Entrada</Text>
              </TouchableOpacity>
              <Text style={styles.timeText}>
                {moment(entranceTime).format("HH:mm a")}
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
            <View style={styles.buttomTimeContainer}>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => displayTimePicker2()}
              >
                <Text style={styles.buttonText}>Salida</Text>
                {/* <Ionicons name="ios-timer" size={20} color="#ccc" /> */}
              </TouchableOpacity>
              <Text style={styles.timeText}>
                {moment(departureTime).format("HH:MM a")}
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
          </View>
          
          <MainButton
            title="Registrar Zona"
            onPress={() => {
              createZone();
            }}
          />
          <StatusModal status={visible} onClose={() => setVisible(false)} />
        </FormContainer>
      </View>
    </>
  );
};

const mapStateToProps = (state) => ({
  companyRedux: state.profile.company,
});

const mapDispatchToProps = (dispatch) => ({
  addZones(zones) {
    dispatch({
      type: "addZones",
      payload: zones,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateZoneScreen);

const styles = StyleSheet.create({
  buttomTimeContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  pickerButton: {
    borderRadius: 5,
    //borderWidth: 0.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    //elevation: 50,
    backgroundColor: ThirdColor,
    padding: 12,
    minWidth: 100,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  timeText: {
    marginVertical: 2.5,
    fontSize: 15,
    fontWeight: "normal",
    alignSelf: "center",
    letterSpacing: 0.5,
  },
});
