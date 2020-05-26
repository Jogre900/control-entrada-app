import React from "react";
import { View, TextInput, StyleSheet } from "react-native";

export const Input = (props) => {
  const { title, textColor, onChangeText, value, shape, alignText, style } = props;
  
  return (
    <View>
      <TextInput
        style={[style, (shape=='round')?styles.roundedShape:styles.squareShape]}
        placeholder={title}
        textAlign={alignText}
        placeholderTextColor={textColor}
        onChangeText={onChangeText}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  roundedShape: {
    borderRadius: 20,
    borderWidth: .5,
    borderColor: "grey",
    marginBottom: 10,
    height: 40,
  },
  squareShape: {
    borderRadius: 3,
    borderWidth: .5,
    borderColor: "grey",
    marginBottom: 10,
    height: 40,
  },
});
