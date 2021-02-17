import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../components/avatar.component";
import { MainColor, ThirdColor } from "../assets/colors";
import { API_PORT } from "../config/index";

const iconProps = {
  size: 22,
  color: "grey",
  style: {
    marginRight: 10,
  },
};

export const VisitCard = ({ data }) => {
  //console.log("Props-----",props)
  const { Fotos, Visitante, Destino } = data;
  return (
    <View style={styles.visitContainer}>
      <View style={styles.dataContainer}>
        <View style={styles.dataContainerView}>
          <Avatar.Picture
            size={50}
            uri={`${API_PORT()}/public/imgs/${Fotos[0].picture}`}
          />
        </View>
        <View style={styles.nameContainer}>
          <Text style={{ color: "black" }}>Nombre</Text>
          <Text style={styles.dataText} numberOfLines={1}>
            {Visitante.name} {Visitante.lastName}
          </Text>
        </View>
      </View>
      <View style={styles.locationContainer}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="md-globe"
            size={iconProps.size}
            color={iconProps.color}
          />
          <Ionicons
            name="ios-pin"
            size={iconProps.size}
            color={iconProps.color}
          />
        </View>
        <View style={{}}>
          <Text style={styles.dataText} numberOfLines={1}>{Destino.Zona.zone}</Text>
          <Text style={styles.dataText} numberOfLines={1}>{Destino.name}</Text>
        </View>
      </View>

      {/* <View style={styles.dataContainerView}>
                  <Text>Entrada</Text>
                  <Text style={styles.dataText}>
                    {moment(elem.ntryDate).format("HH:mm a")}
                  </Text>
                </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  listEntry: {
    paddingHorizontal: 5,
    //backgroundColor: 'blue',
    flex: 1,
  },
  visitContainer: {
    flexDirection: "row",
    //justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    //borderBottomWidth: 0.5,
    borderColor: "grey",
    marginVertical: 2.5,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  dataContainer: {
    flexDirection: "row",
    //backgroundColor: "red",
    alignItems: "center",
    flex: 1,
  },
  nameContainer: {
    marginLeft: 8,
    justifyContent: "flex-start",
  },
  locationContainer: {
    //backgroundColor: 'green',
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    //marginRight: 5,
    marginLeft: 10
  },
  dataContainerView: {
    justifyContent: "center",
    alignItems: "center",
    //width: "33%",
    //maxWidth: "33%",
  },
  iconContainer: {
    alignItems: "center",
    marginRight: 5,
  },
  dataText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
