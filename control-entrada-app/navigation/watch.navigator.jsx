import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

//screen
import { HomeScreen } from '../screens/watch/homeScreen'
import { WatchProfileScreen } from '../screens/watch/watchProfileScreen.jsx'
import { Entrada2Screen } from '../screens/watch/entrada2Screen'
import { Salida2Screen } from '../screens/watch/salida2Screen'
const Stack = createStackNavigator()

export const WatchNavigator = () => {
    return (
        <Stack.Navigator headerMode='none' initialRouteName={HomeScreen}>
            <Stack.Screen name='watch-home' component={HomeScreen}/>
            <Stack.Screen name='watch-profile' component={WatchProfileScreen}/>
            <Stack.Screen name='entrada' component={Entrada2Screen}/>
            <Stack.Screen name='salida' component={Salida2Screen}/>
        </Stack.Navigator>
    )
}