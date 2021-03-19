import React from "react";
import { View } from "react-native";
import { Spinner } from "./spinner";
import Modal from 'react-native-modal'
export const LoadingModal = ({ visible, message }) => {
  return (
    <Modal
      isVisible={visible}
      //onBackdropPress={() => setModalVisible(!modalVisible)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "center",
        }}
      >
        <Spinner message={message}/>
      </View>
    </Modal>
  );
};
