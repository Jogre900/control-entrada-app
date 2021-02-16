import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { connect } from "react-redux";

import axios from "axios";
import { API_PORT } from "../../config/index.js";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";

const DEVICE_WIDTH = Dimensions.get("window").width;

const SuperDestinyScreen = ({ navigation, zonesRedux, company, saveDestiny }) => {
  console.log("zones in Destiny from redux---", zonesRedux);
  //console.log("company from redux---", company);
  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState(zonesRedux.id);
  const [create, setCreate] = useState(false);
  const [destinys, setDestinys] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [destinyName, setDestinyName] = useState();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [succes, setSuccess] = useState(false);

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
  const Splash = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="#ff7e00" />
      </View>
    );
  };

  //REGISTRO
  const saveSuccess = () => {
    Alert.alert("Registro Exitoso!");
    setSuccess(false);
  };

  const requestZone = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      let res = await axios.get(`${API_PORT()}/api/findZones/${companyId}`);
      if (!res.data.error) {
        setZones(res.data.data);
        setZoneId(res.data.data[0].id);
        setLoading(false);
      }
    } catch (error) {
      console.log("error: ", error.message);
    }
  };
  const requestDestiny = async () => {
    try {
      let res = await axios.get(`${API_PORT()}/api/findDestiny/${zoneId}`);
      console.log("DESTINY FORM API----", res.data);
      if (res.data.data.length >= 1) {
        setDestinys(res.data.data);
        setNotFound(false);
      } else {
        setNotFound(true);
        setDestinys([]);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.destiny}>
        <Text>{item.name}</Text>
        <Ionicons name="md-pin" size={28} color="grey" />
      </View>
    );
  };
  //CREATE DESTINY
  const createDestiny = async () => {
    setSaving(true);
    setCreate(false);
    setSuccess(false);
    try {
      let res = await axios.post(`${API_PORT()}/api/createDestiny/${zoneId}`, {
        name: destinyName,
      });
      if (!res.data.error) {
        setCreate(true);
        setDestinyName("");
        saveDestiny(res.data.data);
        setSaving(false);
        setSuccess(true);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  // useEffect(() => {
  //   requestZone();
  // }, []);
  useEffect(() => {
    requestDestiny();
  }, [zoneId, create]);

  return (
    <View>
      <TopNavigation title="Destinos" leftControl={goBackAction()} />
      <View>
        <Text>Selecione la Zona:</Text>
        {loading ? (
          <Splash />
        ) : //   zonesRedux && (
        //     <Picker
        //       mode="dropdown"
        //       selectedValue={zoneId}
        //       onValueChange={(value) => {
        //         setZoneId(value);
        //       }}
        //     >
        //       {zonesRedux.map((item, index) => {
        //         return (
        //           <Picker.Item label={item.zone} value={item.id} key={index} />
        //         );
        //       })}
        //     </Picker>
        null}
      </View>
      <View>
        <Text>zone id: {zoneId}</Text>
        <Text>Destinos</Text>
        {destinys && (
          <FlatList data={destinys} renderItem={renderItem} numColumns={3} />
        )}
        {notFound && (
          <View>
            <Text>No hay Destinos disponibles</Text>
          </View>
        )}
      </View>
      <View>
        <Text>Crear Destino</Text>

        <Input
          style={{ borderColor: "black", marginBottom: 10 }}
          styleInput={{ color: "black" }}
          title="Destino"
          textColor="black"
          shape="square"
          alignText="center"
          returnKeyType="next"
          onChangeText={(nombre) => {
            setDestinyName(nombre);
          }}
          value={destinyName}
        />
        <MainButton
          title="Crear Destino"
          onPress={() => {
            createDestiny();
          }}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  zonesRedux: state.zones.zones,
  company: state.profile.companySelect,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SuperDestinyScreen);

const styles = StyleSheet.create({
  destiny: {
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
