import React, { useState } from "react";
import { FormContainer } from "./formContainer";
import Input from "./input.component";
import { MainButton } from "./mainButton.component";
import { API_PORT } from "../config/index";
import axios from "axios";
import Modal from "react-native-modal";

export const CreateDestinyModal = ({ status, create, onClose, zoneId }) => {
  const [destinyName, setDestinyName] = useState();

  //CREATE DESTINY
  const createDestiny = async () => {
    try {
      let res = await axios.post(`${API_PORT()}/api/createDestiny/${zoneId}`, {
        name: destinyName,
      });
      if (!res.data.error) {
        console.log(res.data.data);
        setDestinyName("");
        create(true);
        onClose();
      }
    } catch (error) {
      console.log(error.message);
    }
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
      <FormContainer style={{ padding: 20 }} title="Crear Destino">
        <Input
          style={{ borderColor: "black", marginBottom: 10 }}
          styleInput={{ color: "black" }}
          title="Nombre"
          textColor="black"
          shape="square"
          icon="ios-pin"
          //alignText="center"
          returnKeyType="next"
          onChangeText={(nombre) => {
            setDestinyName(nombre);
          }}
          value={destinyName}
        />
        <MainButton
          title="Crear Destino"
          onPress={() => {
            createDestiny();
          }}
        />
      </FormContainer>
    </Modal>
  );
};
