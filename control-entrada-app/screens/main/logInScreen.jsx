import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { connect } from 'react-redux'
import axios from "axios";
import { API_PORT } from "../../config/index";
import { TopNavigation } from "../../components/TopNavigation.component";
import { Divider } from "../../components/Divider";
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-community/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { MainColor } from "../../assets/colors";

const LoginScreen = ({ navigation, saveProfile, saveCompany }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [passCaption, setPassCaption] = useState("");
  const [emailCaption, setEmailCaption] = useState("");
  const nextInput = useRef(null);
  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
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
      await AsyncStorage.setItem("userToken", value);
    } catch (e) {
      console.log("Error al Guardar", e);
    }
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
      let res = await axios.post(`${API_PORT()}/api/login`, {
        email,
        password: pass,
      });
      if (res) {
        console.log("res----------", res.data);
        await storeData(res.data.token);
        let profile = res.data.data;
        let company = res.data.data.Company
        await saveProfile(profile)
        await saveCompany(company)
        let privilege = res.data.data.privilege;
        switch (privilege) {
          case "Watchman":
            setModalVisible(false);
            navigation.navigate("watch", {
              screen: "watch-home",
            });
            break;
          case "Admin":
            setModalVisible(false);
            navigation.navigate("admin");
            break;
          default:
            break;
        }
      }
    } catch (error) {
      setModalVisible(false);
      alert(error.message);
      // console.log(error.response.data.msg);
      // switch (error.response.status) {
      //   case 401:
      //     setPassCaption(error.response.data.msg);
      //     setPass("");
      //     //alert(error.response.data.msg);
      //     break;
      //   case 404:
      //     setEmailCaption(error.response.data.msg);
      //     //alert(error.response.data.msg);
      //     break;
      //   default:
      //     break;
      // }
    }
  };
  return (
    <View style={{flex: 1}}>
      <TopNavigation title="Inicio" leftControl={goBackAction()} />
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={styles.buttonContainer}>
          <Text style={styles.labelTitle}>Porfavor ingrese sus datos de usuario</Text>
          <Divider size="small"/>
        <View style={styles.subContainer}>
        <Input
          //styleInput={{ color: "white" }}
          icon="ios-mail"
          title="Correo"
          textColor="grey"
          shape="flat"
          keyboardType="email-address"
          returnKeyType="next"
          caption={emailCaption}
          onSubmitEditing={() => nextInput.current.focus()}
          onChangeText={(correo) => {
            setEmail(correo), setEmailCaption("");
          }}
          value={email}
        />
        <Input
          //styleInput={{ color: "white" }}
          icon="ios-lock"
          title="Clave"
          textColor="grey"
          shape="flat"
          returnKeyType="done"
          secureTextEntry={true}
          caption={passCaption}
          onSubmitEditing={() => signIn()}
          onChangeText={(pass) => {
            setPass(pass), setPassCaption("");
          }}
          value={pass}
          ref={nextInput}
        />
        </View>
        
        <View style={styles.subContainer}>
        <MainButton
          title="Iniciar Sesion"
          onPress={() => {
            signIn();
          }}
        />
        </View>
        <Divider size="small"/>
        <View style={styles.forgetcontainer}>
          <Text>Olvidaste tu contraseña?</Text>
          <TouchableOpacity onPress={() => alert("recuperar contraseña")}>
          <Text style={{color: MainColor}}> Recuperar</Text>
        </TouchableOpacity>
        </View>
        </View>
        <LoadingModal />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
  },
  subContainer: {
    marginVertical: 10
  },
  labelTitle: {
    fontSize: 16,
    lineHeight: 18,
    color: MainColor
  },
  forgetcontainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
const mapStateToProps = () => {
  return {}
}

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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)