import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { FormContainer } from "./formContainer";
import Input from "./input.component";
import { MainButton } from "./mainButton.component";
import { API_PORT } from "../config/index";
import { Danger } from "../assets/colors";
import axios from "axios";
import Modal from "react-native-modal";
import { LoadingModal } from "./loadingModal";
import { recoverPass } from "../helpers";

let passwordValues = {
  email: "",
  pass: "",
  passRep: "",
};

export const RecoverPassModal = ({ visible, onClose, checkNewPass }) => {
  const [recoverForm, setRecoverForm] = useState(passwordValues);
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState("");

  const recoverPassword = async () => {
    const { email, pass, passRep } = recoverForm;
    
    if (pass !== passRep) {
      setCaption("Ambas claves deben ser iguales");
      return;
    }
    const res = await recoverPass(email, passRep);
    checkNewPass(res.error, res.msg)
  };
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
          title="Correo"
          icon='ios-mail'
          returnKeyType="next"
          onChangeText={(email) => {
            setRecoverForm((values) => ({ ...values, email }));
          }}
        />
        <Input
          title="Clave"
          secureTextEntry={true}
          returnKeyType="next"
          onChangeText={(pass) => {
            setRecoverForm((values) => ({ ...values, pass }));
          }}
        />
        <Input
          title="Repetir clave"
          secureTextEntry={true}
          //alignText="center"
          returnKeyType="next"
          onChangeText={(passRep) => {
            setRecoverForm((values) => ({ ...values, passRep }));
          }}
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
      <LoadingModal status={loading} message="Guardando..." />
    </Modal>
  );
};

const styles = StyleSheet.create({
  caption: {},
});
