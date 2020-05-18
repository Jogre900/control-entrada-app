import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { StackActions } from '@react-navigation/native'

//screens
import { LogInScreen } from '../screens/main/logInScreen'
import { WatchNavigator } from './watch.navigator'
import { SuperNavigator } from './supervicer.navigator'


const stack = createStackNavigator()

export const MainNavigator = () => {
    
    return (
        <stack.Navigator headerMode='none'>
            <stack.Screen name='logIn' component={LogInScreen}/>
            <stack.Screen name='Home' component={WatchNavigator}/>
            <stack.Screen name='super' component={SuperNavigator}/> 
        </stack.Navigator>
    )
}

