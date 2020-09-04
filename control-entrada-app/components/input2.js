import React from 'react'
import { View, StyleSheet, TextInput} from 'react-native'


const Input2 = (props, ref) => {
    const {
        title,
        onTextChange,
        textColor,
        alignText,
        keyboradType,
        returnKeyType,
        value,
        secureTextEntry,
        onSubmitEditing,
        style
    } = props

    console.log("props input2: ", props)
    
    return (
        <View style={styles.inputContainer}>
            <TextInput
            style={style}
                placeholder={title}
                textColor={textColor}
                onTextChange={onTextChange}
                value={value}
                ref={ref}
                secureTextEntry={secureTextEntry}
                alignText={alignText}
                keyboardType={keyboradType}
                returnKeyType={returnKeyType}
                onSubmitEditing={onSubmitEditing}
            />
        </View>
    )
}

const inputForward = React.forwardRef(Input2)

export default inputForward

const styles = StyleSheet.create({
    inputContainer: {
        borderBottomWidth: .5,
        borderColor: 'grey'
    }
})