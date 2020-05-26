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
      ]),
    ).start();
    // backHandler.current = BackHandler.addEventListener("hardwareBackPress", backAction);
    // return () => {
    //   backHandler.current.remove()
    //BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);
  const paramsHome = {
    props: props,
    title: "Iniciar Sesion",
    route: "Home",
    navigate: true,
  };

  const paramsSuper = {
    props: props,
    title: "Supervisor",
    route: "super",
    navigate: true,
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Animated.Image
        style={[
          styles.image,
          {
            transform: [{ scale: translate }],
          },
        ]}
        source={require("../../assets/images/female-3.jpg")}
      />
      <View style={styles.buttonBox}>
        <Input title="Usuario" shape="round" alignText="center" />
        <Input title="Clave" shape="round" alignText="center" />
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
  },
  buttonBox: {
    marginBottom: "10%",
    width: "75%",
    //position: "absolute",
  },
  input: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 10,
    height: 40,
  },
  image: {
    resizeMode: "cover",
    width: 120,
    height: 120,
  },
});
