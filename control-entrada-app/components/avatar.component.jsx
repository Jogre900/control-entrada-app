import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SMALL = 24
const MEDIUN = 32
const LARGE = 56

const Avatar = ({children, style}) => {
    return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const Picture = ({ size, uri, style }) => {
  return <Image style={[styles.picture(size), style]} source={{ uri: uri }} />;
};

const Icon = ({ name, size, color}) => {
  return <Ionicons name={name} size={size} color={color} />;
};

Avatar.Picture = Picture;
Avatar.Icon = Icon;

export default Avatar;

const styles = {
  container: {
    justifyContent: "center", 
    alignItems: "center"
  },
  picture: function (size) {
    return {
      height: size,
      width: size,
      borderRadius: size / 2,
    };
  },
};
