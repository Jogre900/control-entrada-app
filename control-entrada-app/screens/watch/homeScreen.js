import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";

export const HomeScreen = (props) => {
  const goBackAction = () => {
    return (
      <RectButton
        onPress={() => {
          props.navigation.goBack();
        }}
      >
        <Ionicons name="ios-arrow-back" size={28} color="white" />
      </RectButton>
    );
  };

  return (
    <View style={styles.container}>
      <TopNavigation title="Control de visitas" leftControl={goBackAction()} />
      <View style={styles.contentContainer}>
        <View style={styles.actionContainer}>
          <MainButton
            title="Entrada"
            onPress={() => {
              props.navigation.navigate("entrada");
            }}
          />
          <MainButton
            title="Salida"
            onPress={() => {
              props.navigation.navigate("salida");
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center", 
    alignItems: "center" 
  },
  actionContainer: {
    width: "75%",
  },
});
