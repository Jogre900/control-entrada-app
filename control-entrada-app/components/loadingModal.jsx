import React from "react";
import { View } from "react-native";
import { Spinner } from "./spinner";
export const LoadingModal = ({ status }) => {
  return (
    <Modal
      isVisible={status}
      //onBackdropPress={() => setModalVisible(!modalVisible)}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "center",
        }}
      >
        <Spinner />
      </View>
    </Modal>
  );
};
