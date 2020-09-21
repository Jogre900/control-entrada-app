import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ScrollView,
} from "react-native";

//componentes
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";

export const ZoneDetailScreen = (props) => {
  //console.log(props)
  const { zone, destinys, watchmen } = props.route.params;
  console.log("destinos:----------", destinys);
  console.log("watchmen:--------", watchmen);
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
  return (
    <View style={{flex:1}}>
      <TopNavigation title={zone} leftControl={goBackAction()} />
      <ScrollView style={{ flex: 1 }}>
        <Text>Zona:</Text>
        <View>
          <Text>{zone}</Text>
        </View>
        <View>
          <Text>Destinos:</Text>
          <FlatList data={destinys} renderItem={renderDestiny} />
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
