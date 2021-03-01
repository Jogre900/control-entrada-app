import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FormContainer } from "./formContainer";
import Input from "./input.component";
import { MainButton } from "./mainButton.component";
import { API_PORT } from "../config/index";
import { Danger } from "../assets/colors";
import axios from "axios";
import Modal from "react-native-modal";
import { LoadingModal } from "./loadingModal";

export const CreateDestinyModal = ({ status, create, onClose, zoneId }) => {
  const [destinyName, setDestinyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");

  //CREATE DESTINY
  const createDestiny = async () => {
    setLoading(true);
    if (destinyName.length === 0) {
      setCaption("Debe ingresar un nombre.");
      setLoading(false);
      return;
    }
    if (destinyName.length < 4 || destinyName.length > 15) {
      setCaption("Ingrese un nombre entre 4 y 15 caracteres.");
      setLoading(false);
      return;
    }

    setLoading(true);
    // create(false);
    try {
      let res = await axios.post(`${API_PORT()}/api/createDestiny/${zoneId}`, {
        name: destinyName,
      });
      if (!res.data.error) {
        setDestinyName("");
        setCaption("");
        setLoading(false);
        create(true, res.data.msg, res.data.data);
        onClose();
      }
    } catch (error) {
      setLoading(false);
      create(false, error.message)
    }
  };
  return (
    <Modal
      isVisible={status}
      backdropColor="black"
      hasBackdrop={true}
      useNativeDriver={true}
      animationIn="fadeInUp"
      animationInTiming={300}
      onBackdropPress={() => {
        setDestinyName(""), setCaption(""), onClose();
      }}
      animationOut="fadeOutDown"
      animationOutTiming={300}
      style={{
        //backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormContainer style={{ padding: 20, elevation: 0}} title="Crear Destino">
        <Input
          title="Nombre"
          shape="flat"
          icon="ios-pin"
          //alignText="center"
          returnKeyType="next"
          onChangeText={(nombre) => {
            setDestinyName(nombre), setCaption("");
          }}
          value={destinyName}
        />
        <View>
          <Text
            style={{
              color: Danger,
              fontSize: 15,
              fontWeight: "600",
            }}
          >
            {caption}
          </Text>
        </View>

        <MainButton
          style={{ marginTop: 20 }}
          title="Crear Destino"
          onPress={() => {
            createDestiny();
          }}
        />
      </FormContainer>
      <LoadingModal status={loading} message="Guardando..." />
    </Modal>
  );
};

const styles = StyleSheet.create({
  caption: {},
});
