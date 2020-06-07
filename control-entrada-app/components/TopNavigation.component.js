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

//constants
import { tintColor } from "../constants/Colors";

function NormalNav() {
  console.log(tintColor);
  return (
    <View style={styles.rightControlBox}>
      <Ionicons name="ios-notifications" size={28} color="#ff7e00" />
    </View>
  );
}

export const TopNavigation = (props) => {
  const { title, leftControl, rightControl } = props;
  console.log("leftcontrol------", leftControl.props.children.props.onPress);

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
          style={styles.rightControlBox}
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
    paddingHorizontal: 2,
    backgroundColor: "#ff7e00",
    paddingTop: 20,
    marginBottom: 0,
    maxHeight: 60,
  },
  leftControlBox: {
    justifyContent: "center",
    alignItems: "center",
    width: "10%",
    height: '100%',
  },
  rightControlBox: {
    justifyContent: "center",
    alignItems: "center",
    width: "10%",
    height: '100%',
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
