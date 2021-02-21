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
  ScrollView,
  Vibration,
  BackHandler
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
//components
import { TopNavigation } from "../../components/TopNavigation.component";
import axios from "axios";
import { API_PORT } from "../../config/index";
import moment from "moment";
import { MainColor, ThirdColor } from "../../assets/colors";
import Modal from "react-native-modal";
import { connect } from "react-redux";
import { Spinner } from "../../components/spinner";
import { NotFound } from "../../components/NotFound";
import { DrawerAction, Notifications } from "../../helpers/ui/ui";
import { VisitCard } from "../../components/visitCard";
import { Header } from "../../components/header.component";
import { LogOutModal } from '../../components/logOutModal'

const HomeAdminScreen = ({
  navigation,
  company,
  saveEmployee,
  saveTodayVisits,
  saveAvailable,
  saveZones,
  profile,
  privilege,
}) => {
  const [visible, setVisible] = useState(false)
  const [selectItem, setSeletedItem] = useState([]);
  const [object, setObject] = useState({});
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);
  const [visitCaption, setVisitCaption] = useState("");

  //REQUEST ZONE BY ID
  const requestZone = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_PORT()}/api/findZone/${profile.userZone[0].ZoneId}`
      );
      console.log("zone by Id from api---", res.data.data);
      if (!res.data.error) {
        setLoading(false);
        saveZones(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  };
  //REQUEST ZONES
  const requestZones = async () => {
    setLoading(true);

    try {
      let res = await axios.get(`${API_PORT()}/api/findZones/${company.id}`);

      //console.log("ZONES FROM API------", res.data)
      if (!res.data.error && res.data.data.length > 0) {
        saveZones(res.data.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };
  //VISITS
  const requestVisits = async () => {
    if (company) {
      setVisitCaption("");
      setLoading(true);
      try {
        let res = await axios.get(
          `${API_PORT()}/api/findTodayVisits/${company.id}`
        );
        console.log("VISITS FROM API-----", res.data);
        if (!res.data.error && res.data.data.length > 0) {
          saveTodayVisits(res.data.data);
          setVisits(res.data.data);
          setLoading(false);
        } else {
          setVisitCaption("No Hay Visitas!");
        }
        //setVisits([]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        alert(error.message);
      }
    }
  };
  //REQUEST ALL EMPLOYEE FROM COMPANY
  const requestEmployee = async () => {
    if (company) {
      setLoading(true);
      try {
        let res = await axios.get(`${API_PORT()}/api/findUsers/${company.id}`);
        //console.log("employee from API----",res.data);
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
  //REQUEST ALL EMPLOYEES FORM ONE ZONE
  const requestEmployeeByZone = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_PORT()}/api/findUsersByZone/${profile.userZone[0].ZoneId}`
      );
      if (!res.data.error && res.data.data.length > 0) {
        setLoading(false);
        saveEmployee(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };
  //REQUEST AVAILABLE
  const findAvailableUsers = async () => {
    if (company) {
      setLoading(true);
      try {
        /*let res = await axios.get(`${API_PORT()}/api/findAvailableUsers/${company.id}`);
        console.log("User Avai--", res.data);
        if (!res.data.error) {
          saveAvailable(res.data.data);
          setModalVisible(false);
        }*/
        saveAvailable([]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error.message);
      }
    }
  };
  //ONLONGPRESS
  const onLong = (id) => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      //hideCheckMark();
      return;
    }
    Vibration.vibrate(100), setSeletedItem(selectItem.concat(id));
    //showCheckMark();
    //setChangeStyle(!changeStyle);
  };

  const clearList = () => setSeletedItem([]);

  const selectAll = () => {
    let array = [];
    visits.map(({ id }) => array.push(id));
    console.log(array);
    setSeletedItem(array);
  };
  const backAction = () => {
    setVisible(true)
    return true
  }
  // useEffect(() => {
  //   findAvailableUsers();
  // }, []);
  useEffect(() => {
    privilege === "Admin" ? requestZones() : requestZone();
  }, []);
  useEffect(() => {
    if (privilege === "Admin") {
      requestEmployee();
    } else {
      requestEmployeeByZone();
    }
  }, []);

  useEffect(() => {
    requestVisits();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
      };
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      {selectItem.length > 0 ? (
        <Header
          value={selectItem.length}
          clearAction={clearList}
          //deleteAction={() => deleteZones(selectItem)}
          selectAction={selectAll}
        />
      ) : (
        <TopNavigation
          title="Entradas del Dia"
          leftControl={DrawerAction(navigation)}
          rightControl={Notifications(navigation)}
        />
      )}
      <ScrollView contentContainerStyle={styles.listEntry}>
        {loading && <Spinner />}
        {visits.length > 0 ? (
          visits.map((elem, i) => (
            <TouchableOpacity
              key={i}
              onPress={
                selectItem.length > 0
                  ? () => onLong(elem.id)
                  : () => navigation.navigate("detail-view", elem)
              }
              onLongPress={() => onLong(elem.id)}
              delayLongPress={200}
            >
              {/* <Text>algodon!!!</Text> */}
              <VisitCard
                data={elem}
                selected={selectItem.includes(elem.id) ? true : false}
              />
            </TouchableOpacity>
          ))
        ) : (
          <NotFound message={visitCaption} />
        )}
      </ScrollView>
      <LogOutModal status={visible} navigation={navigation} onClose={() => setVisible(false)}/>
    </View>
  );
};

const mapStateToProps = (state) => ({
  company: state.profile.companySelect,
  profile: state.profile.profile,
  privilege: state.profile.login.privilege,
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
    //paddingHorizontal: 5,
    //backgroundColor: 'blue',
    flex: 1,
  },
  entryBox: {
    flexDirection: "row",
    //justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
    borderColor: "grey",
    marginVertical: 2.5,
    borderRadius: 20,
    backgroundColor: ThirdColor,
  },
  nameContainer: {
    marginLeft: 3,
    justifyContent: "flex-start",
  },
  dataContainerView: {
    justifyContent: "center",
    alignItems: "center",
    //width: "33%",
    //maxWidth: "33%",
  },
  icon: {
    marginRight: 3,
  },
  dataText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
