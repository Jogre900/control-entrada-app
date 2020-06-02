import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

export const Input = (props) => {
  const { 
    title, 
    textColor, 
    onChangeText, 
    value, 
    shape, 
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
    <View>
      <TextInput
        style={[style, (shape=='round')?styles.roundedShape:styles.squareShape]}
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
});
