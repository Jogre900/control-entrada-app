import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityBase,
} from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import { MainButton } from "../../components/mainButton.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainColor } from "../../assets/colors";
import { Ionicons } from "@expo/vector-icons";
import Input from "../../components/input.component";
import Modal from "react-native-modal";
import { API_PORT } from "../../config/index";
import moment from "moment";
import { Divider } from "../../components/Divider";

const adminId = "e6cf69f4-e718-4b5f-a127-c1910db5f162";

const inputProps = {
  textcolor: "grey",
  shape: "flat",
};
const CompanyScreen = ({ navigation, savedCompany, profile }) => {
  console.log("profile redux----", profile);
  const [data, setData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [rif, setRif] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [editVisible, setEditVisible] = useState(false);
  //GOBACK
  const goBackAction = () => {
    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableWithoutFeedback>
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

  const requestCompany = async () => {
    //setLoading(true);
    try {
      let res = await axios.get(`${API_PORT()}/api/findCompany/${profile.id}`);
      console.log("res.data: ", res.data);
      if (!res.data.error) {
        alert("busqueda exitosa");
        setData(res.data.data);
        //setCompanyId(res.data.data[0].id);
        //setLoading(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  //CREATE COMPANY
  const createCompany = async () => {
    setModalVisible(true);

    let data = {
      companyName,
      companyEmail,
      companyDni: rif,
    };
    try {
      let res = await axios.post(`${API_PORT()}/api/createCompany/`, data);
      !res.data.error && console.log(res.data);
      saveCompany(res.data.data);
      setModalVisible(false);
      setCompanyId(res.data.data.id);
      alert("Registro Exitoso!");
    } catch (error) {
      setModalVisible(false);
      alert(error.message);
    }
  };
  //UPDATE ADMIN
  const updateAdmin = async () => {
    try {
      let res = await axios.put(`${API_PORT()}/api/updateAdmin/${companyId}`, {
        id: profile.id,
      });
      if (!res.data.error) console.log(res.data);
      alert("actualizado");
    } catch (error) {
      console.log(error.message);
    }
  };
  // useEffect(() => {
  //   requestProfile()
  // }, [])
  useEffect(() => {
    requestCompany();
  }, []);

  useEffect(() => {
    updateAdmin();
  }, [companyId]);

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Registro de Empresa" leftControl={goBackAction()} />
      <View style={{ flex: 1 }}>
        {data ? (
          <View style={styles.container}>
            <View style={styles.dataContainer}>
              <Text style={styles.labelTitle}>Datos de la empresa</Text>
              <Divider size="small" />
              <Text>{data[0].name}</Text>
              <Text>{data[0].email}</Text>
              <Text>{data[0].dni}</Text>
              <Text>
                Registrada el: {moment(data[0].createAt).format("D MMM YYYY")}
              </Text>
            </View>
            <View style={styles.dataContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={styles.labelTitle}>Editar</Text>
                <TouchableOpacity onPress={() => setEditVisible(!editVisible)}>
                  <Ionicons name="md-create" size={22} color="grey" />
                </TouchableOpacity>
              </View>

              {editVisible && (
                <View>
                  <Divider size="small" />
                  <Input
                    title="Identificacion"
                    icon="md-card"
                    onChangeText={(value) => setRif(value)}
                    value={rif}
                    {...inputProps}
                  />
                  <Input
                    title="Correo"
                    icon="ios-mail"
                    onChangeText={(value) => setCompanyEmail(value)}
                    value={companyEmail}
                    {...inputProps}
                  />
                  <MainButton title="Guardar Cambios" />
                </View>
              )}
            </View>
          </View>
        ) : (
          <View>
            <Text>Datos de la Empresa</Text>
            <Input
              title="Nombre"
              onChangeText={(value) => setCompanyName(value)}
              value={companyName}
              {...inputProps}
            />
            <Input
              title="Identificacion"
              onChangeText={(value) => setRif(value)}
              value={rif}
              {...inputProps}
            />
            <Input
              title="Correo"
              onChangeText={(value) => setCompanyEmail(value)}
              value={companyEmail}
              {...inputProps}
            />
            <MainButton title="Crear" onPress={() => createCompany()} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    //alignContent: 'center',
  },
  dataContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
    width: "90%",
  },
  labelTitle: {
    fontSize: 16,
    lineHeight: 18,
    color: MainColor,
  },
});

const stateToProps = (state) => ({
  profile: state.profileReducer.profile,
  savedCompany: state.profileReducer.company
});

const dispatchToProps = (dispatch) => ({
  saveCompany(company) {
    dispatch({
      type: "setCompany",
      payload: company,
    });
  },
});

export default connect(stateToProps, dispatchToProps)(CompanyScreen);
