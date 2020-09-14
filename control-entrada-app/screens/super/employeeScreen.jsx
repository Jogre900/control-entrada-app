import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
} from "react-native";

import axios from "axios";
import { API_PORT } from "../../config/index.js";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";

export const EmployeeScreen = (props) => {
  const [employee, setEmployee] = useState([]);
  const goBackAction = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
  };
  const requestEmployee = async () => {
    try {
      let res = await axios.get(`${API_PORT()}/api/findEmployee`);
      if (res) setEmployee(res.data.data);
    } catch (error) {
      console.log("error: ", error);
    }
  };
  const renderEmplyee = ({item}) => (
      <View>
          <Text>{item.name}</Text>
      </View>
  )

  useEffect(() => {
    requestEmployee();
  }, []);
  return (
    <View>
      <TopNavigation title="Empleados" leftControl={goBackAction()} />
        <Text>Lista de Empleados:</Text>
        <FlatList
            data={employee}
            renderItem={renderEmplyee}
        />
    </View>
  );
};

const styles = StyleSheet.create();
