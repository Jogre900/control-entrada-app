import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MainColor, ThirdColor, Danger } from "../assets/colors";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import { Divider } from "./Divider";

export const CameraModal = ({ status, onClose, type, profile, anotherPic }) => {
  //PICK IMAGE
  const pickImage = async (type, source) => {
    let options = {
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    };

    if (source === "gallery") {
      try {
        var result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          ...options,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        var result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          ...options,
        });
      } catch (error) {
        console.log(error);
      }
    }
    switch (type) {
      case "profile":
        if (!result.cancelled) {
          let filename = result.uri.split("/").pop();
          // Infer the type of the image
          let match = /\.(\w+)$/.exec(filename);
          let type = match ? `image/${match[1]}` : `image`;
          profile(result.uri, filename, type, "", true);
          onClose();
        } else {
          profile("", "", "", "", false);
        }
        break;
      case "visit":
        if (!result.cancelled) {
          let filename2 = result.uri.split("/").pop();
          // Infer the type of the image
          let match2 = /\.(\w+)$/.exec(filename2);
          let type2 = match2 ? `image/${match2[1]}` : `image`;
          anotherPic(result.uri, filename2, type2, "", true);
          onClose();
        } else {
          anotherPic("","","","", false);
        }
        break;

      default:
        break;
    }
  };
  return (
    <Modal
      isVisible={status}
      onBackdropPress={onClose}
      useNativeDriver={true}
      animationIn="slideInUp"
      animationInTiming={300}
      animationOut="slideOutDown"
      animationOutTiming={300}
      style={{
        //backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
        justifyContent: "flex-end",
        //margin: 0
      }}
    >
      <View
        style={{
          //backgroundColor: "skyblue",
          width: "100%",
          height: "30%",
          justifyContent: "space-between",
        }}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => pickImage(type, "camera")}
          >
            <Text style={styles.buttonText}>Camara</Text>
          </TouchableOpacity>
          <Divider size="small" />
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => pickImage(type, "gallery")}
          >
            <Text style={styles.buttonText}>Galeria</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cancelContainer}>
          <TouchableOpacity onPress={() => onClose()}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: "60%",
    marginBottom: 20,
  },
  buttons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#09f",
    fontSize: 18,
    fontWeight: "600",
  },
  cancelContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#8e8e8e",
    fontSize: 18,
    fontWeight: "600",
  },
});
