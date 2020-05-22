import React from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
export const EntradaScreen = (props) => {
  const nav = {
    id: false,
    title: "Registrar Entrada",
    props: props,
  };
  const registrar = {
    props: props,
    title: "Registrar",
    route: "",
    navigate: false,
  };
  const inputProps = {
    placeholderTextColor: "black",
    style: {
      borderBottomWidth: 1,
      borderColor: "grey",
      height: 40,
    },
  };
  
  return (
    <View style={styles.container}>
      <TopNavigation {...nav} />
      <View style={styles.detailCardContainer}>
        <View style={styles.detailCard}>
          <View style={styles.cardContainer1}>
            <View>
              <TextInput placeholder="Cedula" {...inputProps} />
            </View>
            <View>
              <TextInput placeholder="Nombre" textContentType="password" {...inputProps} />
            </View>
            <View>
              <TextInput placeholder="Apellido" {...inputProps} />
            </View>
            <View>
              <TextInput placeholder="Destino" {...inputProps} />
            </View>
          </View>
          <View style={styles.cardContainer2}>
            <Ionicons name="md-camera" size={64} color="grey" />
          </View>
        </View>
      </View>
      {/* <View>
                <TextInput placeholder='cedula'/>
                <TextInput placeholder='nombre'/>
                <TextInput placeholder='apellido'/>
                <TextInput placeholder='destino'/>
                <View>
                    <Text>
                        Foto
                    </Text>
                </View>
                
            </View> */}
            <MainButton {...registrar}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailCardContainer: {
    marginBottom: 20,
    backgroundColor: "#cccccc",
    borderRadius: 5,
    padding: 5,
  },
  detailCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    //minWidth: DEVICE_WIDTH,
  },
  cardContainer1: {
    maxWidth: "60%",
    width: "100%",
    justifyContent: "space-around",
    backgroundColor: "#cccc",
  },
  cardContainer2: {
    maxWidth: "40%",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#cccc",
  },
  cardTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 17,
  },
  cardText: {
    fontSize: 14,
  },
  dataText: {
    fontSize: 20,
  },
});
