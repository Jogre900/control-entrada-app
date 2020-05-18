import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { 
    View,
    Text
 } from 'react-native'

 //screens
 import { HomeSuperScreen } from '../screens/super/homeSuperScreen'

const drawer = createDrawerNavigator()

function HomeScreen() {
    return (
        <View>
            <Text>HomeScreen!!</Text>
        </View>
    )
}

function PerfilScreen() {
    return (
        <View>
            <Text>PerfilScreen!!</Text>
        </View>
    )
}

export const SuperNavigator = () => {
    return (
        <drawer.Navigator>
            <drawer.Screen name='home' component={HomeSuperScreen}/>
            <drawer.Screen name='perfil' component={PerfilScreen}/>
        </drawer.Navigator>
    )
}