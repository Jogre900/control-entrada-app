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
import { connect } from 'react-redux'
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from '@react-navigation/native';

//components
import { MainColor } from "../../assets/colors";
import { SplashScreen } from "../../components/splashScreen.component";
import { MainButton } from "../../components/mainButton.component";
import Modal from "react-native-modal";
import { API_PORT } from "../../config/index";

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

const MainScreen = ({navigation, saveProfile, saveCompany}) => {

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [passCaption, setPassCaption] = useState("");
  const [emailCaption, setEmailCaption] = useState("");
  const [isSplash, setIsSplash] = useState(true);
  const [payload, setPayload] = useState();

  const backHandler = useRef(null);
  const translate = new Animated.Value(1);
  

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
  

  //VALIDAR EMAIL
  const validateEmail = (email) => {
    var re = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  

  const signInStatus = async () => {
    let token = await AsyncStorage.getItem("userToken");
    if (token) {
      setModalVisible(true);
      try {
        let res = await axios.get(`${API_PORT()}/api/verifyToken`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        console.log(res.data);
        if (res.data.error && res.data.msg === "jwt expired") {
          alert("token expiro!");
          setModalVisible(false);
          return;
        }
        if (!res.data.error) {
          let profile = res.data.data;
          let company = res.data.data.Company
          await saveCompany(company)
          await saveProfile(profile)
          console.log(profile);
          setModalVisible(false);
          switch (res.data.data.privilege) {
            case "Admin":
              navigation.navigate("admin", { screen: "admin-home" });
              break;
            case "Supervisor":
              navigation.navigate("super");
              break;
            case "Watch":
              navigation.navigate("watch");
              break;
            default:
              break;
          }
        }
      } catch (error) {
        setModalVisible(false);
        alert(error.message);
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

  useFocusEffect(() => {
      return console.log("is Focused")

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
              

              <LoadingModal />

              <MainButton
                title="Ingresar"
                style={styles.input}
                onPress={() => {
                  navigation.navigate("LogIn");
                }}
              />
              <MainButton
                title="Registrate"
                style={styles.input}
                onPress={() => {
                  navigation.navigate("register");
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
  input: {
    marginVertical: 2.5
  }  
});

const mapDispatchToProps = dispatch => ({
  saveProfile(profile){
    dispatch({
      type: "setProfile",
      payload: profile
    })
  },
  saveCompany(company){
    dispatch({
      type: "setCompany",
      payload: company
    })
  }
})
export default connect(null, mapDispatchToProps)(MainScreen)