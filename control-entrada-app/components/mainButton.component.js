import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export const MainButton = (params) => {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {(params.navigate)?
        params.props.navigation.navigate(params.route):Alert.alert('Algo paso!');
      }}
    >
      <Text>{params.title}</Text>
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
