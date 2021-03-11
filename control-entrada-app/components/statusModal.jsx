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
import { Success, Danger } from "../assets/colors";

const { width, height } = Dimensions.get("screen");
export const StatusModal = ({ visible, status, onClose, message }) => {
  
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
        <View style={[styles.container, {backgroundColor: status ? Success : Danger}]}>
         {
           status &&
           <Ionicons
           name="ios-checkmark-circle-outline"
           size={24}
           color="#fff"
           style={styles.icon}
         />
         }
          <Text style={styles.message}>{message}</Text>
        </View>
      }
    ></Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 8,
  },
  message: {
    color: "#fff",
    alignSelf: "center",
    fontSize: 18,
    letterSpacing: 0.8,
    fontWeight: "600",
  },
  icon: {
    marginRight: 10,
  },
});
