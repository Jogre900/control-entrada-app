import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-community/picker";

//componentes
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import Input from "../../components/input.component.jsx";
import { MainButton } from "../../components/mainButton.component";

const DEVICE_WIDTH = Dimensions.get("window").width;

export const ZonasScreen = (props) => {
  const [zone, setZone] = useState([]);
  const [zoneName, setZoneName] = useState("");
  const [horaEntrada, setHoraEntrada] = useState(null);
  const [horaSalida, setHoraSalida] = useState(null);
  const [create, setCreate] = useState(false);
  const [company, setCompany] = useState([]);
  const [companyId, setCompanyId] = useState("algo");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const goBackAction = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
  };

  //LOADING
  const Splash = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="#ff7e00" />
      </View>
    );
  };

  //REGISTER
  const saveSuccess = () => {
    Alert.alert("Registro Exitoso!");
    setSuccess(false);
  };

  //CLEAR INPUTS
  const clearInputs = () => (
    setZoneName("")
  )

  const requestCompany = async () => {
    setLoading(true);
    try {
      let res = await axios.get(`${API_PORT()}/api/findCompany`);
      console.log("res.data: ", res.data);
      if (res.data.data) {
        setCompany(res.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const createZone = async () => {
    console.log("company id:----", companyId);
    setCreate(false);
    setSaving(true);
    try {
      let res = await axios.post(
        `${API_PORT()}/api/createZone/${companyId}`,
        {
          zone: zoneName,
        }
      );
      if (res) {
        console.log(res);
        setCreate(true);
        setSaving(false)
        setSuccess(true)
      }
    } catch (error) {
      console.log(error)
    }
  };

  const requestZone = async () => {
    let res = await axios.get(`${API_PORT()}/api/findZones`);
    setZone(res.data.data);
    console.log("zones:-------",res.data)
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableHighlight
        onPress={() =>
          props.navigation.navigate("zone_detail", {
            id: item.id,
            zone: item.zone,
            destinys: item.Destinos,
            watchmen: item.encargado_zona
          })
        }
        style={styles.zones}
      >
        <View>
          <Text>{item.zone}</Text>
          <Ionicons name="md-pin" size={28} color="grey" />
        </View>
      </TouchableHighlight>
    );
  };
  useEffect(() => {
    requestCompany();
  }, []);
  useEffect(() => {
    requestZone();
  }, [create]);
  return (
    <View>
      <TopNavigation title="Zonas" leftControl={goBackAction()} />
      <View>
        <View>
          {/* //company box */}
          <Text>Selecione Empresa:</Text>
          {loading ? (
            <Splash />
          ) : (
            <Picker
              mode="dropdown"
              selectedValue={companyId}
              onValueChange={(itemValue, itemIndex) =>
                setCompanyId(itemValue)}
            >
              <Picker.Item label="Java" value="java" />
  <Picker.Item label="JavaScript" value="js" />
              {/* {company.map((item) => (
                <Picker.Item label={item.name} value={item.id} key={item.id} />
              ))} */}
            </Picker>
          )}
        </View>
        <View>
          <Text>company ID: {companyId}</Text>
        </View>
        <View>
          <Text>Zonas:</Text>
          {zone && (
            <FlatList data={zone} renderItem={renderItem} numColumns={3} />
          )}
        </View>
        <Text>Crear Zona</Text>

        <Input
          style={{ borderColor: "black", marginBottom: 10 }}
          styleInput={{ color: "black" }}
          title="NombreZona"
          textColor="black"
          shape="square"
          alignText="center"
          returnKeyType="next"
          onChangeText={(nombre) => {
            setZoneName(nombre);
          }}
          value={zoneName}
        />
        <Input
          style={{ borderColor: "black", marginBottom: 10 }}
          styleInput={{ color: "black" }}
          title="Hora de entrada"
          textColor="black"
          shape="square"
          alignText="center"
          returnKeyType="next"
          onChangeText={(entrada) => {
            setHoraEntrada(entrada);
          }}
          value={horaEntrada}
        />
        <Input
          style={{ borderColor: "black", marginBottom: 10 }}
          styleInput={{ color: "black" }}
          title="Hora de salida"
          textColor="black"
          shape="square"
          alignText="center"
          returnKeyType="next"
          onChangeText={(salida) => {
            setHoraSalida(salida);
          }}
          value={horaSalida}
        />
        <MainButton
          title="Registrar Zona"
          onPress={() => {
            createZone();
          }}
        />
      </View>
      {saving ? <Splash /> : null}
      {success && saveSuccess()}
    </View>
  );
};

const styles = StyleSheet.create({
  zones: {
    borderWidth: 1,
    borderColor: "grey",
    borderStyle: "dotted",
    //backgroundColor: "pink",
    alignItems: "center",
    margin: 0.5,
    padding: 10,
    minWidth: Math.floor(DEVICE_WIDTH / 3),
  },
});
