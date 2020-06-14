import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

//screen
import { HomeScreen } from '../screens/watch/homeScreen'
import { EntradaScreen } from '../screens/watch/entradaScreen'
import { Entrada2Screen } from '../screens/watch/entrada2Screen'
import { SalidaScreen } from '../screens/watch/salidaScreen'
import { Salida2Screen } from '../screens/watch/salida2Screen'
const Stack = createStackNavigator()

export const WatchNavigator = () => {
    return (
        <Stack.Navigator headerMode='none' initialRouteName={HomeScreen}>
            <Stack.Screen name='watch-home' component={HomeScreen}/>
            <Stack.Screen name='entrada' component={Entrada2Screen}/>
            <Stack.Screen name='salida' component={Salida2Screen}/>
        </Stack.Navigator>
    )
}