import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import { API_PORT } from "../../config/index";
import { TopNavigation } from "../../components/TopNavigation.component";
import { Divider } from "../../components/Divider";
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";

import { Ionicons } from "@expo/vector-icons";
import { MainColor, Danger } from "../../assets/colors";
import { LoadingModal } from "../../components/loadingModal";
import { login } from "../../helpers/";
import { FormContainer } from "../../components/formContainer";
import { RecoverPassModal } from "../../components/recoverPassModal";
import { StatusModal } from "../../components/statusModal";
import { storage } from "../../helpers/asyncStorage";

let passModalValues = {
  visible: false,
  onClose: false,
};

let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};

const LoginScreen = ({
  navigation,
  saveProfile,
  saveCompany,
  saveLogin,
  savePrivilege,
}) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [caption, setCaption] = useState("");
  const [emailCaption, setEmailCaption] = useState("");
  const [passCaption, setPassCaption] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [passModal, setPassModal] = useState(passModalValues);
  const [modalProps, setModalProps] = useState(statusModalValues);

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

  //SIGN IN
  const signIn = async () => {
    setModalVisible(true);
    setCaption("");
    if (!email || !pass) {
      setModalVisible(false);
      setCaption("Debe llenar los campos");
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
      const res = await login(email, pass);
      if (!res.data.error) {
        let slogin = {
          token: res.data.token,
          userId: res.data.data.id,
        };

        let sprofile = {
          id: res.data.data.Employee.id,
          dni: res.data.data.Employee.dni,
          name: res.data.data.Employee.name,
          lastName: res.data.data.Employee.lastName,
          picture: res.data.data.Employee.picture,
          email: res.data.data.email,
        };
        if (res.data.data.userZone.length > 0) {
          sprofile.userZone = res.data.data.userZone;
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
        let privilege = res.data.data.UserCompany[0].privilege;
        let token = res.data.token;
        // await storage.removeItem("userToken", res.data.token);
        await storage.setItem("userToken", token);

        if (res.data.data.UserCompany.length > 1) {
          setModalVisible(false);
          navigation.navigate(); //TODO modal para seleccionar company
          //TODO enviar res.data.data.UserCompany como parametro
        }
        saveLogin(slogin);
        saveProfile(sprofile);
        saveCompany(company);
        savePrivilege(privilege);
        switch (privilege) {
          case "Watchman":
            setModalVisible(false);
            navigation.navigate("watch", {
              screen: "watch-home",
            });
            break;
          case "Admin":
          case "Supervisor":
            setModalVisible(false);
            navigation.navigate("admin");
            break;
          default:
            break;
        }
      }else{
        setModalVisible(false);
        setCaption(res.data.msg)
      }
    } catch (error) {
      setModalVisible(false);
      setCaption(error.message);
    }
  };

  //CHECKPASS
  const checkNewPass = (status, message) => {
    if (status) {
      setModalProps((values) => ({
        ...values,
        visible: true,
        status: false,
        message,
      }));
    } else {
      setModalProps((values) => ({
        ...values,
        visible: true,
        status: true,
        message,
      }));
      setPassModal((values) => ({ ...values, visible: false }));
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Inicio" leftControl={goBackAction()} />
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <FormContainer title="Ingrese Datos de Usuario">
          <View style={styles.subContainer}>
            <Input
              //styleInput={{ color: "white" }}
              icon="ios-mail"
              title="Correo"
              shape="flat"
              keyboardType="email-address"
              returnKeyType="next"
              caption={emailCaption}
              onSubmitEditing={() => nextInput.current.focus()}
              onChangeText={(correo) => {
                setEmail(correo), setEmailCaption(""), setCaption("");
              }}
              value={email}
            />
            <Input
              //styleInput={{ color: "white" }}
              icon="ios-lock"
              title="Clave"
              shape="flat"
              returnKeyType="done"
              secureTextEntry={true}
              caption={passCaption}
              onSubmitEditing={() => signIn()}
              onChangeText={(pass) => {
                setPass(pass), setPassCaption(""), setCaption("");
              }}
              value={pass}
              ref={nextInput}
            />
          </View>
          <View>
            <Text
              style={{
                color: Danger,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              {caption}
            </Text>
          </View>

          <MainButton
            style={{ marginTop: 20, marginBottom: 5 }}
            title="Iniciar Sesion"
            onPress={() => {
              signIn();
            }}
          />

          <Divider size="small" />
          <View style={styles.forgetcontainer}>
            <Text>Olvidaste tu contraseña?</Text>
            <TouchableOpacity
              onPress={() =>
                setPassModal((values) => ({ ...values, visible: true }))
              }
            >
              <Text style={{ color: MainColor }}> Recuperar</Text>
            </TouchableOpacity>
          </View>
        </FormContainer>
        <RecoverPassModal
          visible={passModal.visible}
          onClose={() =>
            setPassModal((values) => ({ ...values, visible: false }))
          }
          checkNewPass={checkNewPass}
        />
        <LoadingModal status={modalVisible} message="Iniciando Sesión.." />
        <StatusModal
          onClose={() =>
            setModalProps((values) => ({ ...values, visible: false }))
          }
          {...modalProps}
        />
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
    //marginVertical: 5,
    //backgroundColor: 'pink'
  },
  labelTitle: {
    fontSize: 16,
    lineHeight: 18,
    color: MainColor,
  },
  forgetcontainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});
const mapStateToProps = (state) => {
  return {};
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
  saveLogin(login) {
    dispatch({
      type: "SET_LOGIN",
      payload: login,
    });
  },
  savePrivilege(privilege) {
    dispatch({
      type: "SAVE_PRIVILEGE",
      payload: privilege,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
