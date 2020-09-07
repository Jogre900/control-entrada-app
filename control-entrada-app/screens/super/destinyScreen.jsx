import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-community/picker";
//import RNPickerSelect from 'react-native-picker-select'

import axios from "axios";
import {API_PORT} from "../../config/index.js";
import Input from "../../components/input.component";
import {TopNavigation} from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";

const DEVICE_WIDTH = Dimensions.get("screen").width;

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

export const DestinyScreen = () => {
  const [zones, setZones] = useState([]);
  const [zoneId, setZoneId] = useState("");
  const [create, setCreate] = useState(false);
  const [destinys, setDestinys] = useState([]);
  const [destinyName, setDestinyName] = useState();

  const requestZone = async () => {
    let res = await axios.get(`${API_PORT()}/api/findZones`);
    setZones(res.data.data);
  };
  const requestDestiny = async () => {
    let res = await axios.get(`${API_PORT()}/api/findDestiny/`);
    setDestinys(res.data.data);
  };

  const renderItem = ({ item }) => (
    <View style={styles.destiny}>
      <Text>{item.name}</Text>
      <Ionicons name="md-pin" size={28} color="grey" />
    </View>
  );

  const createDestiny = async () => {
    setCreate(false);
    try {
      let res = axios.post(`${API_PORT()}/api/createDestiny/${zoneId}`, {
        name: destinyName,
      });
      if (res) {
        setCreate(true);
        console.log(res.data);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };
  useEffect(() => {
    requestZone();
  }, []);
  useEffect(() => {
    requestDestiny();
  }, [create]);

  return (
    <View>
      <TopNavigation title="Destinos" leftControl={goBackAction()} />
      <View>
      {/* <RNPickerSelect
            onValueChange={(value) => console.log(value)}
            items={[
                { label: 'Football', value: 'football' },
                { label: 'Baseball', value: 'baseball' },
                { label: 'Hockey', value: 'hockey' },
            ]}
        /> */}
        {zones && (
          <Picker
            //mode="dropdown"
            //selectedValue={zoneId}
            onValueChange={(value) => {
              setZoneId(value);
            }}
          >
            {zones.map((item, index) => {
              return (
                <Picker.Item label={item.name} value={item.id} key={index} />
              );
            })}
          </Picker>
        )}
      </View>
      <View>
        <FlatList data={destinys} RenderItem={renderItem} numColumns={3} />
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
