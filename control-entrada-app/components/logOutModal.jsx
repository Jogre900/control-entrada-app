import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { FormContainer } from "./formContainer";
import Input from "./input.component";
import { MainButton } from "./mainButton.component";
import { API_PORT } from "../config/index";
import axios from "axios";
import Modal from "react-native-modal";

export const LogOutModal = ({ status, navigation, onClose }) => {
  return (
    <Modal
      isVisible={status}
      backdropColor="black"
      hasBackdrop={true}
      useNativeDriver={true}
      //coverScreen={false}
      animationIn="fadeInUp"
      animationInTiming={500}
      //deviceWidth={width}
      onBackdropPress={onClose}
      animationOut="fadeOutDown"
      style={{
        //backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormContainer style={styles.container} title="Cerrar Sesion?">
        <View style={styles.buttonContainer}>
          <MainButton
            style={[styles.button, styles.buttonLeft]}
            title="No"
            outline
            onPress={onClose}
          />
          <MainButton
            style={styles.button}
            title="Si"
            onPress={() => {
              alert("si!");
            }}
          />
        </View>
      </FormContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    elevation: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingVertical: 0,
    justifyContent: "flex-end",
    marginTop: 20,
  },
  button: {
    width: "40%",
  },
  buttonLeft: {
    marginRight: 10,
    backgroundColor: "#fff",
  },
});
