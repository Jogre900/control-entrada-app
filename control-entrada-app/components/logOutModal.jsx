import React, { useState } from "react";
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
      <FormContainer style={{ padding: 20 }} title="Cerrar Sesion?">
        <MainButton
          title="No"
          onPress={onClose}
        />
        <MainButton
          title="Si"
          onPress={() => {
            alert("si!");
          }}
        />
      </FormContainer>
    </Modal>
  );
};
