import React from "react";
import { View, Text, ActivityIndicator, Image, StyleSheet } from "react-native";
import { MainColor, ThirdColor } from "../assets/colors";
import { MainButton } from "./mainButton.component";
export const NotFound = ({ message, navigation, route }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/images/security-logo.png")}
      />
      <Text style={styles.title}>Oops tenemos un problema.</Text>
      <Text style={styles.loadingText}>{message}</Text>
      <View style={styles.buttonContainer}>
        <MainButton title="Volver" onPress={() => navigation.navigate(route)}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    opacity: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: ThirdColor,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8e8e8e",
    textAlign: "justify",
  },
  buttonContainer: {
    width: "50%",
    marginTop: 10,
  },
});
