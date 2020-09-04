import React, { useRef, useImperativeHandle } from "react";
import { View, TextInput, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Input = (props, ref) => {
  // ----LA REF NO ME LLEGA POR PROPS----!!!

  const { title, textColor, onChangeText, value, shape, icon, alignText, style, styleInput, keyboardType, returnKeyType, secureTextEntry, autoCorrect, onSubmitEditing } = props;
  //console.log('input ref: ', props.ref)
  const [eyeIcon, setEyeIcon] = React.useState(true);
  const [iconInput, setIconInput] = React.useState("ios-eye-off");
  const [styleRound, setStyleRound] = React.useState(null);

  const showPass = () => {
    if (secureTextEntry) {
      eyeIcon ? setIconInput("ios-eye") : setIconInput("ios-eye-off");
      setEyeIcon(!eyeIcon);
    }
  };

  useImperativeHandle(ref, () => ({
    focus() {
      refInput.current.focus();
    },
  }));

  const focus = () => {
    refInput.current.focus();
  };

  React.useEffect(() => {
    if (shape == "round") {
      setStyleRound(styles.roundedShape);
    }
  });

  const refInput = useRef();
  return (
    <TouchableWithoutFeedback onPress={() => focus()}>
      <View style={[style, styles.flatShape, styleRound]}>
        {shape != "round" ? (
          <TouchableWithoutFeedback onPress={() => showPass()} style={{ alignItems: "center", justifyContent: "center" }}>
            <Ionicons name={secureTextEntry ? iconInput : icon} size={28} color="grey" style={{ marginRight: 5 }} />
          </TouchableWithoutFeedback>
        ) : null}
        <TextInput
          style={[styleInput, { width: "100%" }]}
          placeholder={title}
          textAlign={alignText}
          keyboardType={keyboardType}
          returnKeyType={returnKeyType}
          secureTextEntry={secureTextEntry ? eyeIcon : false}
          placeholderTextColor={textColor}
          autoCorrect={autoCorrect}
          onChangeText={onChangeText}
          value={value}
          onSubmitEditing={onSubmitEditing}
          ref={refInput}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const forwardRefInput = React.forwardRef(Input);

export default forwardRefInput;

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
    alignItems: "center",
    borderBottomWidth: 0.5,
    height: 40,
  },
});
