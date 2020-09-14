import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Button,
} from "react-native";

import axios from "axios";
import { API_PORT } from "../../config/index.js";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export const CreateEmployeScreen = (props) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState(new Date());
  const [changeTurn, setChangeTurn] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [create, setCreate] = useState(false);
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
    setShow(Platform.OS === "ios");
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
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const createEmploye = async () => {
    setCreate(false);
    let data = {
      name,
      lastName: lastName,
      dni,
      email,
      picture,
      status,
      assignationDate: date,
      changeTurnDate: changeTurn,
    };
    try {
      let res = await axios.post(`${API_PORT()}/api/createEmployee`, data);
      if (res.data.error === false) {
        console.log("asigna: ",date)
        console.log("turno: ",changeTurn)
        console.log(res.data);
        setCreate(true);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };
  return (
    <View>
      <TopNavigation title="Crear Empleado" leftControl={goBackAction()} />
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
        <Input
          style={{ borderColor: "black", marginBottom: 10 }}
          styleInput={{ color: "black" }}
          title="Foto"
          textColor="black"
          shape="square"
          alignText="center"
          returnKeyType="next"
          onChangeText={(foto) => {
            setPicture(foto);
          }}
          value={picture}
        />
        <Input
          style={{ borderColor: "black", marginBottom: 10 }}
          styleInput={{ color: "black" }}
          title="Status"
          textColor="black"
          shape="square"
          alignText="center"
          returnKeyType="next"
          onChangeText={(status) => {
            setStatus(status);
          }}
          value={status}
        />
        <Input
          style={{ borderColor: "black", marginBottom: 10 }}
          styleInput={{ color: "black" }}
          title="Status"
          textColor="black"
          shape="square"
          alignText="center"
          returnKeyType="next"
          onChangeText={(status) => {
            setStatus(status);
          }}
          value={status}
        />
        <Input
          style={{ borderColor: "black", marginBottom: 10 }}
          styleInput={{ color: "black" }}
          title="Status"
          textColor="black"
          shape="square"
          alignText="center"
          returnKeyType="next"
          onChangeText={(status) => {
            setStatus(status);
          }}
          value={status}
        />
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
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
              <DateTimePicker
                testID="dateTimePicker"
                value={changeTurn}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={onChange2}
              />
            </View>
          )}
          
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
    </View>
  );
};

const styles = StyleSheet.create();
