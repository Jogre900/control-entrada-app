import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

//screen
import { HomeScreen } from '../screens/watch/homeScreen'
import { EntradaScreen } from '../screens/watch/entradaScreen'
import { SalidaScreen } from '../screens/watch/salidaScreen'
const Stack = createStackNavigator()

export const WatchNavigator = () => {
    return (
        <Stack.Navigator headerMode='none' initialRouteName={HomeScreen}>
            <Stack.Screen name='watch-home' component={HomeScreen}/>
            <Stack.Screen name='entrada' component={EntradaScreen}/>
            <Stack.Screen name='salida' component={SalidaScreen}/>
        </Stack.Navigator>
    )
}