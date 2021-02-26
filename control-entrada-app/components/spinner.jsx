import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { MainColor, ThirdColor } from "../assets/colors";
export const Spinner = ({message}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={MainColor} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: '#09f'
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "700",
    color: ThirdColor,
  },
});
