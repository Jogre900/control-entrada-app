import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

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
    onSubmitEditing,
    ref
  } = props;

  const inputFlat = () => {
    return (
      <TouchableWithoutFeedback style={[style, styles.flatShape]}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Ionicons
            name={icon}
            size={28}
            color="grey"
            style={{ marginRight: 5 }}
          />
        </View>
        <TextInput
          
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
             
        />
      </TouchableWithoutFeedback>
    );
  };

  const inputRound = () => {
    return (
      <View>
        <TextInput
          style={[style, styles.roundedShape]}
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

  return shape === "round" ? inputRound() : inputFlat();
};

const styles = StyleSheet.create({
  roundedShape: {
    borderRadius: 20,
    borderWidth: 0.5,

    height: 40,
  },
  squareShape: {
    borderRadius: 3,
    borderWidth: 0.5,
    
    height: 40,
    //width: '100%'
  },
  flatShape: {
    flexDirection: "row",
    //alignItems: "center",
    borderBottomWidth: 0.5,
   
    height: 40
  },
});
