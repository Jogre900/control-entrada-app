import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";

//screens
import LoadingScreen from '../screens/main/loadingScreen' 
import MainScreen from "../screens/main/mainScreen";
import LoginScreen from "../screens/main/logInScreen";
import RegisterScreen from "../screens/main/registerScreen";
import { WatchNavigator } from "./watch.navigator";
import AdminNavigator from "./admin.navigator";
import { TermsScreen } from "../screens/main/termsAndConditionsScreen";
import { routes } from '../assets/routes'

const stack = createStackNavigator();

const options = {
  gestureEnabled: true,
  gestureDirection: "horizontal",
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export const MainNavigator = (props) => {

  return (
    <stack.Navigator
      headerMode="none"
      initialRouteName={routes.LOADING}
    >
      <stack.Screen name={routes.MAIN} component={MainScreen} />
      <stack.Screen name={routes.LOADING} component={LoadingScreen} />
      <stack.Screen name={routes.LOGIN} component={LoginScreen} />
      <stack.Screen name={routes.WATCH}>
        {() => <WatchNavigator {...props} />}
      </stack.Screen>
      <stack.Screen name={routes.REGISTER} component={RegisterScreen} />
      <stack.Screen name={routes.TERMS} component={TermsScreen} options={options} />
      <stack.Screen name={routes.ADMIN}>
        {() => <AdminNavigator {...props} />}
      </stack.Screen>
    </stack.Navigator>
  );
};
