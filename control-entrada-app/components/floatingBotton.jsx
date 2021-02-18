import React from "react";
import { View, TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions, Alert } from "react-native";
import Avatar from "./avatar.component";
import { MainColor } from "../assets/colors";

const { height, width } = Dimensions.get('screen')

const SIZE = 50;
export const FloatingBotton = () => {
  return (
    <TouchableOpacity 
    style={styles.container} 
    onPress={() => console.log("HOLA FROM BOTTON")}>
      <Avatar.Icon name="ios-add" size={SIZE} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: SIZE * 1.2,
    width: SIZE * 1.2,
    borderRadius: (SIZE * 1.2) / 2,
    backgroundColor: MainColor,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 10,
    right: 10,
    elevation: 5
  },
});
