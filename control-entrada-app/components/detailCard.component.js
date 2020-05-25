import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DEVICE_WIDTH = Dimensions.get("window").width;
const watchData = [
  {
    cedula: "19222907",
    nombre: "jose del corral",
    idCode: "987654",
    picture: require("../assets/images/male.jpg"),
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
                <View>
                  <Image
                    style={{ width: 160, height: 160 }}
                    source={watch.picture}
                  />
                </View>
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
      <View style={styles.detailCardContainer}>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>Visitante</Text>
        </View>
        <View style={styles.detailCard}>
          <View style={styles.cardContainer1}>
            <View>
              <Text style={styles.cardText}>Nombre:</Text>
              <Text style={styles.dataText}>{info.nombre}</Text>
            </View>
            <View>
              <Text style={styles.cardText}>DNI:</Text>
              <Text style={styles.dataText}>{info.cedula}</Text>
            </View>
            <View>
              <Text style={styles.cardText}>Destino:</Text>
              <Text style={styles.dataText}>{info.destino}</Text>
            </View>
          </View>
          <View style={styles.cardContainer2}>
            <View>
              <Image
                style={{ width: 160, height: 160 }}
                source={info.picture}
              />
            </View>
            <View style={styles.timeBox}>
              <Text style={styles.cardText}>Hora de Entrada:</Text>
              <Text style={styles.dataText}>{info.entrada} am</Text>
              <Text style={styles.cardText}>Hora de Salida:</Text>
              <Text style={styles.dataText}>{info.salida} pm</Text>
            </View>
          </View>
        </View>
      </View>

      <WatchCard />
    </View>
  );
};

const styles = StyleSheet.create({
  detailCardContainer: {
    marginBottom: 20,
    backgroundColor: "#cccccc",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  detailCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    //minWidth: DEVICE_WIDTH,
  },
  cardContainer1: {
    maxWidth: "60%",

    justifyContent: "space-around",
  },
  cardContainer2: {},
  cardTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 0.5,
  },
  timeBox: {},
  cardTitle: {
    fontSize: 20,
    lineHeight: 35,
  },
  cardText: {
    fontSize: 13,
  },
  dataText: {
    fontSize: 19,
  },
});
