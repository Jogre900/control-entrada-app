import React, { useState } from "react";
import { FormContainer } from "./formContainer";
import Input from "./input.component";
import { MainButton } from "./mainButton.component";
import { API_PORT } from "../config/index";
import axios from "axios";
import Modal from "react-native-modal";
import { LoadingModal } from './loadingModal'

export const SearchVisitModal = ({ status, search, onClose}) => {
  const [dni, setDni] = useState()
  const [dniVisit, setDniVisit] = useState()
  const [loading, setLoading] = useState(false);

  
  const requestVisit = async () => {
    setLoading(true)
    if (!dni) {
        setLoading(false)
        Alert.alert("Debe ingresar un DNI valido.");
    } else {
      try {
        let res = await axios.get(`${API_PORT()}/api/findVisit/${dni}`);
        console.log("busqueda por dni:----- ", res.data);
        if (!res.data.error) {
            setLoading(false)

          
          //console.log("Visitas//----", res.data.data.Visitas[0]);
        }else{
            setLoading(false)
            alert(res.data.msg)
        }
      } catch (error) {
        setLoading(false)
        console.log(error.message);
      }
    }
  };
  
  //CREATE DESTINY
  const createDestiny = async () => {
    setLoading(true);
    create(false);
    try {
      let res = await axios.post(`${API_PORT()}/api/createDestiny/${zoneId}`, {
        name: destinyName,
      });
      if (!res.data.error) {
        console.log(res.data.data);
        setDestinyName("");
        setLoading(false);
        create(true);
        onClose();
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
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
      onBackdropPress={onClose}
      animationOut="fadeOutDown"
      animationOutTiming={300}
      style={{
        //backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormContainer style={{ padding: 20, elevation: 0 }} title="Busqueda por dni">
        <Input
          style={{ borderColor: "black", marginBottom: 10 }}
          styleInput={{ color: "black" }}
          title="dni"
          shape="square"
          icon="ios-card"
          returnKeyType="search"
          returnKeyType='search'
          onSubmitEditing={() => requestVisit()}
          onChangeText={(valor) => setDni(valor)}
            value={dni}
        />
        <MainButton
          title="Buscar"
          onPress={() => {
            alert("Hola");
          }}
        />
      </FormContainer>
      <LoadingModal status={loading} message="Buscando..." />
    </Modal>
  );
};
