import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { routes } from '../assets/routes'
//screen
import { HomeScreen } from "../screens/watch/homeScreen";
import WatchProfileScreen from "../screens/watch/watchProfileScreen.jsx";
import EntryScreen from "../screens/watch/entryScreen";
import VisitScreen from "../screens/watch/visitScreen";
import EditWatchProfileScreen from "../screens/watch/editWatchProfileScreen";
import { DepartureScreen } from "../screens/watch/departureScreen";
const Stack = createStackNavigator();

const options = {
  gestureEnabled: true,
  gestureDirection: "horizontal",
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export const WatchNavigator = () => {
  return (
    <Stack.Navigator headerMode="none" initialRouteName={routes.WATCH_HOME}>
      <Stack.Screen name={routes.WATCH_HOME} component={HomeScreen} />
      <Stack.Screen name={routes.WATCH_PROFILE} component={WatchProfileScreen} />
      <Stack.Screen name={routes.ENTRY} component={EntryScreen} />
      <Stack.Screen name={routes.EXIT} component={VisitScreen} />
      <Stack.Screen name={routes.EDIT_WATCH_PROFILE} component={EditWatchProfileScreen} />
      <Stack.Screen
        options={options}
        name={routes.DEPARTURE}
        component={DepartureScreen}
      />
    </Stack.Navigator>
  );
};
