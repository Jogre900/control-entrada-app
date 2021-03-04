import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Vibration,
  BackHandler,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
//components
import { TopNavigation } from "../../components/TopNavigation.component";

import { ThirdColor } from "../../assets/colors";
import { connect } from "react-redux";
import { Spinner } from "../../components/spinner";
import { NotFound } from "../../components/NotFound";
import { DrawerAction, Notifications } from "../../helpers/ui/ui";
import { VisitCard } from "../../components/visitCard";
import { Header } from "../../components/header.component";
import { LogOutModal } from "../../components/logOutModal";
import {
  fetchZonyById,
  fetchAllZones,
  fetchDestiny,
  fetchAllEmployee,
  fetchEmployeeByZone,
  fetchTodayVisist,
} from "../../helpers/";

const HomeAdminScreen = ({
  navigation,
  company,
  saveEmployee,
  saveTodayVisits,
  saveAvailable,
  saveZones,
  saveDestiny,
  profile,
  privilege,
}) => {
  const [visible, setVisible] = useState(false);
  const [selectItem, setSeletedItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visits, setVisits] = useState([]);

  //REQUEST ZONE BY ID
  const requestZone = async () => {
    setLoading(true);
    const res = await fetchZonyById(profile.userZone[0].ZoneId);
    setLoading(false);
    saveZones(res);
  };
  //REQUEST ZONES
  const requestZones = async () => {
    setLoading(true);
    const res = await fetchAllZones(company.id);
    saveZones(res);
    setLoading(false);
  };
  //REQUEST ALL DESTINY BY COMPANY
  const requestAllDestiny = async () => {
    setLoading(true);

    const res = await fetchDestiny(company.id);

    saveDestiny(res);
    setLoading(false);
  };
  //VISITS
  const requestVisits = async () => {
    if (company) {
      setLoading(true);
      const res = await fetchTodayVisist(company.id);
      saveTodayVisits(res);
      setVisits(res);
      setLoading(false);
    }
  };

  //REQUEST ALL EMPLOYEE FROM COMPANY
  const requestEmployee = async () => {
    if (company) {
      setLoading(true);
      const res = await fetchAllEmployee(company.id);
      saveEmployee(res);
      setLoading(false);
    }
  };
  //REQUEST ALL EMPLOYEES FORM ONE ZONE
  const requestEmployeeByZone = async () => {
    setLoading(true);
    const res = await fetchEmployeeByZone(profile.userZone[0].ZoneId);
    setLoading(false);
    saveEmployee(res);
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
    setVisible(true);
    return true;
  };
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
    privilege === "Admin" && requestAllDestiny();
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
      <ScrollView>
        {loading && <Spinner />}
        {visits.length > 0 ? (
          visits.map((elem, i) => (
            <TouchableOpacity
              key={elem.id}
              onPress={
                selectItem.length > 0
                  ? () => onLong(elem.id)
                  : () => navigation.navigate("detail-view", { id: elem.id })
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
          <NotFound message="No hay Visitas" />
        )}
      </ScrollView>
      <LogOutModal
        status={visible}
        navigation={navigation}
        onClose={() => setVisible(false)}
      />
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
  saveDestiny(destinys) {
    dispatch({
      type: "SAVE_DESTINY",
      payload: destinys,
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
