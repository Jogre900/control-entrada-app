import React from "react";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from '../lib/firebase'
import AsyncStorage from '@react-native-community/async-storage'

//screens
import { HomeAdminScreen } from "../screens/admin/homeAdminScreen";
import { DetailViewScreen } from "../screens/admin/detailViewScreen";
import {ZonasScreen} from '../screens/admin/zonesScreen'
import { ZoneDetailScreen } from '../screens/admin/zoneDetailScreen'
import { DestinyScreen } from '../screens/admin/destinyScreen'
import { HistorialScreen } from "../screens/admin/historialScreen";
import { PerfilScreen } from '../screens/admin/perfilScreen'
import { NotificationScreen } from '../screens/admin/notificationScreen'
import { EmployeeScreen } from '../screens/admin/employeeScreen'
import { CreateEmployeScreen } from '../screens/admin/createEmployeeScreen'
import { EmployeeDetailScreen } from '../screens/admin/employeeDetailScreen'
const drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function AdminNav() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="admin-home" component={HomeAdminScreen} />
      <Stack.Screen name="detail-view" component={DetailViewScreen} />
      <Stack.Screen name='notification' component={NotificationScreen}/>
      <Stack.Screen name='zone_detail' component={ZoneDetailScreen}/>
      <Stack.Screen name='employee_detail' component={EmployeeDetailScreen}/>
    </Stack.Navigator>
  );
}

function DrawerHeader(props) {
  return (
    <View style={styles.headerDrawerContainer}>
      <Image
        style={styles.drawerLogo}
        source={require("../assets/images/security-logo.png")}
      />
      <View style={styles.headerDrawerBody}>
        <TouchableOpacity onPress={()=>{props.navigation.navigate('perfil')}}>
          <Text style={styles.headerDrawerText}>Ver Perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const deleteToken = async (props) => {
  await AsyncStorage.removeItem("userToken")
  .then(() => props.navigation.navigate("logIn"))
}
function DrawerBody(props) {
  //console.log("drawer body props---", props)
  return (
    <View>
      <DrawerItem
        label="Historal"
        onPress={() => {
          props.navigation.navigate("historial");
        }}
      />
      <DrawerItem
        label="Empleados"
        onPress={() => {
          props.navigation.navigate("empleados");
        }}
      />
      <DrawerItem
        label="Crear Empleado"
        onPress={() => {
          props.navigation.navigate("crear_empleado");
        }}
      />
      <DrawerItem 
      label="Zonas"
      onPress={() => props.navigation.navigate("zonas")}
      />
      <DrawerItem 
      label="Destinos"
      onPress={() => props.navigation.navigate("destinos")}
      />
      <DrawerItem
        label="Cerrar Sesion"
        onPress={() => {
          deleteToken(props)
        }}
      />
    </View>
  );
}

function DrawerFooter() {
  return (
    <View style={styles.footerDrawerContainer}>
      <Text>Security Inc. All Right Reserved</Text>
    </View>
  );
}
function DrawerContent(props) {
  return (
    <View>
      <DrawerHeader {...props}/>
      <DrawerBody {...props} />
    </View>
  );
}
export const AdminNavigator = () => {
  return (
    <drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <drawer.Screen name="home" component={AdminNav} />
      <drawer.Screen name="perfil" component={PerfilScreen} />
      <drawer.Screen name="historial" component={HistorialScreen} />
      <drawer.Screen name="crear_empleado" component={CreateEmployeScreen}/>
      <drawer.Screen name="empleados" component={EmployeeScreen}/>
      <drawer.Screen name="zonas" component={ZonasScreen}/>
      <drawer.Screen name="destinos" component={DestinyScreen}/>
    </drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerDrawerContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "grey",
    paddingVertical: 10,
  },
  drawerLogo: {
    width: 120,
    height: 120,
  },
  headerDrawerText: {
    fontSize: 14,
  },
  headerDrawerBody: {
    flexDirection: "row",
    marginTop: 8,
  },
  footerDrawerContainer: {
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderColor: "grey",
  },
});
