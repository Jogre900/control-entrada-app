import React from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";

//components
import { TopNavigation } from "../../components/TopNavigation.component";

const data = [
  {
    cedula: "19222907",
    nombre: "jose",
    entrada: "15:30",
    salida: "19:00",
  },
];

export const HomeSuperScreen = (props) => {
  const params = {
    id: true,
    props: props,
    title: "Entradas del dia",
  };
  return (
    <View>
      <TopNavigation {...params} />
      {data.map((index) => {
        return (
          <TouchableOpacity
            onPress={() => props.navigation.navigate("detail-view", data)}
          >
            <Text>{index.cedula}</Text>
            <Text>{index.nombre}</Text>
            <Text>{index.entrada}</Text>
            <Text>{index.salida}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
