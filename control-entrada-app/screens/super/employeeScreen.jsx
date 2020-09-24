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
} from "react-native";

import axios from "axios";
import { API_PORT } from "../../config/index.js";
import Input from "../../components/input.component";
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";

export const EmployeeScreen = (props) => {
  const [employee, setEmployee] = useState([]);
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
            props.navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
  };
  const requestEmployee = async () => {
    setLoading(true);
    try {
      let res = await axios.get(`${API_PORT()}/api/findUsers`);
      if (res) {
        setEmployee(res.data.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };
  const renderEmplyee = ({ item }) => {
    console.log(item);
    return (
      <View>
        <Text>Nombre: {item.name}</Text>
        <Text>Apellido: {item.lastName}</Text>
        <Text>DNI: {item.dni}</Text>
        <Text>Correo: {item.email}</Text>
        <Text>Fecha: {item.assignationDate}</Text>
        <Text>Foto: {item.picture}</Text>
        <Image
          source={{uri: `${API_PORT()}/public/imgs/${item.picture}`}}
          style={{ width: "100%", height: 120 }}
        />
      </View>
    );
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
            <Text>Lista de Empleados:</Text>
            <FlatList data={employee} renderItem={renderEmplyee} />
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
    //backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
  },
});
