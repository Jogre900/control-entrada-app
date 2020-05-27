import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  BackHandler,
  Alert,
  Image,
  Dimensions,
  Animated,
  ImageBackground,
} from "react-native";

//components
import { MainButton } from "../../components/mainButton.component";
import { Input } from "../../components/input.component";

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
  const backHandler = useRef(null);
  const translate = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(translate, {
          toValue: 1.1,
          duration: 1000,
        }),
        Animated.timing(translate, {
          toValue: 1,
          duration: 1000,
        }),
      ])
    ).start();
    // backHandler.current = BackHandler.addEventListener("hardwareBackPress", backAction);
    // return () => {
    //   backHandler.current.remove()
    //BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/background.jpg")}
        style={styles.image}
      >
        <StatusBar hidden={true} />
        {/* <Animated.Image
        style={[
          styles.image,
          {
            transform: [{ scale: translate }],
          },
        ]}
        source={require("../../assets/images/female-3.jpg")}
      /> */}
        <View style={styles.backCover}>
          <Image
            style={styles.logo}
            source={require("../../assets/images/security-logo.png")}
          />
          <View style={styles.buttonBox}>
            <Input
              style={{ borderColor: "#ff7e00", color: "white" }}
              title="Usuario"
              textColor="white"
              shape="round"
              alignText="center"
            />
            <Input
              style={{ borderColor: "#ff7e00", color: "white" }}
              title="Clave"
              textColor="white"
              shape="round"
              alignText="center"
            />
            <MainButton
              title="Iniciar Sesion"
              onPress={() => {
                props.navigation.navigate("Home");
              }}
            />
            <MainButton
              title="Supervsor"
              onPress={() => {
                props.navigation.navigate("super");
              }}
            />
          </View>
        </View>
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
  image: {
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
