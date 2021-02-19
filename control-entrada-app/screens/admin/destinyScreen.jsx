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
  ScrollView,
  Vibration,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import { API_PORT } from "../../config/index.js";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import { FloatingBotton } from "../../components/floatingBotton";
import { FormContainer } from "../../components/formContainer";
import { DestinyCard } from "../../components/destinyCard";
import { Header } from "../../components/header.component";

const DEVICE_WIDTH = Dimensions.get("window").width;

const DestinyScreen = ({ navigation, zonesRedux, company, saveDestiny }) => {
  console.log("zones in Destiny from redux---", zonesRedux);
  //console.log("company from redux---", company);
  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState(zonesRedux[0].id);
  const [create, setCreate] = useState(false);
  const [destinys, setDestinys] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [destinyName, setDestinyName] = useState();
  const [loading, setLoading] = useState(false);
  const [selectItem, setSeletedItem] = useState([]);

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
    setSeletedItem([]);
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
  const onLong = (id) => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      //  hideCheckMark();
      return;
    }
    Vibration.vibrate(100), setSeletedItem(selectItem.concat(id));
    //showCheckMark();
    //setChangeStyle(!changeStyle);
  };
  const clearList = () => setSeletedItem([]);

  const selectAll = () => {
    let array = [];
    destinys.map(({ id }) => array.push(id));
    console.log(array);
    setSeletedItem(array);
  };
  // useEffect(() => {
  //   requestZone();
  // }, []);
  useEffect(() => {
    requestDestiny();
  }, [zoneId, create]);

  useFocusEffect(
    React.useCallback(() => {
      //setZone([]);
      setSeletedItem([]);
    }, [])
  );

  return (
    <View style={{ flex: 1}}>
      {selectItem.length > 0 ? (
        <Header
          value={selectItem.length}
          clearAction={clearList}
          //deleteAction={() => deleteZones(selectItem)}
          selectAction={selectAll}
        />
      ) : (
        <TopNavigation title="Destinos" leftControl={goBackAction()} />
      )}
      <ScrollView contentContainerStyle={{alignItems:'center'}}>
        {loading ? (
          <Splash />
        ) : (
          <FormContainer title="Seleccione la Zona">
            {zonesRedux && (
              <Picker
                mode="dropdown"
                selectedValue={zoneId}
                onValueChange={(value) => {
                  setZoneId(value);
                }}
              >
                {zonesRedux.map((item, index) => {
                  return (
                    <Picker.Item
                      label={item.zone}
                      value={item.id}
                      key={index}
                    />
                  );
                })}
              </Picker>
            )}
          </FormContainer>
        )}
        <View>
          {destinys &&
            destinys.map((item, i) => (
              <TouchableOpacity
                key={i}
                onPress={selectItem.length > 0 ? () => onLong(item.id) : null}
                onLongPress={() => onLong(item.id)}
                delayLongPress={200}
              >
                <DestinyCard
                  data={item}
                  selected={selectItem.includes(item.id) ? true : false}
                />
              </TouchableOpacity>
            ))}
          {notFound && (
            <View>
              <Text>No hay Destinos disponibles</Text>
            </View>
          )}
        </View>
        {/* <View>
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
      </View> */}
      </ScrollView>
      <FloatingBotton />
    </View>
  );
};

const mapStateToProps = (state) => ({
  zonesRedux: state.zones.zones,
  company: state.profile.companySelect,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DestinyScreen);

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
