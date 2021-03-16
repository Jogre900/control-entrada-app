import React, {useState} from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FormContainer } from "../formContainer";
import { MainColor, Success } from "../../assets/colors";
import Avatar from "../avatar.component";
import Input from "../input.component";
import { CameraModal } from '../cameraModal'
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-community/picker";

const inputProps = {
    shape: "flat",
    textColor: "grey",
  };

  export const EmployeeForm = ({handleChange, value, caption, destinys}) => {
    const [camera, setCamera] = useState(false)
    
  const profilePic = (uri, fileName, fileType) => {
        // setProfilePicData((values) => ({ ...values, uri, fileName, fileType }));
        handleChange('uri', uri)
        handleChange('fileName', fileName)
        handleChange('fileType', fileType )
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
    return (
          <>
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
          <CameraModal
        status={camera}
        onClose={() => setCamera(false)}
        profile={profilePic}
        type={"profile"}
      />
          </>
      )
  }

  const styles = StyleSheet.create({
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
    caption: {
      fontSize: 16,
      fontWeight: "500",
      color: "red",
      letterSpacing: 0.5,
      marginLeft: 5,
    },
  });
  