import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "./avatar.component";
import { Ionicons } from "@expo/vector-icons";

export const ZoneDetailCard = ({ data }) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <Avatar.Picture size={60} uri="../../assets/images/map.jpg" />
      <View>
        <Text style={styles.contentText}>{data.zone}</Text>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="ios-timer" size={24} color="green" />
            <Text style={styles.contentText}>{data.firsEntryTime}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Ionicons name="ios-timer" size={24} color="red" />
            <Text style={styles.contentText}>{data.firsDepartureTime}</Text>
          </View>
        </View>
        <Text style={styles.labelText}>Entradas</Text>
        <Text style={styles.contentText}>25</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
  },
  labelText: {
    fontSize: 14,
    color: "#8e8e8e",
  },
});
