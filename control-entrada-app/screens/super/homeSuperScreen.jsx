import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
//components
import { TopNavigation } from "../../components/TopNavigation.component";
import axios from 'axios'
import {API_PORT} from '../../config/index'
import moment from "moment";


export const HomeSuperScreen = (props) => {
  const [object, setObject] = useState({});
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([])
  const drawerAction = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            props.navigation.toggleDrawer();
          }}
        >
          <Ionicons name="ios-menu" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
  };
  const openNotifications = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            props.navigation.navigate("notification");
          }}
        >
          <Ionicons name="md-notifications" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
  };
  const Splash = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="#ff7e00" />
      </View>
    );
  };

  //VISITS
  const requestVisits = async () => {
    setLoading(true)
    try {
      let res = await axios.get(`${API_PORT()}/api/findAllVisits`)
      if(res){
        setVisits(res.data.data)
        setLoading(false)
      } 
    } catch (error) {
      console.log("error:", error)
    }
  }
  

  useEffect(() => {
    requestVisits()
  }, []);

  return (
    <View>
      <TopNavigation
        title="Entradas del Dia"
        leftControl={drawerAction()}
        rightControl={openNotifications()}
      />
      {loading ? (
        <Splash/>
      ) : (
        <View style={styles.listEntry}>
          {visits.map((elem, i) => {
            return (
              <TouchableOpacity
                style={styles.entryBox}
                key={i}
                onPress={() =>
                  props.navigation.navigate("detail-view", elem)
                }
              >
                <View style={styles.dataContainerView}>
                  <Text>DNI</Text>
                  <Text style={styles.dataText}>{elem.dni}</Text>
                </View>
                <View style={styles.dataContainerView}>
                  <Text>Nombre</Text>
                  <Text style={styles.dataText}>
                    {elem.name} {elem.lastName}
                  </Text>
                </View>
                <View style={styles.dataContainerView}>
                  <Text>Entrada</Text>
                  <Text style={styles.dataText}>
                    {moment(elem.Visitas.entryDate).format('HH:mm a')}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listEntry: {
    paddingHorizontal: 5,
  },
  entryBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
    borderColor: "grey",
    marginVertical: 5,
    borderRadius: 20,
  },
  dataContainerView: {
    justifyContent: "center",
    alignItems: "center",
    width:"33%",
    maxWidth: "33%"
  },
  dataText: {
    fontSize: 15,
  },
});
