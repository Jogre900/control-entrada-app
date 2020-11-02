import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Avatar = (props) => {
  
  console.log("avatar props", props)
    return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      {props.children}
    </View>
  );
};

const Picture = ({ size, uri, style }) => {
  return <Image style={[styles.picture(size), style]} source={{ uri: uri }} />;
};

const Icon = ({ name, size, color }) => {
  return <Ionicons name={name} size={size} color={color} />;
};

Avatar.Picture = Picture;
Avatar.Icon = Icon;

export default Avatar;

const styles = {
  picture: function (size) {
    return {
      height: size,
      width: size,
      borderRadius: size / 2,
    };
  },
};
