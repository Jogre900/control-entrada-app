import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export const MainButton = (props) => {
  const { title, onPress } = props
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
    >
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: "#cccc",
    borderColor: "#cccc",
    borderWidth: 1,
    marginBottom: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
