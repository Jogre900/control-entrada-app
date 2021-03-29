import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  Vibration,
  BackHandler
} from "react-native";
import { useFocusEffect } from '@react-navigation/native'

import { TopNavigation } from "../../components/TopNavigation.component";
import { Header } from '../../components/header.component'
import { EmployeeCard } from "../../components/employeeCard";
import { NotFound } from "../../components/NotFound";
import { FloatingBotton } from "../../components/floatingBotton";
import { StatusModal } from "../../components/statusModal";
import { PrompModal } from "../../components/prompModal";
import { routes } from "../../assets/routes";
import { BackAction } from "../../helpers/ui/ui";
import { connect } from "react-redux";
import {
  fetchDestiny,
  fetchAllEmployee,
  fetchEmployeeByZone,
  helpers,
} from "../../helpers/";

let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};

const EmployeeScreen = ({
  navigation,
  employee,
  privilege,
  company, 
  saveEmployee,
  suspendEmployee,
  removeEmployee,
}) => {
  //console.log("EMPLOYEE FROM REDUX--", employee);
  const [refreshing, setRefreshing] = useState(false);
  const [selectItem, setSeletedItem] = useState([]);
  const [promp, setPromp] = useState(false);
  const [statusModalProps, setStatusModalProps] = useState(statusModalValues);
  const [suspend, setSuspend] = useState(false)

  //REFRESH CONTROL
  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    requestEmployee().then(() => setRefreshing(false));
  }, []);

  //CHECK DELETE
  const checkDeleted = (status, message, data) => {
    console.log("DATA--",data)
    setStatusModalProps((values) => ({
      ...values,
      visible: true,
      status,
      message,
    }));
    if (status) {
      
      setSuspend(!suspend);
    }
    clearList();
  };

  //REQUEST ALL EMPLOYEE FROM COMPANY
  const requestEmployee = async () => {
      const res = await fetchAllEmployee(company.id);
      if (res.data.data.length > 0) {
        saveEmployee(res.data.data);

    }
  };
  //REQUEST ALL EMPLOYEES FORM ONE ZONE
  const requestEmployeeByZone = async () => {
    const res = await fetchEmployeeByZone(profile.userZone[0].ZoneId);
    if (res.data.data.length > 0) {
      saveEmployee(res.data.data); 
    }
  };

  const onLong = (id) => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      //  hideCheckMark();
      return;
    }
    Vibration.vibrate(100), setSeletedItem(selectItem.concat(id));
    //showCheckMark();
    //setChangeStyle(!changeStyle);
  };
  const clearList = () => setSeletedItem([]);

  const selectAll = () => {
    let array = [];
    employee.map(({ id }) => array.push(id));
    setSeletedItem(array);
  };

  const goBackHardware = () => {
    //TODO aqui y abajo debes poner segun rol
    navigation.navigate(routes.ADMIN_HOME);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", goBackHardware);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", goBackHardware);
      };
    }, [])
  );


  useEffect(() => {
    if (privilege === "Admin") {
      requestEmployee();
    } else {
      requestEmployeeByZone();
    }
  }, [suspend]);

  return (
    <View style={{ flex: 1 }}>
      {selectItem.length > 0 ? (
        <Header
          value={selectItem.length}
          clearAction={clearList}
          deleteAction={() => setPromp(true)}
          selectAction={selectAll}
        />
      ) : (
        <TopNavigation
          title="Empleados"
          leftControl={BackAction(navigation, routes.ADMIN_HOME)}
        />
      )}
      {employee.length > 0 && (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["red", "blue", "green"]}
            />
          }
        >
          <View>
            {employee.map((item) => (
              <TouchableOpacity
                style={styles.listItemBox}
                onPress={
                  selectItem.length > 0
                    ? () => onLong(item.id)
                    : () =>
                        navigation.navigate(routes.EMPLOYEE_DETAIL, {
                          id: item.id,
                        })
                }
                onLongPress={() => onLong(item.id)}
                delayLongPress={200}
                key={item.id}
              >
                <EmployeeCard data={item} zone={false} selected={selectItem.includes(item.id) ? true : false}/>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
      {employee.length <= 0 && (
        <NotFound message="No hay empleados registrados" />
      )}
      <FloatingBotton
        icon="ios-add"
        onPress={() => navigation.navigate(routes.CREATE_EMPLOYEE)}
      />
      <PrompModal
        visible={promp}
        onClose={() => setPromp(false)}
        deleted={checkDeleted}
        data={selectItem}
        suspend={true}
      />
      <StatusModal
        {...statusModalProps}
        onClose={() =>
          setStatusModalProps((values) => ({ ...values, visible: false }))
        }
      />
    </View>
  );
};
const mapStateToProps = (state) => ({
  company: state.profile.companySelect,
  employee: state.employee.employee,
  privilege: state.profile.login.privilege
});

const mapDispatchToProps = (dispatch) => ({
  removeEmployee(employee) {
    dispatch({
      type: "REMOVE_EMPLOYEE",
      payload: employee,
    });
  },
  suspendEmployee(employee) {
    dispatch({
      type: "SUSPEND_EMPLOYEE",
      payload: employee,
    });
  },
  saveEmployee(employee) {
    dispatch({
      type: "SAVE_EMPLOYEE",
      payload: employee,
    });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(EmployeeScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: Constants.statusBarHeight,
  },
  privilegeBox: {
    backgroundColor: "orange",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  privilegeText: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "bold",
  },
  itemDataBox: {
    justifyContent: "center",
    alignItems: "center",
  },
  itemDataText: {
    fontSize: 15,
  },
});
