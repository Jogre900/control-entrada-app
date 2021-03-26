import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { FormContainer } from "./formContainer";
import { MainButton } from "./mainButton.component";
import { routes } from '../assets/routes'
import { storage } from '../helpers/asyncStorage'
import { useDispatch } from 'react-redux'
import Modal from "react-native-modal";

export const LogOutModal = ({ status, navigation, onClose }) => {
  const dispatch = useDispatch();
  const logOut = () => {
    return new Promise((resolve, reject) => {
      resolve(dispatch({ type: "CLEAR_STORAGE" }));
    });
  };
  const deleteToken = async () => {
   
    logOut()
      .then(() => storage.removeItem("userToken"))
      .then(() => navigation.navigate(routes.MAIN));
      onClose()
  };

  
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
            onPress={deleteToken}
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
