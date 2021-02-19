import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Divider} from './Divider'
import {MainColor} from '../assets/colors'
export const FormContainer = ({children, title}) => {
    //console.log("PROPS FORM CONTAINER-----",props.children)
    return (
        <View style={styles.formContainer}>
            <Text style={styles.labelTitle}>{title}</Text>
            <Divider size='small' color={MainColor}/>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    formContainer: {
        backgroundColor: "#fff",
        width: "90%",
        borderRadius: 5,
        marginVertical: 2.5,
        padding: 8,
      },
      labelTitle: {
        fontSize: 16,
        lineHeight: 18,
        color: MainColor,
      },
})
