import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//screens
import { SplashScreen } from "../components/splashScreen.component";
import { ProfileComponent } from "../components/profile.component";
import { LogInScreen } from "../screens/main/logInScreen";
import { RegisterScreen } from "../screens/main/registerScreen";
import { WatchNavigator } from "./watch.navigator";
import { AdminNavigator } from "./admin.navigator";

const stack = createStackNavigator();

export const MainNavigator = () => {
  return (
    <stack.Navigator headerMode="none" initialRouteName="logIn">
      <stack.Screen name="logIn" component={LogInScreen} />
      <stack.Screen name="register" component={RegisterScreen} />
      <stack.Screen name="watch" component={WatchNavigator} />
      <stack.Screen name="admin" component={AdminNavigator} />
    </stack.Navigator>
  );
};
