import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export const MainButton = (props) => {
  const { title, onPress,textStyle, style } = props
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: "#ff7e00",
    borderColor: "#ff7e00",
    borderWidth: 1,
    marginBottom: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    color: 'white'
  }
});
