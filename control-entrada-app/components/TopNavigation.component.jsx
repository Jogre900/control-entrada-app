import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { MainColor } from "../assets/colors.js";

//constants
import Constants from 'expo-constants';
import { tintColor } from "../constants/Colors";

function NormalNav() {
  return (
    <View style={styles.controlBox}>
      <Ionicons name="ios-notifications" size={28} color={MainColor} />
    </View>
  );
}

export const TopNavigation = (props) => {
  const { title, leftControl, rightControl } = props;

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <TouchableOpacity
        onPress={leftControl.props.children.props.onPress}
        style={styles.leftControlBox}
      >
        {leftControl}
      </TouchableOpacity>
      <View style={styles.titleBox}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightControl ? (
        <TouchableOpacity
          onPress={rightControl.props.children.props.onPress}
          style={styles.controlBox}
        >
          {rightControl}
        </TouchableOpacity>
      ) : (
        NormalNav()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: MainColor,
    //paddingTop: Constants.statusBarHeight,
    marginBottom: 0,
    //maxHeight: 60,
    height: 60
  },
  controlBox: {
    justifyContent: "center",
    alignItems: "center",
    width: "10%",
    height: "100%",
  },
  titleBox: {
    justifyContent: "center",
    width: "80%",
    height: "100%",
  },
  title: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
});
