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
import { routes } from "../../assets/routes";
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
  console.log("hasvisit", hasVisit);

  //REQUEST ZONE BY ID
  const requestZone = async () => {
    setLoading(true);
    const res = await helpers.fetchZoneById(profile.userZone[0].ZoneId);
    //console.log("supervisor zone", res);
    setLoading(false);
    saveZones(res);
  };
  //REQUEST ZONES
  const requestZones = async () => {
    setLoading(true);
    const res = await helpers.fetchAllZones(company.id);
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

  //REQUEST ALL EMPLOYEE FROM COMPANY
  const requestEmployee = async () => {
    let uzArray = [];
    let employee = [];
    if (company) {
      setLoading(true);
      const res = await fetchAllEmployee(company.id);

      if (res.data.data.length > 0) {
        res.data.data.map((e) => {
          uzArray.push(e.userZone[0]);
        });
        uzArray.map(
          (uz) => (console.log("userZId------", uz.id), employee.push(uz.id))
        );
        saveEmployee(res.data.data);

        if (employee.length > 0) {
          const res = await helpers.fetchTodayVisist(employee);

          if (res.data.data.length > 0) {
            saveTodayVisits(res.data.data);
            setVisits(res.data.data);
            setLoading(false);
          } else{
            setHasVisit(false);
          }
        }
      }else{
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
    if (res.data.data.length > 0) {
      saveEmployee(res.data.data);
      res.data.data.map((e) => {
        uzArray.push(e.userZone[0]);
      });
      uzArray.map((uz) => employee.push(uz.id));
      if (employee.length > 0) {
        const res = await helpers.fetchTodayVisist(employee);

        if (!res.data.error && res.data.data.length > 0) {
          saveTodayVisits(res.data.data);
          setVisits(res.data.data);
          setLoading(false);
        } else{
          setHasVisit(false);
        }
      }
    }else {
      setHasVisit(false);
    }
  };

  //REQUEST AVAILABLE
  // const findAvailableUsers = async () => {
  //   if (company) {
  //     setLoading(true);
  //     try {
  //       /*let res = await axios.get(`${API_PORT()}/api/findAvailableUsers/${company.id}`);
  //       console.log("User Avai--", res.data);
  //       if (!res.data.error) {
  //         saveAvailable(res.data.data);
  //         setModalVisible(false);
  //       }*/
  //       saveAvailable([]);
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //       console.log(error.message);
  //     }
  //   }
  // };

  //VISITS
  // const requestVisits = async () => {
  //   if (company) {
  //     setLoading(true);
  //     if (employee.length) {
  //     }
  //     const res = await helpers.fetchTodayVisist(employee);
  //     saveTodayVisits(res);
  //     setVisits(res);
  //     setLoading(false);
  //     setHasVisit(false);
  //   }
  // };
  //ONLONGPRESS
  const onLong = (id) => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      return;
    }
    Vibration.vibrate(100), setSeletedItem(selectItem.concat(id));
  };

  const clearList = () => setSeletedItem([]);

  const selectAll = () => {
    let array = [];
    visits.map(({ id }) => array.push(id));
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

  console.log("hasvisit", hasVisit);

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
      {visits.length > 0 && !loading && (
        <ScrollView>
          {visits.map((elem) => (
            <TouchableOpacity
              key={elem.id}
              onPress={
                selectItem.length > 0
                  ? () => onLong(elem.id)
                  : () =>
                      navigation.navigate(routes.DETAIL_VIEW, { id: elem.id })
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
      <LogOutModal
        status={visible}
        navigation={navigation}
        onClose={() => setVisible(false)}
      />
      {!hasVisit && <NotFound message="No hay visitas." />}
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
