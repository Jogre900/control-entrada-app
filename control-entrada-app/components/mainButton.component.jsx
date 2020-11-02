import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from "react-native";
import { MainColor } from "../assets/colors";
import { Ionicons } from "@expo/vector-icons";
const Icon = ({ size, name, color }) => {
  return (
    <TouchableOpacity style={styles.iconBox(size)}>
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};

export const MainButton = (props) => {
  const { title, onPress, textStyle, style, outlined } = props;
  return (
    <TouchableOpacity
      style={[outlined ? styles.outlined : styles.button, style]}
      onPress={onPress}
    >
      <Text style={[outlined ? styles.outlinedText : styles.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

MainButton.Icon = Icon;
const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: MainColor,
    borderColor: MainColor,
    borderWidth: 1,
    //marginBottom: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  outlined: {
    borderRadius: 20,
    borderColor: MainColor,
    borderWidth: 1,
    //marginBottom: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 15,
    color: "white",
  },
  outlinedText: {
    color: MainColor,
  },
  iconBox: function (size) {
    return {
      justifyContent: "center",
      alignItems: "center",
      //borderColor: MainColor,
      //borderWidth: .5,
      height: size * 2,
      width: size * 2,
      borderRadius: (size * 2) / 2,
    };
  },
});
