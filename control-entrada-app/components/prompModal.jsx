import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FormContainer } from "./formContainer";
import Input from "./input.component";
import { MainButton } from "./mainButton.component";
import { Danger } from "../assets/colors";
import axios from "axios";
import Modal from "react-native-modal";
import { LoadingModal } from "./loadingModal";
import { deleteInfo, helpers } from "../helpers/";

export const PrompModal = ({ visible, deleted, onClose, data, url, suspend }) => {
  const [loading, setLoading] = useState(false);

  const suspendE = async () => {
    setLoading(true);
    try {
      const res = await helpers.suspendEmployee(data)
      setLoading(false);
      if(!res.data.error){
        deleted(true, res.data.msg, res.data.data)
        onClose();
      }
    } catch (error) {
      setLoading(false);
      deleted(false, error.message)
    }
  }

  const deleteHelper = async () => {
    setLoading(true);
    const res = await deleteInfo(url, data);
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
      <FormContainer style={styles.container} title={!suspend ?"¿Seguro que desea borra?" : "¿Seguro que desea suspender?"}>
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
            onPress={!suspend ? deleteHelper : suspendE}
          />
        </View>
      </FormContainer>
      <LoadingModal visible={loading} message="Borrando..." />
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
