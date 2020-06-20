import React, { useState, useEffect} from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, TouchableHighlight } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
//components
import { TopNavigation } from "../../components/TopNavigation.component";
import FireMethods from '../../lib/methods.firebase'


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
  const [object, setObject] = useState({})
  const drawerAction = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            props.navigation.toggleDrawer();
          }}
        >
          <Ionicons name="md-menu" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
  };
  const openNotifications = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            props.navigation.navigate('notification');
          }}
        >
          <Ionicons name="md-notifications" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
  };

  const getEntrada = async () => {
    let data = new Object();
    await FireMethods.getEntrance((object) => {
      data = object;
    });
    setObject(data);
    console.log("object:  ",object)
  };

  useEffect(() => {
    getEntrada();
  }, []);
  
  return (
    <View>
      <TopNavigation
        title="Entradas del Dia"
        leftControl={drawerAction()}
        rightControl={openNotifications()}
      />
        <View style={styles.listEntry}>
      {Object.keys(object).map((element) => {
        return (

          <TouchableOpacity style={styles.entryBox}
          key={element}  
          onPress={() => props.navigation.navigate("detail-view", object[element])}
          >
            <Text>{object[element].cedula}</Text>
            <Text>{object[element].nombre}</Text>
            <Text>{object[element].apellido}</Text>
            <Text>{object[element].hora_entrada}</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: .5,
    borderColor: 'grey',
    marginVertical: 5,
    borderRadius: 20
  }
})
