import React from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
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
    onSubmitEditing,
    ref,
  } = props;

  const [eyeIcon, setEyeIcon] = React.useState(false);

  const showPass = () => {
    setEyeIcon(!eyeIcon);
  };
  const inputFlat = () => {
    return secureTextEntry ? (
      <View style={[style, styles.flatShape]}>
        <TouchableWithoutFeedback
          onPress={() => showPass()}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons
            name={eyeIcon ? "ios-eye" : icon}
            size={28}
            color="grey"
            style={{ marginRight: 5 }}
          />
        </TouchableWithoutFeedback>
        <TextInput
          placeholder={title}
          textAlign={alignText}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          secureTextEntry={eyeIcon ? false : true}
          placeholderTextColor={textColor}
          autoCorrect={autoCorrect}
          onChangeText={onChangeText}
          value={value}
          onSubmitEditing={onSubmitEditing}
        />
      </View>
    ) : (
      <View style={[style, styles.flatShape]}>
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
      </View>
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

    height: 40,
  },
});
