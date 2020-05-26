import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Image,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Input } from "../../components/input.component";

const busquedaData = {
  nombre: "Jose Del Corral",
  dni: "19222907",
  destino: "Apt 104",
};

export const SalidaScreen = (props) => {
  const goBackAction = () => {
    return (
      <RectButton
        onPress={() => {
          props.navigation.goBack();
        }}
      >
        <Ionicons name="ios-arrow-back" size={32} color="grey" />
      </RectButton>
    );
  };

  const [buscar, setBuscar] = useState();
  const [horaSalida, setHoraSalida] = useState();
  const [encontrado, setEncontrado] = useState();
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [destino, setDestino] = useState("");

  const getHour = () => {
    const date = new Date().getDate();
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    let Hour = "";
    if (hour <= 12) {
      Hour = `${hour}:${minute} am`;
    } else {
      Hour = `${hour}:${minute} pm`;
    }
    setHoraSalida(Hour);
  };

  return (
    <View style={styles.container}>
      <TopNavigation title="Registrar Salida" leftControl={goBackAction()} />
      <View style={styles.searchBox}>
        <View style={{ width: "70%" }}>
          <Input
            title="Buscar por DNI"
            shape="round"
            alignText="center"
            
            onChangeText={(valor) => setBuscar(valor)}
            value={buscar}
          />
        </View>
        <RectButton
          title="Buscar"
          onPress={() => {
            buscar === "19222907" ? setEncontrado(true) : setEncontrado(false);
          }}
        >
          <Ionicons name="ios-search" size={28} color="grey" />
        </RectButton>
      </View>
      {encontrado ? (
        <View style={styles.detailCardContainer}>
          <View style={styles.detailCard}>
            <View style={styles.cardContainer1}>
              <View>
                <Text style={styles.cardText}>Nombre:</Text>
                <Text style={styles.dataText}>Jose</Text>
              </View>
              <View>
                <Text style={styles.cardText}>DNI:</Text>
                <Text style={styles.dataText}>19222907</Text>
              </View>
              <View>
                <Text style={styles.cardText}>Destino:</Text>
                <Text style={styles.dataText}>Apt 104</Text>
              </View>
            </View>
            <View style={styles.cardContainer2}>
              <View>
                <Image
                  style={{ width: 160, height: 160 }}
                  source={require("../../assets/images/female.jpg")}
                />
              </View>
              <View>
                <Text style={styles.cardText}>Hora de Entrada:</Text>
                <Text style={styles.dataText}>8:30 am</Text>
                <Text style={styles.cardText}>Hora de Salida:</Text>
                <Text style={styles.dataText}>{horaSalida}</Text>
              </View>
            </View>
          </View>
          <MainButton
            title="Marcar salida"
            onPress={() => {
              getHour();
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5
  },
  detailCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    //minWidth: DEVICE_WIDTH,
    backgroundColor: "#cccc",
    marginBottom: 10,
    marginBottom: 20,
    borderRadius: 5,
    padding: 5,
  },
  cardContainer1: {
    maxWidth: "60%",
    justifyContent: "space-around",
    //backgroundColor: "#cccc",
  },
  cardContainer2: {
    justifyContent: "space-around",
    alignItems: "flex-start",
    //backgroundColor: "#cccc",
  },
  cardTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 17,
  },
  cardText: {
    fontSize: 13,
  },
  dataText: {
    fontSize: 19,
  },
});
