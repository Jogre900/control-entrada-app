import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export const Input = (props) => {
  const { 
    title, 
    textColor, 
    onChangeText, 
    value, 
    shape,
    icon, 
    alignText, 
    style,
    keyboardType,
    returnKeyType,
    secureTextEntry,
    autoCorrect,
    ref,
    onSubmitEditing
  } = props;
  
  return (
    <View style={{flexDirection:'row', alignItems:'center',  borderBottomWidth: .5}}>
      <View style={{alignItems:'center', justifyContent:'center'}}>
        <Ionicons name={icon} size={28} color='grey'style={{marginRight: 5}}/>
      </View>
      <TextInput
        style={[style, (shape=='round')?styles.roundedShape:
        (shape=='square') ? styles.squareShape : styles.flatShape]}
        placeholder={title}
        textAlign={alignText}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        secureTextEntry={secureTextEntry}
        placeholderTextColor={textColor}
        autoCorrect={autoCorrect}
        onChangeText={onChangeText}
        value={value}
        onSubmitEditing={onSubmitEditing}
        ref={ref}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  roundedShape: {
    borderRadius: 20,
    borderWidth: .5,
    marginBottom: 10,
    height: 40,
    
  },
  squareShape: {
    borderRadius: 3,
    borderWidth: .5,
    marginBottom: 10,
    height: 40,
  },
  flatShape: {
    //borderRadius: 3,
    //borderBottomWidth: .5,
    //marginBottom: 10,
    //height: 40,
  }
});
