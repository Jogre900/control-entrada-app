import React from 'react'
import { View, StyleSheet } from 'react-native'

export const Divider = (props) => {
    const { size } = props
    return (
        <View style={[styles.divider, {height : size === "small" ? 1 : 2}]}></View>
    )
}

const styles = StyleSheet.create({
    divider: {
        backgroundColor: 'grey',
        //height: 2,
        width: '100%',
        marginVertical: 4
    }
})