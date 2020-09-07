import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Dimensions,
  FlatList,
  StyleSheet,
} from "react-native";
//import  {Picker} from '@react-native-community/picker'
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
//import SelectBox from 'react-native-multi-selectbox'
//import RNPickerSelect from 'react-native-picker-select';

//componentes
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component.js";
import Input from "../../components/input.component.js";
import { MainButton } from "../../components/mainButton.component";

const DEVICE_WIDTH = Dimensions.get("window").width;

export const ZonasScreen = (props) => {
  const [zone, setZone] = useState([]);
  const [zoneName, setZoneName] = useState("");
  const [horaEntrada, setHoraEntrada] = useState(null);
  const [horaSalida, setHoraSalida] = useState(null);
  const [create, setCreate] = useState(false);
  const [company, setCompany] = useState([]);
  const [id, setid] = useState("27c4c838-1d59-4125-8459-c62a0a28e634");

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

  const requestCompany = async () => {
    let res = await axios.get(`${API_PORT()}/api/findCompany`);
    let company = res.data.data;
    let result = company.map((el, i) => {
      return [el.id, el.name];
    });
    //console.log(result);
  };

  const createZone = async () => {
    setCreate(false);
    if (zoneName) {
      let res = await axios.post(`${API_PORT()}/api/createZone/${id}`, {
        zone: zoneName,
      });
      if (res) setCreate(true);
      console.log("crear zona", res.data);
    }
  };

  const requestZone = async () => {
    let res = await axios.get(`${API_PORT()}/api/findZones`, null);
    //console.log("find Zone:", res.data.data)
    console.log(DEVICE_WIDTH);
    setZone(res.data.data);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.zones}>
        <Text>{item.zone}</Text>
        <Ionicons name="md-pin" size={28} color="grey" />
      </View>
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
        <View style={{ flexDirection: "row", maxWidth: 360 }}>
          {
            
            zone && (
              <FlatList
                //style={{backgroundColor: 'blue'}}
                data={zone}
                renderItem={renderItem}
                numColumns={3}
              />
            )
            
          }
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
    minWidth: Math.floor(DEVICE_WIDTH / 3)
  },
});
