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
import { deleteInfo } from "../helpers/";

export const PrompModal = ({ visible, deleted, onClose, data, url }) => {
  const [loading, setLoading] = useState(false);

  const deleteHelper = async () => {
    setLoading(true);
    const res = await deleteInfo(`${API_PORT()}/api/${url}`, data);
    console.log("res de BORRAR---", res)
    if (!res.error) {
      setLoading(false);
      deleted(true, res.msg);
      onClose();
    } else {
      setLoading(false);
      deleted(false, res.msg);
      onClose();
    }
  };
  return (
    <Modal
      isVisible={visible}
      backdropColor="black"
      hasBackdrop={true}
      useNativeDriver={true}
      animationIn="fadeInUp"
      animationInTiming={300}
      animationOut="fadeOutDown"
      animationOutTiming={300}
      style={{
        //backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormContainer style={styles.container} title="¿Seguro que desea borra?">
        <View style={styles.buttonContainer}>
          <MainButton
            style={[styles.button, styles.buttonLeft]}
            outline
            title="No"
            onPress={() => {
              onClose();
            }}
          />
          <MainButton
            style={styles.button}
            title="Si"
            onPress={() => {
              deleteHelper();
            }}
          />
        </View>
      </FormContainer>
      <LoadingModal status={loading} message="Borrando..." />
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
