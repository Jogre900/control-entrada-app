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
import { MainColor, ThirdColor, Danger } from "../assets/colors";
import Modal from "react-native-modal";
import { createInfo } from "../helpers";
const timeState = {
  entry: false,
  exit: false,
};

const CreateZoneModal = ({
  status,
  onClose,
  create,
  addZones,
  companyRedux,
}) => {
  const [displayTime, setDisplayTime] = useState(timeState);
  const [caption, setCaption] = useState("");
  const [timeCaption, setTimeCaption] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [entranceTime, setEntranceTime] = useState(new Date());
  const [entry, setEntry] = useState(false);
  const [departureTime, setDepartureTime] = useState(new Date());
  const [exit, setExit] = useState(false);
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
    setTimeCaption(""), setEntry(true);
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
    setTimeCaption(""), setExit(true);
  };
  const createZone = async () => {
    setLoading(true);
    if (zoneName.length === 0) {
      setCaption("Debe ingresar un nombre.");
      setLoading(false);
      return;
    }
    if (zoneName.length < 4 || zoneName.length > 15) {
      setCaption("Ingrese un nombre entre 4 y 15 caracteres.");
      setLoading(false);
      return;
    }
    if (!entry || !exit) {
      setTimeCaption("Debe seleccionar ambas horas.");
      setLoading(false);
      return;
    }
    if (
      moment(entranceTime).format("HH: mm a") >
      moment(departureTime).format("HH: mm a")
    ) {
      setTimeCaption("La hora de entrada no puede ser menor que la de salida");
      setLoading(false);
      return;
    }

    if (entranceTime === departureTime) {
      setTimeCaption("La hora de entrada y salida deben ser distintas");
      setLoading(false);
      return;
    }

    const res = await createInfo(
      "createZone",
      companyRedux[0].id,
      (data = {
        zone: zoneName,
        firsEntryTime: moment(entranceTime).format("HH:mm").toString(),
        firsDepartureTime: moment(departureTime).format("HH:mm").toString(),
      })
    );
    if (!res.error) {
      addZones(res.data);
      setCaption(""),
        setTimeCaption(""),
        setZoneName(""),
        setEntry(false),
        setExit(false),
        setLoading(false);
      create(true, res.msg);
      onClose();
    } else {
      setLoading(false);
      create(false, res.msg);
      onClose();
    }
  };
  return (
    <Modal
      isVisible={status}
      onBackdropPress={() => {
        setCaption(""),
          setTimeCaption(""),
          setZoneName(""),
          setEntry(false),
          setExit(false),
          onClose();
      }}
      useNativeDriver={true}
      animationIn="fadeInUp"
      animationInTiming={300}
      animationOut="fadeOutDown"
      animationOutTiming={300}
      style={{
        //backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormContainer
        style={{ padding: 20, elevation: 0 }}
        title="Ingrese los datos de la zona"
      >
        <Input
          title="Nombre"
          icon="md-globe"
          shape="flat"
          returnKeyType="next"
          onChangeText={(nombre) => {
            setZoneName(nombre);
            setCaption("");
          }}
          value={zoneName}
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
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.pickerButtonContainer}>
            <MainButton
              style={styles.pickerButton}
              title="Entrada"
              onPress={() => displayTimePicker()}
            />
            {/* <Ionicons name="ios-timer" size={20} color="green" /> */}
            {/* <Text style={styles.buttonText}>Entrada</Text> */}
            {/* </TouchableOpacity> */}
            <Text style={styles.timeText}>
              {entry ? moment(entranceTime).format("HH:mm a") : "----"}
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
              title="Salida"
              style={styles.pickerButton}
              onPress={() => displayTimePicker2()}
            />
            {/* <Text style={styles.buttonText}>Salida</Text> */}
            {/* <Ionicons name="ios-timer" size={20} color="#ccc" /> */}

            <Text style={styles.timeText}>
              {exit ? moment(departureTime).format("HH:mm a") : "----"}
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
        <View style={{ marginVertical: 5 }}>
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
        <MainButton
          title="Registrar Zona"
          style={{ marginVertical: 5 }}
          onPress={() => {
            createZone();
          }}
        />
        <LoadingModal status={loading} message="Guardando..." />
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
