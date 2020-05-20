import React from 'react'
import { View, Text, StyleSheet, TextInput, Button } from 'react-native'

import { TopNavigation } from '../../components/TopNavigation.component'

export const HistorialScreen = (props) => {
    const params = {
        id: false,
        props: props,
        title: 'Historial de Visitas',
    } 

    return (
        <View>
            <TopNavigation {...params}/>
            <Text>Historial</Text>
        </View>
    )
}