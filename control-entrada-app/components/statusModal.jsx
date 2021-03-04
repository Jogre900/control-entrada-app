import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { Success, Danger } from "../assets/colors";

const { width, height } = Dimensions.get("screen");
export const StatusModal = ({ status, onClose, message }) => {
  console.log(status);
  const [succes, setSuccess] = useState(false)
  return (
    <Modal
      isVisible={status}
      //backdropColor={Success}
      hasBackdrop={false}
      useNativeDriver={true}
      animationIn="fadeInUp"
      animationInTiming={500}
      deviceWidth={width}
      onBackdropPress={onClose}
      animationOut="fadeOutDown"
      animationOutTiming={500}
      onModalShow={() =>
        setTimeout(() => {
          onClose();
        }, 2000)
      }
      style={{
        justifyContent: "flex-end",
        margin: 0,
      }}
      children={
        <View
          style={{
            backgroundColor: "rgba(40, 167, 69, 1)",

            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,

            padding: 15,
          }}
        >
          <Text
            style={{
              color: "#fff",
              alignSelf: "center",
              fontSize: 18,
              letterSpacing: 0.8,
              fontWeight: "600",
            }}
          >
            {message}
          </Text>
        </View>
      }
    ></Modal>
  );
};
