import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import { MainButton } from "./mainButton.component";
import { MainColor } from "../assets/colors.js";

const ICON_SIZE = 28
export const Header = ({ value, clearAction, deleteAction }) => {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity style={styles.buttons} onPress={clearAction}>
        <Ionicons name="ios-arrow-round-back" size={ICON_SIZE} color="#fff"/>
      </TouchableOpacity>
      <View>
        <Text style={styles.selectText}>Sel: {value}</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TouchableOpacity style={styles.buttons} onPress={deleteAction}>
        <Ionicons name="ios-trash" size={ICON_SIZE} color="#fff"/>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttons}>
        <Ionicons name="ios-more" size={ICON_SIZE} color="#fff" style={styles.moreIcon}/>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: MainColor,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    height: ICON_SIZE * 1.5,
    width: ICON_SIZE * 1.5,
    borderRadius: ICON_SIZE *1.5 /2
  },
  selectText: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 1,
    color: '#fff'
  },
  moreIcon: {
    transform: [{ rotate: '-90deg' }],
  },
});
