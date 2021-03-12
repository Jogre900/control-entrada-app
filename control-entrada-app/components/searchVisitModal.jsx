import React, { useState } from "react";
import { FormContainer } from "./formContainer";
import Input from "./input.component";
import { MainButton } from "./mainButton.component";
import Modal from "react-native-modal";
import { LoadingModal } from "./loadingModal";
import { helpers } from "../helpers";
import { storage } from "../helpers/asyncStorage";

export const SearchVisitModal = ({ status, search, onClose }) => {
  const [dni, setDni] = useState();
  const [dniVisit, setDniVisit] = useState();
  const [loading, setLoading] = useState(false);

  const requestVisit = async () => {
    setLoading(true);
    if (!dni) {
      setLoading(false);
      Alert.alert("Debe ingresar un DNI valido.");
    } else {
      const token = await storage.getItem("userToken");
      const res = await helpers.findVisitdni(dni, token);
      if (!res.data.error && res.data.data.length) {
        setDni('')
        search(res.data.data, true, res.data.msg);
        setLoading(false);
      } else {
        setLoading(false);
        search(res.data.data, false, res.data.msg);
      }
    }
  };

  return (
    <Modal
      isVisible={status}
      backdropColor="black"
      hasBackdrop={true}
      useNativeDriver={true}
      animationIn="fadeInUp"
      animationInTiming={300}
      onBackdropPress={() => {onClose(), setDni('')}}
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
        title="Busqueda por dni"
      >
        <Input
          style={{ borderColor: "black", marginBottom: 10 }}
          styleInput={{ color: "black" }}
          title="dni"
          shape="square"
          icon="ios-card"
          returnKeyType="search"
          returnKeyType="search"
          onSubmitEditing={() => requestVisit()}
          onChangeText={(valor) => setDni(valor)}
          value={dni}
        />
        <MainButton title="Buscar" onPress={requestVisit} />
      </FormContainer>
      <LoadingModal status={loading} message="Buscando..." />
    </Modal>
  );
};
