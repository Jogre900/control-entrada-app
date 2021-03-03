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

export const PrompModal = ({ status, deleted, onClose, data, uri }) => {
  const [loading, setLoading] = useState(false);

  //DELETE DESTINY
  const deleteHelper = async () => {
    setLoading(true);
    const { check, msg} = await deleteInfo(`${API_PORT()}/api/${uri}`, data);
    console.log(check, msg)
    setLoading(false);
    deleted(check, msg);
    onClose();
  };
  return (
    <Modal
      isVisible={status}
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
      <FormContainer style={{ padding: 20, elevation: 0 }}>
        <Text>Seguro que desea borrar?</Text>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: 'green',
            justifyContent: 'flex-end'
          }}
        >
          <MainButton
            style={{ 
                width: '40%' 
            }}
            outline
            title="No"
            onPress={() => {
              onClose();
            }}
          />
          <MainButton
            style={{ 
                width: '40%' 
            }}
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
  caption: {},
});
