import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { MainColor } from "../assets/colors";
import { Ionicons } from "@expo/vector-icons";
const Icon = ({ size, name, color, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.iconBox(size), style]} onPress={onPress}>
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
};

export const MainButton = ({ title, onPress, textStyle, style, outline, rounded, loading }) => {
  return (
    <TouchableOpacity
      style={[
        styles.square,
        // rounded ? styles.rounded : styles.square,
        outline ? styles.outline : styles.filled,
        style,
      ]}
      onPress={onPress}
    >
      {/* <View style={{ width: '70%', }}> */}

      <Text style={[outline ? styles.outlineText : styles.text, textStyle]}>
        {title}
      </Text>
      {/* </View> */}
      {/* {
        //loading &&
        <View style={{ width:'30%', }}>
        <ActivityIndicator size='small' color='#fff'/>
      </View>
      } */}
    </TouchableOpacity>
  );
};

MainButton.Icon = Icon;
const styles = StyleSheet.create({
  square: {
    borderRadius: 5,
    height: 45,
    alignItems: "center",
    backgroundColor: MainColor,
    borderColor: MainColor,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center'
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
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    alignSelf: 'center'
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
