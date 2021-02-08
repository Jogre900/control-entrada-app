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
import { connect } from "react-redux";
import Avatar from "../../components/avatar.component";
import { DrawerAction, Notifications } from "../../helpers/ui/ui";

const HomeAdminScreen = ({
  navigation,
  company,
  saveEmployee,
  saveTodayVisits,
  saveAvailable,
  saveZones,
}) => {
  //console.log("company---------------", company)
  const [object, setObject] = useState({});
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  //LOADING
  const LoadingModal = () => {
    return (
      <Modal
        isVisible={modalVisible}
        //onBackdropPress={() => setModalVisible(!modalVisible)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#f09",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={MainColor} />
        </View>
      </Modal>
    );
  };
  //REQUEST ZONES
  const requestZone = async () => {
    setModalVisible(true);

    try {
      let res = await axios.get(`${API_PORT()}/api/findZones/${company.id}`);
      
      if (!res.data.error && res.data.data.length > 0) {
        //console.log("ZONES FROM API------", res.data.data)
        saveZones(res.data.data);
        setModalVisible(false);
      }
    } catch (error) {
      alert(error.message);
    }
  };
  //VISITS
  const requestVisits = async () => {
    if (company) {
      setModalVisible(true);
      try {
        let res = await axios.get(
          `${API_PORT()}/api/findTodayVisits/${company.id}`
        );
        //console.log("VISITS FROM API-----", res.data);
        if (!res.data.error && res.data.data.length > 0) {
          saveTodayVisits(res.data.data);
          setVisits(res.data.data);
          setModalVisible(false);
        }
        //setVisits([]);
        setModalVisible(false);
      } catch (error) {
        setModalVisible(false);
        alert(error.message);
      }
    }
  };
  //REQUEST EMPLOYEE
  const requestEmployee = async () => {
    if (company) {
      setModalVisible(true);
      try {
        let res = await axios.get(`${API_PORT()}/api/findUsers/${company.id}`);
        console.log("employee from API----",res.data);
        if (!res.data.error && res.data.data.length > 0) {
          saveEmployee(res.data.data);
          setLoading(false);
        }
        // saveEmployee([]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log("error: ", error.message);
      }
    }
  };
  //REQUEST AVAILABLE
  const findAvailableUsers = async () => {
    if (company) {
      setModalVisible(true);
      try {
        /*let res = await axios.get(`${API_PORT()}/api/findAvailableUsers/${company.id}`);
        console.log("User Avai--", res.data);
        if (!res.data.error) {
          saveAvailable(res.data.data);
          setModalVisible(false);
        }*/
        saveAvailable([]);
        setModalVisible(false);
      } catch (error) {
        setModalVisible(false);
        console.log(error.message);
      }
    }
  };
  // useEffect(() => {
  //   findAvailableUsers();
  // }, []);
  useEffect(() => {
    requestZone();
  }, []);
  useEffect(() => {
    requestEmployee();
  }, []);

  useEffect(() => {
    requestVisits();
  }, []);

  return (
    <View>
      <TopNavigation
        title="Entradas del Dia"
        leftControl={DrawerAction(navigation)}
        rightControl={Notifications(navigation)}
      />
      <LoadingModal />

      <View style={styles.listEntry}>
        {visits.length > 0 ? (
          visits.map((elem, i) => {
            return (
              <TouchableOpacity
                style={styles.entryBox}
                key={i}
                onPress={() => navigation.navigate("detail-view", elem)}
              >
                <View style={styles.dataContainerView}>
                  <Avatar.Picture
                    size={50}
                    uri={`${API_PORT()}/public/imgs/${elem.Citizen.picture}`}
                  />
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
          })
        ) : (
          <Text>No hay Visitas Registradas</Text>
        )}
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  company: state.profile.companySelect,
});

const mapDispatchToProps = (dispatch) => ({
  saveZones(zones) {
    dispatch({
      type: "setZones",
      payload: zones,
    });
  },
  saveTodayVisits(todayVisits) {
    dispatch({
      type: "SAVE_VISITS",
      payload: todayVisits,
    });
  },
  saveEmployee(employee) {
    dispatch({
      type: "SAVE_EMPLOYEE",
      payload: employee,
    });
  },
  saveAvailable(availables) {
    dispatch({
      type: "SAVE_AVAILABLE",
      payload: availables,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeAdminScreen);

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
