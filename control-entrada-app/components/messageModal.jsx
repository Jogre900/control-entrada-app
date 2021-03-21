import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { MainButton } from "./mainButton.component";
import { MainColor, ThirdColor } from '../assets/colors'

export const MessageModal = ({ visible, status, onClose, navigation , route, message }) => {
  console.log(route);

  return (
    <Modal
      isVisible={visible}
      //backdropColor={Success}
      //hasBackdrop={false}
      useNativeDriver={true}
      animationIn="fadeInUp"
      animationInTiming={500}
      onBackdropPress={onClose}
      animationOut="fadeOutDown"
      animationOutTiming={500}
      style={{
        //justifyContent: "flex-end",
        //marginHorizontal: 0,
      }}
      children={
        <View style={styles.container}>
          <Ionicons name="ios-warning" size={120} color={ThirdColor} />
          <Text style={styles.loadingText}>{message}</Text>
          <View style={styles.buttonContainer}>
            <MainButton title="Cerrar" onPress={() => { onClose(), navigation.navigate(route)}} />
          </View>
        </View>
      }
    ></Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#fff",

    marginVertical: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: ThirdColor,
    textAlign: "center",
    marginVertical: 5,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8e8e8e",
    textAlign: "center",
  },
  buttonContainer: {
    width: "50%",
    marginTop: 20,
  },
});
