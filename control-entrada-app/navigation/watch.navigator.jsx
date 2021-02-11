import React from "react";
import { createStackNavigator, CardStyleInterpolators, } from "@react-navigation/stack";

//screen
import { HomeScreen } from "../screens/watch/homeScreen";
import WatchProfileScreen from "../screens/watch/watchProfileScreen.jsx";
import EntryScreen from "../screens/watch/entryScreen";
import VisitScreen from "../screens/watch/visitScreen";
import { DepartureScreen } from "../screens/watch/departureScreen";
const Stack = createStackNavigator();

const options = {
  gestureEnabled: true,
  gestureDirection: "horizontal",
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export const WatchNavigator = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="watch-home">
      <Stack.Screen name="watch-home" component={HomeScreen} />
      <Stack.Screen name="watch-profile" component={WatchProfileScreen} />
      <Stack.Screen name="entrada" component={EntryScreen} />
      <Stack.Screen name="salida" component={VisitScreen} />
      <Stack.Screen
        options={options}
        name="departure"
        component={DepartureScreen}
      />
    </Stack.Navigator>
  );
};
