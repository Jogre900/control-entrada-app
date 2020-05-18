import React from 'react'
import { 
    View, 
    Text, 
    StyleSheet,
    TextInput,
    Button,
    Alert
 } from 'react-native'

export const SalidaScreen = () => {
    return (
        <View style={styles.container}>
            <View>
                <TextInput placeholder='cedula'/>
                <Button title='buscar'/>
                <TextInput placeholder='nombre'/>
                <TextInput placeholder='apellido'/>
                <TextInput placeholder='destino'/>
                <View>
                    <Text>
                        Foto
                    </Text>
                </View>
                <Button title='marcar salida' onPress={()=>{Alert.alert('registro exitoso!')}}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})