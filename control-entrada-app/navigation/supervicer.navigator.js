import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";

//screens
import { HomeSuperScreen } from "../screens/super/homeSuperScreen";
import { DetailViewScreen } from "../screens/super/detailViewScreen";
import { HistorialScreen } from "../screens/super/historialScreen";

const drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function PerfilScreen() {
  return (
    <View>
      <Text>PerfilScreen!!</Text>
    </View>
  );
}

function SupervicerNav() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="supervicer-home" component={HomeSuperScreen} />
      <Stack.Screen name="detail-view" component={DetailViewScreen} />
    </Stack.Navigator>
  );
}

export const SuperNavigator = () => {
  return (
    <drawer.Navigator>
      <drawer.Screen name="home" component={SupervicerNav} />
      <drawer.Screen name="perfil" component={PerfilScreen} />
      <drawer.Screen name="historial" component={HistorialScreen} />
    </drawer.Navigator>
  );
};
