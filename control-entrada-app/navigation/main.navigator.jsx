import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//screens
import { SplashScreen } from "../components/splashScreen.component";
import { ProfileComponent } from '../components/profile.component'
import { LogInScreen } from "../screens/main/logInScreen";
import { WatchNavigator } from "./watch.navigator";
import { SuperNavigator } from "./supervicer.navigator";

const stack = createStackNavigator();

export const MainNavigator = () => {
  return (
    <stack.Navigator headerMode="none">
      {/* <stack.Screen name="splash" component={ProfileComponent} /> */}
      <stack.Screen name="logIn" component={LogInScreen} />
      <stack.Screen name="watch" component={WatchNavigator} />
      <stack.Screen name="super" component={SuperNavigator} />
    </stack.Navigator>
  );
};
