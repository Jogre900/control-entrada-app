import React from "react";
import { View, Text, StyleSheet, Alert, StatusBar } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

//constants
import { mainColor } from "../constants/Colors";

function NormalNav() {
  return (
    <View>
      <Ionicons name="ios-notifications" size={32} color={mainColor} />
    </View>
  );
}

export const TopNavigation = (props) => {
  const { title, leftControl, rightControl } = props;

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {leftControl}
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightControl ? rightControl : NormalNav()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: mainColor,
    paddingTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    color: "white",
  },
});
