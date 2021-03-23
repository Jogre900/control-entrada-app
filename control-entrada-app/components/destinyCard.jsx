import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const iconProps = {
  name: "ios-timer",
  size: 20,
  color: "green",
  style: { marginRight: 5 },
};

export const DestinyCard = ({ data, selected }) => {
  const { name, visits } = data;
  return (
    <View
      style={[
        styles.visitContainer,
        { backgroundColor: selected ? "#ddd" : "#fff" },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Ionicons name="ios-pin" size={28} color="grey" style={{marginRight: 10}}/>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "normal",
            lineHeight: 28,
          }}
        >
          {name}
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.contentText}>{visits ? visits : "0"}</Text>
        <Text style={styles.labelText}>Entradas</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  visitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: "grey",
    marginVertical: 4,
    //borderRadius: 5,
  },
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
