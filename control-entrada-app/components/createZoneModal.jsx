import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { API_PORT } from "../config/index";
import { connect } from "react-redux";
import { MainButton } from "./mainButton.component";
import { FormContainer } from "./formContainer";
import { LoadingModal } from "./loadingModal";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Input from "./input.component.jsx";
import { StatusModal } from "./statusModal";
import { MainColor, ThirdColor } from "../assets/colors";
import Modal from "react-native-modal";
const timeState = {
  entry: false,
  exit: false,
};

const CreateZoneModal = ({ status, onClose, create, addZones, companyRedux }) => {
  const [displayTime, setDisplayTime] = useState(timeState);
  const [zoneName, setZoneName] = useState();
  const [entranceTime, setEntranceTime] = useState(new Date());
  const [entry, setEntry] = useState(false)
  const [departureTime, setDepartureTime] = useState(new Date());
  const [exit, setExit] = useState(false)
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setEntry(true);
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
    setExit(true);
  };
  const createZone = async () => {
    setLoading(true);
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
        setZoneName("");
        setLoading(false);
        create(true)
        onClose()
        
      }
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };
  return (
    <Modal
        isVisible={status}
        onBackdropPress={onClose}
        useNativeDriver={true}
        animationIn="fadeInUp"
      animationInTiming={300}
      animationOut='fadeOutDown'
      animationOutTiming={300}
        style={{
            //backgroundColor: '#fff',
            justifyContent: "center",
            alignItems: "center",
          }}
    >
      <FormContainer style={{ padding: 20 }} title="Ingrese los datos de la zona">
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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.pickerButtonContainer}>
            <MainButton
              style={styles.pickerButton}
              title='Entrada'
              onPress={() => displayTimePicker()}
            />
              {/* <Ionicons name="ios-timer" size={20} color="green" /> */}
              {/* <Text style={styles.buttonText}>Entrada</Text> */}
            {/* </TouchableOpacity> */}
            <Text style={styles.timeText}>
              {entry ? moment(entranceTime).format("HH:mm a") : '----'}
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
          <View style={styles.pickerButtonContainer}>
            <MainButton
              title='Salida'
              style={styles.pickerButton}
              onPress={() => displayTimePicker2()}
            />
              {/* <Text style={styles.buttonText}>Salida</Text> */}
              {/* <Ionicons name="ios-timer" size={20} color="#ccc" /> */}
            
            <Text style={styles.timeText}>
              {exit ? moment(departureTime).format("HH:MM a") : '----'}
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
          style={{marginVertical: 5}}
          onPress={() => {
            createZone();
          }}
        />
        <LoadingModal status={loading} message='Guardando...'/>
      </FormContainer>
    </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateZoneModal);

const styles = StyleSheet.create({
  pickerButtonContainer: {
    width: "45%",
    justifyContent: "center",
  },
  pickerButton: {
    backgroundColor: ThirdColor,
    borderColor: ThirdColor,
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  timeText: {
    //marginVertical: 2.5,
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
    alignSelf: "center",
    letterSpacing: 0.5,
  },
});
