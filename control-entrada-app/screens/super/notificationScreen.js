import React from 'react'
import { View, Text, StyleSheet } from 'react-native'



export const NotificationScreen = () => {
    return (
        <View styles={styles.container}>
            <View style={styles.notificationBox}>
                <Text style={styles.notificationTitle}>Titulo</Text>
                <Text style={styles.notificationSub} >Descripcion de la Notificacion</Text>
                
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 5
    },
    notificationBox: {
        borderBottomWidth: .5,
        borderColor: 'grey',
        paddingVertical: 5
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    notificationSub: {
        fontSize: 16
    }
})