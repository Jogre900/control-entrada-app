import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { MainButton } from "../../components/mainButton.component";
import { routes } from "../../assets/routes";
import { useSelector } from "react-redux";
const size = 28;

export const DrawerAction = (navigation) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.toggleDrawer();
        }}
      >
        <Ionicons name="ios-menu" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export const BackAction = (navigation, route) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          route ? navigation.navigate(route) : navigation.goBack();
        }}
      >
        <Ionicons name="ios-arrow-back" size={size} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export const Notifications = (navigation) => {
  const notificationNotRead = useSelector((state) => state.profile.notificationNotRead);

  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.NOTIFICATION);
        }}
        style={{
          position: 'relative'
        }}
      >
        <Ionicons name="md-notifications" size={28} color="white" />
       {
         notificationNotRead !== 'undefined' && notificationNotRead.length >= 1 ?
         <View style={styles.numberContainer}>
         <Text style={styles.number}>{notificationNotRead !== undefined ? notificationNotRead.length : null}</Text>
       </View>
       : null
       }
      </TouchableOpacity>
    </View>
  );
};
export const NavigateAction = (navigation, size, name, route) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(route)}>
      <Ionicons name={name} size={size} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  numberContainer: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#09f",
    position: 'absolute',
    top: -8,
    right: -10
  },
  number: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
