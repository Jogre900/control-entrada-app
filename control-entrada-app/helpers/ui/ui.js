import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { MainButton } from "../../components/mainButton.component";
import { routes } from '../../assets/routes'
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
          route ? navigation.navigate(route) : navigation.goBack()
        }}
      >
        <Ionicons name="ios-arrow-back" size={size} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export const Notifications = (navigation) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(routes.NOTIFICATION);
        }}
      >
        <Ionicons name="md-notifications" size={28} color="white" />
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
