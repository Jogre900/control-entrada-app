import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
//components
import { TopNavigation } from "../../components/TopNavigation.component";
import axios from "axios";
import { API_PORT } from "../../config/index";
import moment from "moment";
import { MainColor } from "../../assets/colors";
import Modal from "react-native-modal";

export const HomeAdminScreen = (props) => {
  const [object, setObject] = useState({});
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
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

  //VISITS
  const requestVisits = async () => {
    setModalVisible(!modalVisible);
    try {
      let res = await axios.get(`${API_PORT()}/api/findTodayVisits`);
      if (res) {
        console.log(res.data.data);
        setVisits(res.data.data);
        setModalVisible(!modalVisible);
      }
    } catch (error) {
      if ((error = "Network Error")) {
        setModalVisible(false);
        alert("Erorr de conexion!");
      }
    }
  };

  useEffect(() => {
    requestVisits();
  }, []);

  return (
    <View>
      <TopNavigation
        title="Entradas del Dia"
        leftControl={drawerAction()}
        rightControl={openNotifications()}
      />

      <LoadingModal />

      <View style={styles.listEntry}>
        {visits.map((elem, i) => {
          return (
            <TouchableOpacity
              style={styles.entryBox}
              key={i}
              onPress={() => props.navigation.navigate("detail-view", elem)}
            >
              <View style={styles.dataContainerView}>
                {/* <Image style={{height: 40, width: 40, borderRadius: 20}} source={{uri: `${API_PORT()}/public/imgs/${elem.picture}`}}/> */}
              </View>
              <View style={styles.dataContainerView}>
                <Text>DNI</Text>
                <Text style={styles.dataText}>{elem.Citizen.dni}</Text>
              </View>
              <View style={styles.dataContainerView}>
                <Text>Nombre</Text>
                <Text style={styles.dataText}>
                  {elem.Citizen.name} {elem.Citizen.lastName}
                </Text>
              </View>
              <View style={styles.dataContainerView}>
                <Text>Entrada</Text>
                <Text style={styles.dataText}>
                  {moment(elem.ntryDate).format("HH:mm a")}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
    width: "33%",
    maxWidth: "33%",
  },
  dataText: {
    fontSize: 15,
  },
});
