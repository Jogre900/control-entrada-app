import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, StatusBar, BackHandler, Alert, Image, Dimensions, Animated, ImageBackground, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TextInput } from "react-native";

//components
import { MainButton } from "../../components/mainButton.component";
import { Input } from "../../components/input.component";
import { SplashScreen } from "../../components/splashScreen.component";

//constants
import { mainColor } from "../../constants/Colors";

const { width, height } = Dimensions.get("window");

const backAction = () => {
  Alert.alert("", "Cerrar App?", [
    {
      text: "No",
      onPress: () => null,
      style: "cancel",
    },
    { text: "Cerrar", onPress: () => BackHandler.exitApp() },
  ]);
  return true;
};

export const LogInScreen = (props) => {
  const { navigation } = props;

  const [isSplash, setIsSplash] = useState(true);

  const backHandler = useRef(null);
  const translate = new Animated.Value(1);
  const nextInput = useRef(null);

  const activeSplash = () => {
    setTimeout(() => {
      setIsSplash(false);
    }, 3000);
  };

  useEffect(() => {
    activeSplash();
    // backHandler.current = BackHandler.addEventListener("hardwareBackPress", backAction);
    // return () => {
    //   backHandler.current.remove()
    //BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  if (isSplash) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={require("../../assets/images/background.jpg")} style={styles.imageBackground}>
        <StatusBar hidden={true} />

        <TouchableWithoutFeedback style={styles.backCover} onPress={() => Keyboard.dismiss()}>
          <KeyboardAvoidingView style={styles.backCover} behavior="padding">
            <Image style={styles.logo} source={require("../../assets/images/security-logo.png")} />
            <View style={styles.buttonBox}>
              <Input
                style={{ borderColor: mainColor, color: "white" }}
                title="Correo"
                textColor="white"
                shape="round"
                alignText="center"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => nextInput.focus()}
              />
              <Input style={{ borderColor: mainColor, color: "white" }} title="Clave" textColor="white" shape="round" alignText="center" returnKeyType="go" secureTextEntry={true} ref={nextInput} />
              <MainButton
                title="Iniciar Sesion"
                onPress={() => {
                  props.navigation.navigate("Home");
                }}
              />
              <MainButton
                title="Supervisor"
                onPress={() => {
                  props.navigation.navigate("super");
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonBox: {
    marginBottom: "10%",
    width: "75%",
    //position: "absolute",
  },
  imageBackground: {
    resizeMode: "cover",
    flex: 1,
  },
  backCover: {
    backgroundColor: "black",
    flex: 1,
    width: width,
    height: height,
    opacity: 0.8,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    bottom: "25%",
  },
});
