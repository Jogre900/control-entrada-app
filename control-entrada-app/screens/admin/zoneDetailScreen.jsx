import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import { connect } from "react-redux";

//componentes
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Divider } from "../../components/Divider";
import { MainColor, lightColor } from "../../assets/colors";

const ZoneDetailScreen = ({ route, navigation, zoneRedux }) => {
  //console.log("redux----", zoneRedux)
  console.log(route);
  const {
    id,
    zone,
    entryTime,
    departureTime,
    destinys,
    watchmen,
  } = route.params;

  //const [destiny, setDestiny] = useState(destinys);
  const zoneId = id;
  const goBackAction = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            navigation.navigate("Zones");
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
  };
  const renderDestiny = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5,
      }}
    >
      <View style={{ flexDirection: "row", backgroundColor: "skyblue" }}>
        <Ionicons name="ios-checkmark" size={22} color={lightColor} />
        <Text>{item.name}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteDestiny(item.id)}>
        <Ionicons name="ios-trash" size={28} color="#ccc" />
      </TouchableOpacity>
    </View>
  );
  const renderWatchman = ({ item }) => (
    <View style={styles.listEmployeBox}>
      <Image
        style={styles.avatar}
        source={{ uri: `${API_PORT()}/public/imgs/${item.User.picture}` }}
      />
      <View style={styles.listSubItemBox}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.privilegeBox}>
            <Text style={{ color: "#fff", fontSize: 16, lineHeight: 16 }}>
              {item.User.privilege}
            </Text>
          </View>
          <Text>
            {item.User.name} {item.User.lastName}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text>Asignado:</Text>
          <Text>{moment(item.assignationDate).format("D MMM YYYY")}</Text>
        </View>
        {/* <Text>Cambio de Turno: {moment(item.changeTurnDate).format('D MMM YYYY')}</Text> */}
      </View>
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
    console.log(destinyId);
    try {
      let res = await axios.delete(
        `${API_PORT()}/api/deleteDestiny/${destinyId}`
      );
      if (res) {
        console.log(res);
        setDestiny((destiny) => destiny.filter((elem) => elem.id != destinyId));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title={zone} leftControl={goBackAction()} />
      <ScrollView style={{ flex: 1 }}>
        <Text>Zona:</Text>
        <View>
          <Text>{zone}</Text>
          <Text>{moment(entryTime).format("HH:mm a")}</Text>
          <Text>{moment(departureTime).format("HH:mm a")}</Text>
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.containerTitle}>Destinos</Text>
          <Divider size="small" />
          {destinys.length >= 1 ? (
            <FlatList data={destinys} renderItem={renderDestiny} />
          ) : (
            <Text>no hay datos</Text>
          )}
        </View>
        <View style={styles.dataContainer}>
          <Text style={styles.containerTitle}>Encargados</Text>
          <Divider size="small" />
          {watchmen.length >= 1 ? (
            <FlatList data={watchmen} renderItem={renderWatchman} />
          ) : (
            <Text>no hay datos</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const mapStateToProps = (state, zoneId) => ({
  zoneRedux: state.zonesReducer,
});

export default connect(mapStateToProps, {})(ZoneDetailScreen);

const styles = StyleSheet.create({
  dataContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
    width: "90%",
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: "normal",
    color: MainColor,
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 70 / 2,
  },
  listEmployeBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: "#fff",
    justifyContent: "space-around",
    padding: 5,
  },
  listSubItemBox: {
    borderBottomWidth: 0.5,
    borderColor: "grey",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    //backgroundColor: 'pink',
    width: "80%",
    height: 70,
  },
  privilegeBox: {
    backgroundColor: MainColor,
    borderRadius: 25,
    padding: 5,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
