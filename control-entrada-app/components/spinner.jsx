import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { MainColor, ThirdColor } from "../assets/colors";
export const Spinner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.loadingText}>Cargando...</Text>
      <ActivityIndicator size="large" color={MainColor} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "700",
    color: ThirdColor,
  },
});
