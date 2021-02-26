import React from "react";
import { View, TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions, Alert } from "react-native";
import Avatar from "./avatar.component";
import { MainColor } from "../assets/colors";

const { height, width } = Dimensions.get('screen')

const SIZE = 28;
export const FloatingBotton = ({onPress, icon}) => {
  return (
    <TouchableOpacity
    style={styles.container} 
    onPress={onPress}>
      <Avatar.Icon name={icon} size={SIZE} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    backgroundColor: MainColor,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    bottom: 10,
    right: 10,
    elevation: 5
  },
});
