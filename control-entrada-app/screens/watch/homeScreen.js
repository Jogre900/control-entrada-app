import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button
} from 'react-native'

export const HomeScreen = (props) => {
    return (
        <View style={styles.container}>
            <Button title='entrada' onPress={() => {props.navigation.navigate('entrada')}}/>
            <Button title='salida' onPress={()=> {props.navigation.navigate('salida')}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    }
})