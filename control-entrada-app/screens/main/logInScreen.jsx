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
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";

//components
import { MainColor } from "../../assets/colors";
import Input from "../../components/input.component";
import { SplashScreen } from "../../components/splashScreen.component";
import { MainButton } from "../../components/mainButton.component";
import Modal from "react-native-modal";

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
  const [pass, setPass] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [passCaption, setPassCaption] = useState('')
  const [emailCaption, setEmailCaption] = useState('')
  const [isSplash, setIsSplash] = useState(true);

  const backHandler = useRef(null);
  const translate = new Animated.Value(1);
  const nextInput = useRef(null);

  const activeSplash = () => {
    setTimeout(() => {
      setIsSplash(false);
    }, 500);
  };
  //LOADING
  const LoadingModal = () => {
    return (
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(!modalVisible)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={MainColor} />
        </View>
      </Modal>
    );
  };
  //STORE TOKEN
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem("watchToken", value);
    } catch (e) {
      console.log("Error al Guardar", e);
    }
  };
  
  //VALIDAR EMAIL
  const validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
    };

  //SIGN IN
  const signIn = async () => {
    setModalVisible(true);
    if (!email || !pass) {
      setModalVisible(false);
      alert("Debe llenar los campos");
      return;
    }
      // }else{
    //   if(!validateEmail(email)){
    //     setModalVisible(false);
    //     setEmailCaption('Debe ingresar un correo valido')
    //     return;
    //   }
    // }
    try {
      let res = await axios.post(`${API_PORT}/api/login`, {
        email,
        password: pass,
      });
      if (res) {
        console.log("res----------",res.data)
        await storeData(res.data.token);
        let privilege = res.data.data.privilege;
        switch (privilege) {
          case "Vigilante":
          setModalVisible(false)  
          props.navigation.navigate("watch");
            break;
          case "Super":
            props.navigation.navigate("super");
            break;
          default:
            break;
        }
      }
    } catch (error) {
      setModalVisible(false);
      switch (error.response.status) {
        case 401:
        setPassCaption(error.response.data.msg)
        setPass('')  
        //alert(error.response.data.msg);
          break;
        case 404:
          alert(error.response.data.msg);
          break;
        default:
          break;
      }
    }
  };

  const signInStatus = async () => {
    let token = await AsyncStorage.getItem("wacthToken");
    console.log("token en el storage:---", token);
    if (token) {
      let res = await axios.get(`${API_PORT()}/api/verifyToken`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      if (res.data) {
        console.log(res.data);
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
    signInStatus();
  }, []);

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
                styleInput={{ color: "white" }}
                title="Correo"
                textColor="white"
                shape="round"
                alignText="center"
                keyboardType="email-address"
                returnKeyType="next"
                caption={emailCaption}
                onSubmitEditing={() => nextInput.current.focus()}
                onChangeText={(correo) => {
                  setEmail(correo), setEmailCaption('')
                }}
                value={email}
              />
              <Input
                styleInput={{ color: "white" }}
                title="Clave"
                textColor="white"
                shape="round"
                alignText="center"
                returnKeyType="done"
                secureTextEntry={true}
                caption={passCaption}
                onSubmitEditing={() => signIn()}
                onChangeText={(pass) => {
                  setPass(pass), setPassCaption('')
                }}
                value={pass}
                ref={nextInput}
              />

              <LoadingModal />

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
