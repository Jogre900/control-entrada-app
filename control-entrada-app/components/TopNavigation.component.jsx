import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  StatusBar,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MainColor } from "../assets/colors.js";

//constants
import Constants from 'expo-constants';
import { tintColor } from "../constants/Colors";

function NormalNav({size}) {
  //console.log("normla nav props----",size)
  return (
    <View style={styles.controlBox(size)}>
      <Ionicons name="ios-notifications" size={size} color={MainColor} />
    </View>
  );
}

export const TopNavigation = ({title, leftControl, rightControl, style}) => {
  
  const size = leftControl.props.children.props.children.props.size
  // console.log("rigth props",rightControl)
  // console.log("left props",leftControl)

  return (
    <View style={[styles.container, style]}>
      <StatusBar hidden={true} />
      <TouchableOpacity
        onPress={leftControl.props.children.props.onPress}
        style={styles.controlBox(size)}
      >
        {leftControl}
      </TouchableOpacity>
      <View style={styles.titleBox}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {rightControl ? (
        <TouchableOpacity
          onPress={rightControl.props.children.props.onPress}
          style={styles.controlBox(size)}
        >
          {rightControl}
        </TouchableOpacity>
      ) : (
        <NormalNav size={size}/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: MainColor,
    marginBottom: 2.5,
    //maxHeight: 60,
    //height: 60
    elevation: 5
  },
  controlBox: function(size){
    return {
    justifyContent: "center",
    alignItems: "center",
    height: size*1.5,
    width: size*1.5,
    borderRadius: size*1.5/2,
    //backgroundColor: 'red',
    justifyContent: "center",
    alignItems: "center",
    }
  },
  titleBox: {
    //justifyContent: "center",
    
    //height: "100%",
  },
  title: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
    fontWeight: '700',
    letterSpacing: 1
  },
});
