import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DEVICE_WIDTH = Dimensions.get("window").width;
const watchData = [
  {
    cedula: "19222907",
    nombre: "pepito",
    idCode: "987654",
  },
];

function WatchCard() {
  return (
    <View>
      {watchData.map((watch) => {
        return (
          <View style={styles.detailCardContainer}>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Portero</Text>
            </View>
            <View style={styles.detailCard}>
              <View style={styles.cardContainer1}>
                <View>
                  <Text style={styles.cardText}>Nombre:</Text>
                  <Text style={styles.dataText}>{watch.nombre}</Text>
                </View>
                <View>
                  <Text style={styles.cardText}>DNI:</Text>
                  <Text style={styles.dataText}>{watch.cedula}</Text>
                </View>
                <View>
                  <Text style={styles.cardText}>Identificacion:</Text>
                  <Text style={styles.dataText}>{watch.idCode}</Text>
                </View>
              </View>
              <View style={styles.cardContainer2}>
                <Ionicons name="md-camera" size={64} color="grey" />
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export const DetailCard = (data) => {
  console.log("DATA", data);
  console.log("DATA.DATA", data.data);
  const info = data.data;
  return (
    <View style={{ padding: 4 }}>
      {info.map((index) => {
        return (
          <View
            style={styles.detailCardContainer}
          >
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Visitante</Text>
            </View>
            <View style={styles.detailCard}>
              <View style={styles.cardContainer1}>
                <View>
                  <Text style={styles.cardText}>Nombre:</Text>
                  <Text style={styles.dataText}>{index.nombre}</Text>
                </View>
                <View>
                  <Text style={styles.cardText}>DNI:</Text>
                  <Text style={styles.dataText}>{index.cedula}</Text>
                </View>
                <View>
                  <Text style={styles.cardText}>Destino:</Text>
                  <Text style={styles.dataText}>{index.destino}</Text>
                </View>
              </View>
              <View style={styles.cardContainer2}>
                <Ionicons name="md-camera" size={64} color="white" />
                <View>
                  <Text style={styles.cardText}>
                    Hora de Entrada:{index.entrada}
                  </Text>
                  <Text style={styles.cardText}>
                    Hora de Salida: {index.salida}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      })}
      <WatchCard />
    </View>
  );
};

const styles = StyleSheet.create({
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
