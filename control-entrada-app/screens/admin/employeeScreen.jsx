import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityBase,
} from "react-native";

import axios from "axios";
import { API_PORT } from "../../config/index.js";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";

const companyId = '9a28095a-9029-40ec-88c2-30e3fac69bc5'

export const EmployeeScreen = (props) => {
  const [employee, setEmployee] = useState([]);
  const [employeeId, setEmployeeId] = useState("")
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

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

  //LOADING
  const splash = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="#ff7e00" />
      </View>
    );
  };
  const goBackAction = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            props.navigation.navigate("Home");
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
  };

  //DELETE EMPLOYEE
  const deleteEmployee = async (id) => {
    try {
      let res = await axios.delete(`${API_PORT()}/api/deleteUser/${id}`)
      if(!res.data.error){
        console.log(res.data.data)
        alert("Borrado con exito")
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const requestEmployee = async () => {
    setLoading(true);
    try {
      let res = await axios.get(`${API_PORT()}/api/findUsers/${companyId}`);
      if (!res.data.error) {
        console.log(res.data.data);
        setEmployee(res.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("error: ", error.message);
    }
  };
  
  useEffect(() => {
    requestEmployee();
  }, []);
  return (
    <View>
      <TopNavigation title="Empleados" leftControl={goBackAction()} />
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
        {loading ? (
          splash()
        ) : (
          <View>
            {employee &&
              employee.map((item, i) => (
                <TouchableOpacity
                  style={styles.listItemBox}
                  onPress={() =>
                    props.navigation.navigate("employee_detail", item)
                  }
                  key={i}
                >
                  <TouchableOpacity onPress={() => deleteEmployee(item.id)}>
                  <Ionicons name="ios-trash" size={22} color="grey"/>
                  </TouchableOpacity>
                  <View>
                    <View style={styles.privilegeBox}>
                      {item.privilege == "Supervisor" ? (
                        <Text style={styles.privilegeText}>S</Text>
                      ) : (
                        <Text style={styles.privilegeText}>V</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.itemDataBox}>
                    <Text style={styles.itemDataText}>
                      {item.name} {item.lastName}
                    </Text>
                    <Text style={styles.itemDataText}>{item.email}</Text>
                  </View>
                  <View style={styles.itemDataBox}>
                    <Text style={styles.itemDataText}>Zona</Text>
                    {
                      item.userZone.length > 0 ?
                      <Text style={styles.itemDataText}>
                      {/* si tiene */}
                      {item.userZone[0].Zone.zone}
                      </Text>
                      :
                      <Text style={styles.itemDataText}>
                      -------
                      </Text>
                      }
                    <Text style={styles.itemDataText}>
                      
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: Constants.statusBarHeight,
  },
  scrollView: {
    flex: 1,
  },
  listItemBox: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 5,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 10,
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
