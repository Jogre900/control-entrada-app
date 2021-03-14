import React from 'react'
import {
    createStackNavigator,
    CardStyleInterpolators,
  } from "@react-navigation/stack";
import { Page1Screen } from '../screens/tutorial/page1Screen'
import { Page2Screen } from '../screens/tutorial/page2Screen'

  const Stack = createStackNavigator()



  export function TutorialNavigator(){
      return (
          <Stack.Navigator headerMode='none' initialRouteName='PAGE_1'>
              <Stack.Screen name='PAGE_1' component={<Page1Screen/>}/>
              <Stack.Screen name='PAGE_2' component={<Page2Screen/>}/>
              <Stack.Screen/>
              <Stack.Screen/>
          </Stack.Navigator>
      )
  }