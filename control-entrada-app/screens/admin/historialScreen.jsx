import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

//components
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";

export const HistorialScreen = (props) => {
  const [object, setObject] = useState({});

  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <TopNavigation title="Historial" leftControl={goBackAction()} />
      <View style={styles.historialContainer}>
        <View style={styles.inputBox}>
          <Input style={styles.input} alignText="center" shape="round" title="Desde" />
          <Input style={styles.input} alignText="center" shape="round" title="Hasta" />
          <Input style={styles.input} alignText="center" shape="round" title="DNI" />
        </View>
        <View style={{ backgroundColor: "red" }}>
          {Object.keys(object).map((item) => {
            return (
              <View key={item}>
                <Text>{object[item].apellido}</Text>
                <Text>{object[item].cedula}</Text>
                <Text>ALGO</Text>
                <Text>ALGO</Text>
              </View>
            );
          })}
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
