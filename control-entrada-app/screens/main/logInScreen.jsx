import React, { useEffect, useRef, useState } from "react";
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
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

//components
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";
import { SplashScreen } from "../../components/splashScreen.component";
import firebase from "../../lib/firebase";
//constants
import { mainColor } from "../../constants/Colors";

const API_PORT = "http://192.168.10.107:8000";
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
  const [email, setEmail] = useState();
  const [pass, setPass] = useState();

  const [isSplash, setIsSplash] = useState(true);

  const backHandler = useRef(null);
  const translate = new Animated.Value(1);
  const nextInput = useRef(null);

  const activeSplash = () => {
    setTimeout(() => {
      setIsSplash(false);
    }, 500);
  };

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("watchToken", value);
    } catch (e) {
      console.log("Error al Guardar", e);
    }
  };
  const signIn = async () => {
    console.log(email, pass);
    let data = await axios.post(`${API_PORT}/api/login`, {
      email: email,
      password: pass,
    });
    console.log("algo", data.data);
    if (data) {
      let privilege = data.data.data.privilege;
      switch (privilege) {
        case "Vigilante":
          props.navigation.navigate("watch");
          break;
        case "Super":
          props.navigation.navigate("super");
          break;
        default:
          break;
      }
      //if(data.data.data.privilege === 'Admin') props.navigation.navigate("super")
      storeData(data.data.token);
    }
    //props.navigation.navigate("watch")
  };

  const signInStatus = async () => {
    let token = await AsyncStorage.getItem("wacthToken")
    console.log("token en el storage:---", token)
    if(token){
      let res = await axios.get(`${API_PORT()}/api/verifyToken`, { headers: {
        'Authorization': `bearer ${token}`
      }})
      if(res.data){
        console.log(res.data)
      }
    }
  };

  useEffect(() => {
    activeSplash();
    // backHandler.current = BackHandler.addEventListener("hardwareBackPress", backAction);
    // return () => {
    //   backHandler.current.remove()
    //BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  useEffect(() => {
    signInStatus()
  }, [])

  if (isSplash) {
    return <SplashScreen />;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/background.jpg")}
        style={styles.imageBackground}
      >
        <StatusBar hidden={true} />

        <TouchableWithoutFeedback
          style={styles.backCover}
          onPress={() => Keyboard.dismiss()}
        >
          <KeyboardAvoidingView style={styles.backCover} behavior="padding">
            <Image
              style={styles.logo}
              source={require("../../assets/images/security-logo.png")}
            />
            <View style={styles.buttonBox}>
              <Input
                style={{ borderColor: "#ff7e00", marginBottom: 10 }}
                styleInput={{ color: "white" }}
                title="Correo"
                textColor="white"
                shape="round"
                alignText="center"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => nextInput.current.focus()}
                onChangeText={(correo) => {
                  setEmail(correo);
                }}
                value={email}
              />
              <Input
                style={{ borderColor: "#ff7e00", marginBottom: 10 }}
                styleInput={{ color: "white" }}
                title="Clave"
                textColor="white"
                shape="round"
                alignText="center"
                returnKeyType="go"
                secureTextEntry={true}
                onChangeText={(pass) => {
                  setPass(pass);
                }}
                value={pass}
                ref={nextInput}
              />
              <MainButton
                title="Iniciar Sesion"
                onPress={() => {
                  signIn();
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
