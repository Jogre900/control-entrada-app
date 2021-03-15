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
  helpers,
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
  const [employee, setEmployee] = useState([]);
  const [hasVisit, setHasVisit] = useState(true);
  //REQUEST ZONE BY ID
  const requestZone = async () => {
    setLoading(true);
    const res = await fetchZonyById(profile.userZone[0].ZoneId);
    console.log("supervisor zone", res);
    setLoading(false);
    saveZones(res);
  };
  //REQUEST ZONES
  const requestZones = async () => {
    console.log("zonas");
    setLoading(true);
    const res = await fetchAllZones(company.id);
    saveZones(res);
    setLoading(false);
  };
  //REQUEST ALL DESTINY BY COMPANY
  const requestAllDestiny = async () => {
    console.log("destinos");
    setLoading(true);

    const res = await fetchDestiny(company.id);

    saveDestiny(res);
    setLoading(false);
  };

  //REQUEST ALL EMPLOYEE FROM COMPANY
  const requestEmployee = async () => {
    let uzArray = [];
    let employee = [];
    if (company) {
      setLoading(true);
      const res = await fetchAllEmployee(company.id);
      console.log("EMPLOYE FROM API---",res.data)
      if (!res.data.error && res.data.data.length) {
        res.data.data.map((e) => {
          uzArray.push(e.userZone[0]);
        });
        // console.log("uzArray-------", uzArray);
        uzArray.map(
          (uz) => (console.log("userZId------", uz.id), employee.push(uz.id))
        );
        saveEmployee(res.data.data);

        if (employee.length) {
          const res = await helpers.fetchTodayVisist(company.id, employee);

          if (!res.data.error && res.data.data.length) {
            saveTodayVisits(res.data.data);
            setVisits(res.data.data);
            setLoading(false);
            //setHasVisit(false)
          } else if (!res.data.data.length) {
            setHasVisit(false);
          }
        } else setHasVisit(false);
      } else {
        console.log(res.data.msg);
        setHasVisit(false);
      }
    }
  };
  //REQUEST ALL EMPLOYEES FORM ONE ZONE
  const requestEmployeeByZone = async () => {
    let uzArray = [];
    let employee = [];
    setLoading(true);
    const res = await fetchEmployeeByZone(profile.userZone[0].ZoneId);
    if (!res.data.error && res.data.data.length) {
      saveEmployee(res.data.data);
      res.data.data.map((e) => {
        uzArray.push(e.userZone[0]);
      });
      uzArray.map((uz) => employee.push(uz.id));
      if (employee.length) {
        const res = await helpers.fetchTodayVisist(company.id, employee);

        if (!res.data.error && res.data.data.length) {
          saveTodayVisits(res.data.data);
          setVisits(res.data.data);
          setLoading(false);
          //setHasVisit(false)
        } else if (!res.data.data.length) {
          setHasVisit(false);
        }
      } else setHasVisit(false);
    } else {
      console.log(res.data.msg);
      setHasVisit(false);
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

  //VISITS
  const requestVisits = async () => {
    if (company) {
      console.log("visits");
      setLoading(true);
      if (employee.length) {
        console.log("empleados---", employee);
      }
      const res = await fetchTodayVisist(company.id, employee);
      saveTodayVisits(res);
      setVisits(res);
      setLoading(false);
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
    requestAllDestiny();
  }, []);

  // useEffect(() => {
  //   requestVisits();
  // }, [employee]);
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
      };
    }, [])
  );
  console.log("hasVisit----", hasVisit);
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
      {loading && <Spinner message="Cargando..." />}
      {visits.length > 0 && (
        <ScrollView>
          {visits.map((elem) => (
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
              <VisitCard
                data={elem}
                selected={selectItem.includes(elem.id) ? true : false}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {!hasVisit && <NotFound message="No hay visitas." />}
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
