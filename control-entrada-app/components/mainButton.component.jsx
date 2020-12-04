import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { MainColor } from "../assets/colors";
import { Ionicons } from "@expo/vector-icons";
const Icon = ({ size, name, color, onPress }) => {
  return (
    <TouchableOpacity style={styles.iconBox(size)} onPress={onPress}>
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};

export const MainButton = ({ title, onPress, textStyle, style, outline, rounded }) => {
  return (
    <TouchableOpacity
      style={[
        rounded ? styles.rounded : styles.square,
        outline ? styles.outline : styles.filled,
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[outline ? styles.outlineText : styles.text, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

MainButton.Icon = Icon;
const styles = StyleSheet.create({
  square: {
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: MainColor,
    borderColor: MainColor,
    borderWidth: 1,
  },
  rounded: {
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  filled: {
    backgroundColor: MainColor,
    borderColor: MainColor,
    borderWidth: 1,
  },
  outline: {
    borderColor: MainColor,
    backgroundColor: '#eee',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    // letterSpacing: 2,
  },
  outlineText: {
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
