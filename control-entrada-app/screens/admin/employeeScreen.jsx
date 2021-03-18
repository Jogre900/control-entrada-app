import React, { useState } from "react";
import {
  View,
  StyleSheet,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import axios from "axios";
import { API_PORT } from "../../config/index.js";

import { TopNavigation } from "../../components/TopNavigation.component";
import { EmployeeCard } from "../../components/employeeCard";
import { NotFound } from "../../components/NotFound";
import { routes } from '../../assets/routes'
import { BackAction } from '../../helpers/ui/ui'
import { connect } from "react-redux";


const EmployeeScreen = ({ navigation, employee, removeEmployee }) => {
  console.log("EMPLOYEE FROM REDUX--",employee)
  const [refreshing, setRefreshing] = useState(false);

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

  //DELETE EMPLOYEE
  const deleteEmployee = async (id) => {
    try {
      let res = await axios.delete(`${API_PORT()}/api/deleteUser/${id}`);
      if (!res.data.error) {
        console.log(res.data.data);
        removeEmployee(res.data.data);
        alert("Borrado con exito");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{flex:1}}>
      <TopNavigation title="Empleados" leftControl={BackAction(navigation, routes.ADMIN_HOME)} />
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
          {employee.length > 0 ? (
            employee.map((item) => (
              <TouchableOpacity
                style={styles.listItemBox}
                onPress={() =>
                  navigation.navigate(routes.EMPLOYEE_DETAIL, { id: item.id })
                }
                key={item.id}
              >
                <EmployeeCard data={item} zone={false}/>
              </TouchableOpacity>
            ))
          ) : (
            <NotFound />
          )}
        </View>
      </ScrollView>
    </View>
  );
};
const mapStateToProps = (state) => ({
  employee: state.employee.employee,
});

const mapDispatchToProps = (dispatch) => ({
  removeEmployee(employee) {
    dispatch({
      type: "REMOVE_EMPLOYEE",
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
