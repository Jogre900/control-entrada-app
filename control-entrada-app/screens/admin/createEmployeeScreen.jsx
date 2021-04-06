import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, BackHandler, TouchableOpacity } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { MainColor, ThirdColor, Danger } from "../../assets/colors.js";
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
import { routes } from "../../assets/routes";
import { BackAction } from "../../helpers/ui/ui";
import { connect } from "react-redux";

let alertModalValues = {
  visible: false,
  message: null,
  route: routes.ADMIN_HOME,
};
let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};

const CreateEmployeScreen = ({ navigation, zonesRedux, companyRedux, addEmployee }) => {
  let employeeValues = {
    name: "",
    lastName: "",
    email: "",
    dni: "",
    password: "",
    assignationDate: new Date(),
    changeTurnDate: new Date(),
    uri: null,
    fileName: null,
    fileType: null,
    //zoneId: zonesRedux.length ? zonesRedux[0].id : null,
    companyId: companyRedux[0].id,
  };
  const zones = zonesRedux;
  console.log("zones from redux--", zonesRedux);
  const [alertModal, setAlertModal] = useState(alertModalValues);
  const [statusModalProps, setStatusModalProps] = useState(statusModalValues);
  const [employeeData, setEmployeeData] = useState(employeeValues);
  const [privilege, setPrivilege] = useState("Supervisor");
  const [zoneId, setZoneId] = useState(zonesRedux.length && zones[0].id);

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
    console.log("zoneId on CREATE SCREEN--", zones[0].id);

    employeeData.privilege = privilege;
    employeeData.zoneId = zoneId;
    console.log(employeeData);
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

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (zonesRedux) {
  //       if (zonesRedux.length <= 0) {
  //         setAlertModal((values) => ({
  //           ...values,
  //           visible: true,
  //           message:
  //             "Parece que aun no tienes zonas creadas, para registrar personal crea al menos una.",
  //           route: routes.EMPLOYEE,
  //         }));
  //       }
  //     }
  //   }, [])
  // );

  useFocusEffect(
    React.useCallback(() => {
      if (zonesRedux && zonesRedux.length == 0) {
        setAlertModal((values) => ({
          ...values,
          visible: true,
          message: "Parece que aun no tienes zonas creadas, para registrar personal crea al menos una.",
          route: routes.EMPLOYEE,
        }));
      }
    }, [zonesRedux])
  );

  const goBackHardware = () => {
    //TODO aqui y abajo debes poner segun rol
    navigation.navigate(routes.ADMIN_HOME);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", goBackHardware);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", goBackHardware);
      };
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Crear Empleado" leftControl={BackAction(navigation, routes.EMPLOYEE)} />
      <ScrollView contentContainerStyle={styles.container}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <FormContainer title="Datos Personales">
            <View style={styles.pictureContainer}>
              {employeeData.uri ? <Avatar.Picture size={120} uri={employeeData.uri} /> : <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />}
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
              shape="flat"
              onChangeText={(name) => {
                setEmployeeData((values) => ({ ...values, name })), setCaption("");
              }}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              icon="ios-people"
              title="Apellido"
              shape="flat"
              returnKeyType="next"
              onChangeText={(lastName) => {
                setEmployeeData((values) => ({ ...values, lastName })), setCaption("");
              }}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              title="DNI"
              icon="ios-card"
              shape="flat"
              returnKeyType="next"
              onChangeText={(dni) => {
                setEmployeeData((values) => ({ ...values, dni })), setCaption("");
              }}
            />
            <Input
              style={{ borderColor: "black", marginBottom: 10 }}
              styleInput={{ color: "black" }}
              title="Email"
              icon="ios-mail"
              shape="flat"
              returnKeyType="next"
              onChangeText={(email) => {
                setEmployeeData((values) => ({ ...values, email })), setCaption("");
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
            <Picker mode="dropdown" selectedValue={privilege} onValueChange={(value) => setPrivilege(value)}>
              <Picker.Item label={"Supervisor"} value={"Supervisor"} />
              <Picker.Item label={"Vigilante"} value={"Watchman"} />
            </Picker>
            <View>
              <Text>Zonas</Text>
              <Picker mode="dropdown" selectedValue={zoneId} onValueChange={(value) => setZoneId(value)}>
                {zonesRedux.length ? zonesRedux.map((item) => <Picker.Item label={item.zone} value={item.id} key={item.id} />) : null}
              </Picker>
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
                <MainButton style={styles.pickerButton} title="Hora Entrada" onPress={() => showDatepicker()} />
                <Text style={{ alignSelf: "center" }}>{entryHolder ? moment(employeeData.assignationDate).format("D MMM YYYY") : "----"}</Text>
              </View>
              <View style={styles.pickerButtonContainer}>
                <MainButton style={styles.pickerButton} title="Hora Salida" onPress={() => showDatepicker2()} />
                <Text style={{ alignSelf: "center" }}>{departureHolder ? moment(employeeData.changeTurnDate).format("D MMM YYYY") : "----"}</Text>
              </View>
            </View>
            {show && (
              <View>
                <DateTimePicker testID="dateTimePicker1" value={employeeData.assignationDate} mode="time" is24Hour={true} display="default" onChange={onChange} />
              </View>
            )}

            {show2 && <DateTimePicker value={employeeData.changeTurnDate} mode="time" is24Hour={true} display="default" onChange={onChange2} />}
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
      <CameraModal status={camera} onClose={() => setCamera(false)} profile={profilePic} type={"profile"} />

      <LoadingModal visible={visible} message="Guardando..." />
      <StatusModal {...statusModalProps} onClose={() => setStatusModalProps((values) => ({ ...values, visible: false }))} />
      <MessageModal
        {...alertModal}
        onClose={() => {
          setAlertModal((values) => ({ ...values, visible: false }));
          navigation.navigate(routes.EMPLOYEE);
        }}
        onPress={() => {
          setAlertModal((values) => ({ ...values, visible: false }));
          navigation.navigate(routes.ZONES);
        }}
        titleButton="Ir a Zonas"
        navigation={navigation}
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
export default connect(mapStateToProps, mapDispatchToProps)(CreateEmployeScreen);
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
