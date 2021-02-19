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
export const StatusModal = ({ status, onClose }) => {
  console.log(status);
  //const [visible, setVisible] = useState(status)
  return (
    <Modal
      isVisible={status}
      //backdropColor={Success}
      hasBackdrop={false}
      useNativeDriver={true}
      //coverScreen={false}
      animationIn="fadeInUp"
      animationInTiming={500}
      deviceWidth={width}
      onBackdropPress={onClose}
      animationOut="fadeOutDown"
      onModalShow={() => setTimeout(() => {onClose()}, 1000)}
      style={
        {
          //flex: 1,
          //height: 500
          //minWidth: width,
          //position: 'absolute',
          //bottom: 0,
          //right: 0,
          //backgroundColor: Success,
        }
      }
      children={
        <View
          style={{
            backgroundColor: "rgba(40, 167, 69, 1)",
            borderRadius: 5,
            //borderTopRightRadius: 10,
            //borderTopLeftRadius: 10,
            //position: 'absolute',
            //bottom: 0,
            padding: 10,
            marginTop: Math.floor(height - 150)
          }}
        >
          {/* <TouchableOpacity onPress={onClose}>
            <Text>X</Text>
          </TouchableOpacity> */}
          <Text
            style={{
              color: "#fff",
              alignSelf: 'center',
              fontSize: 16,
              letterSpacing: .8
            }}
          >
            Registro Exitoso!
          </Text>
        </View>
      }
    ></Modal>
  );
};
