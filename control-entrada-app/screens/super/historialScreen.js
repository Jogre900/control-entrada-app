import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableHighlight,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

//components
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";

import firebase from "../../lib/firebase";
import FireMethods from "../../lib/methods.firebase";

export const HistorialScreen = (props) => {
  const [object, setObject] = React.useState();
  var datos = [];
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

  useEffect(() => {
    FireMethods.getEntrance((object) => {
      setObject(object);
      //console.log("useEffect:   ", object);
      console.log("nombre:", object.nombre);
      console.log("apellido:", object.apellido);
      console.log("cedula:", object.cedula);
      console.log("destino:", object.destino);
    });
  }, []);

  return (
    <View>
      <TopNavigation title="Historial" leftControl={goBackAction()} />
      <View style={styles.historialContainer}>
        <View style={styles.inputBox}>
          <Input
            style={styles.input}
            alignText="center"
            shape="round"
            title="Desde"
          />
          <Input
            style={styles.input}
            alignText="center"
            shape="round"
            title="Hasta"
          />
          <Input
            style={styles.input}
            alignText="center"
            shape="round"
            title="DNI"
          />
        </View>
        <View style={{ backgroundColor: "red" }}>
        </View>
        <View style={styles.buttonBox}>
          <MainButton style={{ width: "75%" }} title="Buscar" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  historialContainer: {},
  inputBox: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    width: 100,
  },
  buttonBox: {
    justifyContent: "center",
    alignItems: "center",
  },
});
