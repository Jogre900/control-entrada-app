import React from "react";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from '../lib/firebase'

//screens
import { HomeSuperScreen } from "../screens/super/homeSuperScreen";
import { DetailViewScreen } from "../screens/super/detailViewScreen";
import {ZonasScreen} from '../screens/super/zonesScreen'
import { ZoneDetailScreen } from '../screens/super/zoneDetailScreen'
import { DestinyScreen } from '../screens/super/destinyScreen'
import { HistorialScreen } from "../screens/super/historialScreen";
import { PerfilScreen } from '../screens/super/perfilScreen'
import { NotificationScreen } from '../screens/super/notificationScreen'
import { EmployeeScreen } from '../screens/super/employeeScreen'
import { CreateEmployeScreen } from '../screens/super/createEmployeeScreen'
import { EmployeeDetailScreen } from '../screens/super/employeeDetailScreen'
const drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function SupervicerNav() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="supervicer-home" component={HomeSuperScreen} />
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
function DrawerBody(props) {
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
          firebase.auth().signOut()
          .then(() => {
            props.navigation.popToTop()
          })
          .catch(error => {
            console.log(error)
          })
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
export const SuperNavigator = () => {
  return (
    <drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <drawer.Screen name="home" component={SupervicerNav} />
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
