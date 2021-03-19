import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FormContainer } from "./formContainer";
import Input from "./input.component";
import { MainButton } from "./mainButton.component";
import { API_PORT } from "../config/index";
import { Danger, Success } from "../assets/colors";
import axios from "axios";
import Modal from "react-native-modal";
import { LoadingModal } from "./loadingModal";
import { recoverPass } from "../helpers";
import { validateEmail, validatePass } from "../helpers/forms";

let passwordValues = {
  email: "",
  pass: "",
  repPass: "",
};
let captionInitialValues = {
  email: null,
  passwword: null,
  repPass: null,
};

export const RecoverPassModal = ({ visible, onClose, checkNewPass }) => {
  const [recoverForm, setRecoverForm] = useState(passwordValues);
  const [loading, setLoading] = useState(false);
  const [captionValues, setCaptionValues] = useState(captionInitialValues);
  const [passEqual, setPassEqual] = useState(false);
  const [caption, setCaption] = useState("");

  const validateForm = (data) => {
    const emailError = validateEmail(data.email);
    const passError = validatePass(data.pass);
    const repPassError = validatePass(data.repPass);
    if (emailError || passError || repPassError) {
      setCaptionValues((values) => ({
        ...values,
        email: emailError,
        passwword: passError,
        repPass: repPassError,
      }));
      return true;
    }
  };

  const recoverPassword = async () => {
    if (validateForm(recoverForm)) return;

    const { email, pass, repPass } = recoverForm;

    if (pass !== repPass) {
      setCaption("Ambas claves deben ser iguales");
      return;
    }
    const res = await recoverPass(email, repPass);
    checkNewPass(res.error, res.msg);
  };

  useEffect(() => {
    if (recoverForm.pass.length && recoverForm.repPass.length) {
      if (recoverForm.pass === recoverForm.repPass) {
        setPassEqual(true);
        setCaption('')
      } else setPassEqual(false);
    }else setPassEqual(false);
  }, [recoverForm.pass, recoverForm.repPass]);
  
  return (
    <Modal
      isVisible={visible}
      backdropColor="black"
      hasBackdrop={true}
      useNativeDriver={true}
      animationIn="fadeInUp"
      animationInTiming={300}
      onBackdropPress={onClose}
      animationOut="fadeOutDown"
      animationOutTiming={300}
      style={{
        //backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormContainer
        style={{ padding: 20, elevation: 0 }}
        title="Ingrese su nueva clave"
      >
        <Input
          shape='flat'
          title="Correo"
          icon="ios-mail"
          returnKeyType="next"
          onChangeText={(email) => {
            setRecoverForm((values) => ({ ...values, email })), setCaptionValues(values => ({
              ...values, email:''
            }))
          }}
          caption={captionValues.email}
        />
        <Input
          title="Clave"
          style={{borderColor: passEqual ? Success : '#8e8e8e'}}
          shape='flat'
          secureTextEntry={true}
          returnKeyType="next"
          onChangeText={(pass) => {
            setRecoverForm((values) => ({ ...values, pass })), setCaptionValues(values => ({
              ...values, passwword:''
            }))
          }}
          caption={captionValues.passwword}
        />
        <Input
          title="Repetir clave"
          style={{borderColor: passEqual ? Success : '#8e8e8e'}}
          shape='flat'
          secureTextEntry={true}
          returnKeyType="next"
          onChangeText={(repPass) => {
            setRecoverForm((values) => ({ ...values, repPass })), setCaptionValues(values => ({
              ...values, repPass:''
            }))
          }}
          caption={captionValues.repPass}
        />
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
          style={{ marginTop: 20 }}
          title="Restableecer Clave"
          onPress={recoverPassword}
        />
      </FormContainer>
      <LoadingModal visible={loading} message="Guardando..." />
    </Modal>
  );
};

const styles = StyleSheet.create({
  caption: {},
});
