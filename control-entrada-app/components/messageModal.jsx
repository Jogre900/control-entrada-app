import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { MainButton } from "./mainButton.component";
import { ThirdColor } from '../assets/colors'
const { width, height } = Dimensions.get("screen");
export const MessageModal = ({ visible, status, onClose, message }) => {
  console.log(status);
  const [succes, setSuccess] = useState(false);
  return (
    <Modal
      isVisible={visible}
      //backdropColor={Success}
      //hasBackdrop={false}
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
        }, 1500)
      }
      style={{
        justifyContent: "flex-end",
        //marginHorizontal: 0,
      }}
      children={
        <View style={styles.container}>
          <Ionicons name="md-warning-outline" size={40} color={MainColor} />
          <Text style={styles.loadingText}>{message}</Text>
          <View style={styles.buttonContainer}>
            <MainButton title="Volver" />
          </View>
        </View>
      }
    ></Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#fff",
    width: "90%",
    marginVertical: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: ThirdColor,
    textAlign: "center",
    marginVertical: 5,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#8e8e8e",
    textAlign: "center",
  },
  buttonContainer: {
    width: "50%",
    marginTop: 20,
  },
});
