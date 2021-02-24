import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {Divider} from './Divider'
import {MainColor} from '../assets/colors'
export const FormContainer = ({children, title, style}) => {
    //console.log("PROPS FORM CONTAINER-----",props.children)
    return (
        <View style={[styles.formContainer, style]}>
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
        marginVertical: 5,
        padding: 8,
        elevation: 5
      },
      labelTitle: {
        fontSize: 17,
        lineHeight: 18,
        color: MainColor,
        fontWeight: '600'
      },
})
