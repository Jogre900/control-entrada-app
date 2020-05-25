import React from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
//components
import { TopNavigation } from "../../components/TopNavigation.component";


const data = [
  {
    cedula: "19222907",
    nombre: "Ana de Armas",
    destino: "apt 104",
    entrada: "15:30",
    salida: "19:00",
    picture: require('../../assets/images/female.jpg')
  },
  {
    cedula: "19222907",
    nombre: "Amy RedHead",
    destino: "apt 104",
    entrada: "15:30",
    salida: "19:00",
    picture: require('../../assets/images/female-2.jpg')
  },
  {
    cedula: "19222907",
    nombre: "Ryan Reynolds",
    destino: "apt 104",
    entrada: "15:30",
    salida: "19:00",
    picture: require('../../assets/images/male-2.jpg')
  },
];

export const HomeSuperScreen = (props) => {
  const drawerAction = () => {
    return (
      <RectButton
        onPress={() => {
          props.navigation.toggleDrawer();
        }}
      >
        <Ionicons name="md-menu" size={32} color="grey" />
      </RectButton>
    );
  };
  const openNotifications = () => {
    return (
      <RectButton
        onPress={() => {
          props.navigation.navigate("notification");
        }}
      >
        <Ionicons name="md-notifications" size={32} color="grey" />
      </RectButton>
    );
  };
  console.log("data-array", data[1]);
  return (
    <View>
      <TopNavigation
        title="Entradas del Dia"
        leftControl={drawerAction()}
        rightControl={openNotifications()}
      />
        <View style={styles.listEntry}>
      {data.map((element, index) => {
        return (

          <TouchableOpacity style={styles.entryBox}
          key={index}  
          onPress={() => props.navigation.navigate("detail-view", element)}
          >
            <Text>{element.cedula}</Text>
            <Text>{element.nombre}</Text>
            <Text>{element.entrada}</Text>
            <Text>{element.salida}</Text>
          </TouchableOpacity>
        );
      })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  listEntry: {
    paddingHorizontal: 5
  },
  entryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
    paddingVertical: 5,
    borderBottomWidth: .5,
    borderColor: 'grey',
    marginVertical: 5
  }
})
