import React from 'react'
import { View, Text, StyleSheet, TextInput, Button } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { RectButton } from 'react-native-gesture-handler'

//components
import { MainButton } from '../../components/mainButton.component'
import { TopNavigation } from '../../components/TopNavigation.component'

export const HistorialScreen = (props) => {
    const goBackAction = () => {
        return (
            <RectButton onPress={() => {props.navigation.goBack()}}>
                <Ionicons name='ios-arrow-back' size={28} color='white'/>
            </RectButton>
        )
    } 

    return (
        <View>
            <TopNavigation title='Historial' leftControl={goBackAction()}/>
            <View style={styles.historialContainer}>
                <View style={styles.inputBox}>
                    <TextInput placeholder='Desde'/>
                    <TextInput placeholder='Hasta'/>
                    <TextInput placeholder='DNI'/>
                </View>
                <MainButton title='Buscar'/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    historialContainer: {

    },
    inputBox: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
})