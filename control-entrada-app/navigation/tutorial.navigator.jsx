import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { Page1Screen } from "../screens/tutorial/page1Screen";
import { Page2Screen } from "../screens/tutorial/page2Screen";
import { Page3Screen } from "../screens/tutorial/page3Screen";
import { routes } from '../assets/routes'

const Stack = createStackNavigator();
const options = {
    gestureEnabled: true,
    gestureDirection: "horizontal",
    cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  };
export function TutorialNavigator() {
    return (
    <Stack.Navigator headerMode="none" initialRouteName={routes.PAGE_1}>
      <Stack.Screen name={routes.PAGE_1} component={Page1Screen} />
      <Stack.Screen name={routes.PAGE_2} component={Page2Screen} options={options}/>
      <Stack.Screen name={routes.PAGE_3} component={Page3Screen} options={options}/>
    </Stack.Navigator>
  );
}
