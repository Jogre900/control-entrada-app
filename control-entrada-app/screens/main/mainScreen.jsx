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
import { connect, useDispatch } from "react-redux";
import axios from "axios";
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/native";

//components
import { MainColor } from "../../assets/colors";
import { SplashScreen } from "../../components/splashScreen.component";
import { MainButton } from "../../components/mainButton.component";
import Modal from "react-native-modal";
import { API_PORT } from "../../config/index";
import { storage } from "../../helpers/asyncStorage";

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

const MainScreen = ({ navigation, saveProfile, saveCompany, saveLogin, route, isToken, token, privilege }) => {
  const dispatch = useDispatch()
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
      <Modal isVisible={modalVisible} onBackdropPress={() => setModalVisible(!modalVisible)}>
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
    const token = await storage.getItem("userToken")
    if (token) {
      alert("Hay token en!!!")
      //console.log("token----",token)
      //console.log("isToken--------",isToken)
      setModalVisible(true);
      try {
        //TODO verificar esta ruta en la api para que de la estructura nueva
        let res = await axios.get(`${API_PORT()}/api/verifyToken`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        console.log(res.data)
        //console.log("RES DE TOKEN----", res.data.data.UserCompany[0].privilege)
        if (res.data.error && res.data.msg === "jwt expired") {
          alert("token expiro!");
          setModalVisible(false);
          return;
        }
        if (!res.data.error) {
          let slogin = {
            token: res.data.token,
            userId: res.data.data.id,
            privilege: res.data.data.UserCompany[0].privilege
          };
          let sprofile = {
            id: res.data.data.Employee.id,
            dni: res.data.data.Employee.dni,
            name: res.data.data.Employee.name,
            lastName: res.data.data.Employee.lastName,
            picture: res.data.data.Employee.picture,
            email: res.data.data.email,
          };
          if(res.data.data.userZone.length > 0){
            sprofile.userZone = res.data.data.userZone
          }
          let company = [];
          res.data.data.UserCompany.map((comp) => {
            company.push({
              id: comp.Company.id,
              companyName: comp.Company.companyName,
              businessName: comp.Company.businessName,
              nic: comp.Company.nic,
              city: comp.Company.city,
              address: comp.Company.address,
              phoneNumber: comp.Company.phoneNumber,
              phoneNumberOther: comp.Company.phoneNumberOther,
              logo: comp.Company.logo,
              privilege: comp.privilege,
              select: true,
            });
          });
  
          saveLogin(slogin);
          saveProfile(sprofile);
          saveCompany(company);
          setModalVisible(false);
          switch (res.data.data.UserCompany[0].privilege) {
            case "Admin":
              navigation.navigate("admin", { screen: "admin-home" });
            case "Supervisor":
              navigation.navigate("admin", { screen: "admin-home" });
              break;
            case "Watchman":
              navigation.navigate("watch", { screen: "watch-home" });
              break;
            default:
              break;
          }
        }
      } catch (error) {
        setModalVisible(false);
        alert(error.message);
      }
    } else alert("No hay token almacenado");
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

  useEffect(() => {
    if(route.params?.logOut){
      dispatch({type: 'CLEAR_STORAGE'})
    }
  }, [route.params?.logOut])

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
    marginVertical: 2.5,
  },
});

const mapStateToProps = (state) => {
  return {
    isToken: state.profile,
    //token: state.profile?.login.token,
    //privilege: state.profile.login.privilege,
  };
};

const mapDispatchToProps = (dispatch) => ({
  saveProfile(profile) {
    dispatch({
      type: "SAVE_PROFILE",
      payload: profile,
    });
  },
  saveCompany(company) {
    dispatch({
      type: "SAVE_COMPANY",
      payload: company,
    });
  },
  saveLogin(login){
    dispatch({
      type: 'SET_LOGIN',
      payload: login
    })
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
