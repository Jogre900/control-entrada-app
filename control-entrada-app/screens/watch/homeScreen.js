import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button
} from 'react-native'

//components
import { TopNavigation } from '../../components/TopNavigation.component'
import { MainButton } from '../../components/mainButton.component'

export const HomeScreen = (props) => {
    const params = {
        id: false,
        props: props,
        title: 'Control de Visitas'
    }
    const entrada = {
        props: props,
        title: 'Entrada',
        route: 'entrada',
        navigate: true
    }
    const salida = {
        props: props,
        title: 'Salida',
        route: 'salida',
        navigate: true
    }

    return (
        <View style={styles.container}>
            <TopNavigation {...params}/>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={styles.actionContainer}>
                <MainButton {...entrada}/>
                <MainButton {...salida}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
    },
    actionContainer: {
        
        width: "75%",
        
    }
})