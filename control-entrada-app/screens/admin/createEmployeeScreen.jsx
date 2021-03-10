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
import { MessageModal } from "../../components/messageModal";
import { createSupervisor, createWatchman } from "../../helpers";
import { connect } from "react-redux";

let alertModalValues = {
  visible: false,
  message: null,
  route: "admin-home",
};
let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};

const CreateEmployeScreen = ({
  navigation,
  zonesRedux,
  companyRedux,
  addEmployee,
}) => {
  let employeeValues = {
    name: "",
    lastName: "",
    email: "",
    dni: "",
    password: null,
    privilege: null,
    assignationDate: new Date(),
    changeTurnDate: new Date(),
    uri: null,
    fileName: null,
    fileType: null,
    zoneId: zonesRedux.length ? zonesRedux[0].id : null,
    companyId: companyRedux[0].id,
  };

  const [alertModal, setAlertModal] = useState(alertModalValues);
  const [statusModalProps, setStatusModalProps] = useState(statusModalValues);
  const [employeeData, setEmployeeData] = useState(employeeValues);
  const [privilege, setPrivilege] = useState("supervisor");

  const [caption, setCaption] = useState("");
  const [timeCaption, setTimeCaption] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [entryHolder, setEntryHolder] = useState(false);
  const [departureHolder, setDepartureHolder] = useState(false);
  const [mode, setMode] = useState("date");
  const [mode2, setMode2] = useState("date");
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [camera, setCamera] = useState(false);
  const [visible, setVisible] = useState(false);

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
    setEmployeeData((values) => ({ ...values, assignationDate: currentDate }));
    setTimeCaption("");
    setEntryHolder(true);
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || changeTurn;
    setShow2(Platform.OS === "ios");
    setEmployeeData((values) => ({ ...values, changeTurnDate: currentDate }));
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
  //GET PROFILE PHOTO FROM MODAL
  const profilePic = (uri, fileName, fileType, caption, changeImg) => {
    setEmployeeData((values) => ({ ...values, uri, fileName, fileType }));
    //imageCaption = caption,
  };

  //CREATE EMPLOYEE
  const createEmploye = async () => {
    console.log(employeeData);
    setVisible(true);
    // if (
    //   employeeData.name.length === 0 ||
    //   employeeData.lastName.length === 0 ||
    //   employeeData.dni.length === 0 ||
    //   employeeData.email.length === 0
    // ) {
    //   setCaption("Debe llenar todos los campos");
    //   setVisible(false);
    //   return;
    // }
    // if (employeeData.uri.length === 0) {
    //   setImageCaption("Debe agregar una foto");
    //   setVisible(false);
    //   return;
    // }
    // if (!entryHolder || !departureHolder) {
    //   setTimeCaption("Debe seleccionar ambas horas.");
    //   setVisible(false);
    //   return;
    // }
    // if (
    //   moment(employeeData.assignationDate).format("D MMM YYYY") >
    //   moment(employeeData.changeTurnDate).format("D MMM YYYY")
    // ) {
    //   setTimeCaption(
    //     "La fecha de inicio no puede ser mayor que la de culminacion"
    //   );
    //   setVisible(false);
    //   return;
    // }

    // if (
    //   moment(employeeData.assignationDate).format("D MMM YYYY") ===
    //   moment(employeeData.changeTurnDate).format("D MMM YYYY")
    // ) {
    //   setTimeCaption("La fecha de inicio y culminacion deben ser distintas");
    //   setVisible(false);
    //   return;
    // }
    setEmployeeData((values) => ({ ...values, privilege: privilege }));
    try {
      if (privilege === "Supervisor") {
        const res = await createSupervisor(employeeData);
        console.log("CREATE EMPLOYEE----", res.data);
        if (!res.data.error) {
          console.log(res.data.data);
          addEmployee(res.data.data);
          setVisible(false);
          setStatusModalProps((values) => ({
            ...values,
            visible: true,
            status: true,
            message: res.data.msg,
          }));
          //setCreate(true);
          //setSaving(false);
        } else {
          setVisible(false);
          setStatusModalProps((values) => ({
            ...values,
            visible: true,
            status: false,
            message: res.data.msg,
          }));
        }
      } else {
        const res = await createWatchman(employeeData);
        if (!res.data.error) {
          console.log(res.data.data);
          addEmployee(res.data.data);

          setVisible(false);
          setStatusModalProps((values) => ({
            ...values,
            visible: true,
            status: true,
            message: res.data.msg,
          }));

          setEntryHolder(false);
          setDepartureHolder(false);
          //setSaving(false);
        } else {
          setVisible(false);
          setStatusModalProps((values) => ({
            ...values,
            visible: true,
            status: false,
            message: res.data.msg,
          }));
        }
      }
    } catch (error) {
      setVisible(false);
      setStatusModalProps((values) => ({
        ...values,
        visible: true,
        status: false,
        message: error,
      }));
    }
  };

  useEffect(() => {
    !zonesRedux.length &&
      setAlertModal((values) => ({
        ...values,
        visible: true,
        message:
          "Parece que aun no tienes zonas creadas, para registrar personal crea al menos una.",
      }));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Crear Empleado" leftControl={goBackAction()} />
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <FormContainer title="Datos Personales">
            <View style={styles.pictureContainer}>
              {employeeData.uri ? (
                <Avatar.Picture size={120} uri={employeeData.uri} />
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
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              title="Nombre"
              icon="ios-person"
              returnKeyType="next"
              onChangeText={(name) => {
                setEmployeeData((values) => ({ ...values, name })),
                  setCaption("");
              }}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              icon="ios-people"
              title="Apellido"
              returnKeyType="next"
              onChangeText={(lastName) => {
                setEmployeeData((values) => ({ ...values, lastName })),
                  setCaption("");
              }}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              title="DNI"
              icon="ios-card"
              returnKeyType="next"
              onChangeText={(dni) => {
                setEmployeeData((values) => ({ ...values, dni })),
                  setCaption("");
              }}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              title="Email"
              icon="ios-mail"
              returnKeyType="next"
              onChangeText={(email) => {
                setEmployeeData((values) => ({ ...values, email })),
                  setCaption("");
              }}
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
              {zonesRedux.length ? (
                <Picker
                  mode="dropdown"
                  selectedValue={employeeData.zoneId}
                  onValueChange={(zoneId) =>
                    setEmployeeData((values) => ({ ...values, zoneId }))
                  }
                >
                  {zonesRedux.map((item) => (
                    <Picker.Item
                      label={item.zone}
                      value={item.id}
                      key={item.id}
                    />
                  ))}
                </Picker>
              ) : null}
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
                  {entryHolder
                    ? moment(employeeData.assignationDate).format("D MMM YYYY")
                    : "----"}
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
                    ? moment(employeeData.changeTurnDate).format("D MMM YYYY")
                    : "----"}
                </Text>
              </View>
            </View>
            {show && (
              <View>
                <DateTimePicker
                  testID="dateTimePicker1"
                  value={employeeData.assignationDate}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              </View>
            )}

            {show2 && (
              <DateTimePicker
                value={employeeData.changeTurnDate}
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
      <MessageModal
        {...alertModal}
        onClose={() =>
          setAlertModal((values) => ({ ...values, visible: false }))
        }
        navigation={navigation}
      />
      <LoadingModal status={visible} message="Guardando..." />
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
