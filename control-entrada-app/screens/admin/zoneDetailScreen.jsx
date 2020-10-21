import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert
} from "react-native";
import axios from 'axios'

//componentes
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import moment from 'moment'

export const ZoneDetailScreen = (props) => {
  //console.log(props)
  const { id, zone, entryTime, departureTime, destinys, watchmen } = props.route.params;
  console.log(props.route.params)
  const [destiny, setDestiny] = useState(destinys)
  
  const goBackAction = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            props.navigation.navigate("zonas");
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
  };
  const renderDestiny = ({ item }) => (
    <View>
      <Text>{item.name}</Text>
      <TouchableOpacity onPress={() => deleteDestiny(item.id)}>
        <Ionicons name="ios-trash" size={28} color="#ccc"/>
      </TouchableOpacity>
    </View>
  );
  const renderWatchman = ({ item }) => (
    <View>
      <Text>
        Nombre: {item.User.name} {item.User.lastName}
      </Text>
      <Text>Correo: {item.User.email}</Text>
      <Text>Fecha Asignado: {item.assignationDate}</Text>
      <Text>Cambio de Turno: {item.changeTurnDate}</Text>
    </View>
  );

  // const deleteWarning = (id) => {
  //   Alert.alert("Seguro que desea borrar este destino?", [
  //     {
  //       text: "Cancel",
  //       style: "cancel"
  //     },
  //     {
  //       text: "OK",
  //       onPress:() => {
  //         deleteDestiny(id)
  //       }
  //     }
  // ])
  // }
  const deleteDestiny = async (destinyId) => {
    console.log(destinyId)
    try {
      let res = await axios.delete(`${API_PORT()}/api/deleteDestiny/${destinyId}`)
      if(res){
      console.log(res)
      setDestiny(destiny => destiny.filter(elem => elem.id != destinyId))
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <View style={{flex:1}}>
      <TopNavigation title={zone} leftControl={goBackAction()} />
      <ScrollView style={{ flex: 1 }}>
        <Text>Zona:</Text>
        <View>
          <Text>{zone}</Text>
          <Text>{moment(entryTime).format('HH:mm a')}</Text>
          <Text>{moment(departureTime).format('HH:mm a')}</Text>
        </View>
        <View>
          <Text>Destinos:</Text>
          <FlatList data={destiny} renderItem={renderDestiny} />
        </View>
        <View>
          <Text>Encargados:</Text>
          <FlatList data={watchmen} renderItem={renderWatchman} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({});
