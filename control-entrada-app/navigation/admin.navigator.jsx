import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "../helpers/asyncStorage";
import DrawerHeader from "./drawerHeader";
import { MainColor, lightColor } from "../assets/colors";

//screens
import HomeAdminScreen from "../screens/admin/homeAdminScreen";
import { DetailViewScreen } from "../screens/admin/detailViewScreen";
import ZonasScreen from "../screens/admin/zonesScreen";
import ZoneDetailScreen from "../screens/admin/zoneDetailScreen";
import SuperZoneDetailScreen from "../screens/admin/superZoneDetailScreen";
import AsignEmployee from "../screens/admin/asignEmployeeScreen";
import { NotificationScreen } from "../screens/admin/notificationScreen";
import CompanyScreen from "../screens/admin/createCompanyScreen";
import DestinyScreen from "../screens/admin/destinyScreen";
import SuperDestinyScreen from "../screens/admin/superDestinyScreen";
import HistorialScreen from "../screens/admin/historialScreen";
import PerfilScreen from "../screens/admin/perfilScreen";
import { EditProfileScreen } from "../screens/admin/editProfileScreen";
import EmployeeScreen from "../screens/admin/employeeScreen";
import CreateEmployeScreen from "../screens/admin/createEmployeeScreen";
import { EmployeeDetailScreen } from "../screens/admin/employeeDetailScreen";
import CreateZoneScreen from '../screens/admin/createZoneScreen'
const drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const options = {
  gestureEnabled: true,
  gestureDirection: "horizontal",
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

function AdminNav() {
  return (
    <Stack.Navigator headerMode="none" initialRouteName="admin-home">
      <Stack.Screen name="admin-home" component={HomeAdminScreen} />
      <Stack.Screen
        name="detail-view"
        component={DetailViewScreen}
        options={options}
      />
      <Stack.Screen name="notification" component={NotificationScreen} />
      <Stack.Screen
        name="edit_profile"
        component={EditProfileScreen}
        options={options}
      />
      <Stack.Screen
        name="zone_detail"
        component={ZoneDetailScreen}
        options={options}
      />
      <Stack.Screen name="CREATE_ZONE" component={CreateZoneScreen} />
      <Stack.Screen name="asign_employee" component={AsignEmployee} />
      <Stack.Screen
        name="employee_detail"
        component={EmployeeDetailScreen}
        options={options}
      />
    </Stack.Navigator>
  );
}

const adminDrawerData = [
  { label: "Inicio", route: "admin-home", icon: "ios-home" },
  //{ label: "Empresa", route: "Company", icon: "ios-business" },
  { label: "Historial", route: "Historial", icon: "ios-calendar" },
  { label: "Empleados", route: "Employee", icon: "ios-people" },
  { label: "Crear Empleado", route: "CreateEmployee", icon: "ios-person-add" },
  { label: "Zonas", route: "Zones", icon: "md-globe" },
  { label: "Destinos", route: "Destiny", icon: "ios-pin" },
];
const superDrawerData = [
  { label: "Inicio", route: "admin-home", icon: "ios-home" },
  { label: "Historial", route: "Historial", icon: "ios-calendar" },
  { label: "Empleados", route: "Employee", icon: "ios-people" },
  { label: "Zona", route: "Zones", icon: "md-globe" },
  { label: "Destinos", route: "Destiny", icon: "ios-pin" },
];
const DrawerContent = (props) => {
  const dispatch = useDispatch();
  const privilege = useSelector((state) => state.profile.login.privilege);
  const logOut = () => {
    return new Promise((resolve, reject) => {
      resolve(dispatch({ type: "CLEAR_STORAGE" }));
    });
  };
  const deleteToken = async () => await storage.removeItem("userToken");
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <DrawerHeader {...props} />
      <DrawerContentScrollView
        conte
        contentContainerStyle={{
          flex: 1,
          //backgroundColor: 'red'
        }}
      >
        <View
          style={{
            flex: 1,
            //backgroundColor: 'beige'
          }}
        >
          {privilege === "Admin"
            ? adminDrawerData.map((data, i) => (
                <DrawerItem
                  label={data.label}
                  labelStyle={{ fontSize: 15 }}
                  icon={({ size, color }) => (
                    <Ionicons name={data.icon} size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate(data.route)}
                  key={i}
                />
              ))
            : superDrawerData.map((data, i) => (
                <DrawerItem
                  label={data.label}
                  labelStyle={{ fontSize: 15 }}
                  icon={({ size, color }) => (
                    <Ionicons name={data.icon} size={size} color={color} />
                  )}
                  onPress={() => props.navigation.navigate(data.route)}
                  key={i}
                />
              ))}
        </View>
      </DrawerContentScrollView>
      <View
        style={
          {
            //backgroundColor: 'lightblue',
          }
        }
      >
        <DrawerItem
          label="Cerrar Sesion"
          labelStyle={{ fontSize: 15 }}
          icon={({ size, color }) => (
            <Ionicons name="ios-log-out" size={size} color={color} />
          )}
          onPress={() => {
            //logOut().then(() => alert("SE BORRO EL STORE DE REDUX!!!"));
            storage.removeItem('userToken').then(() =>
              props.navigation.navigate("Main", { logOut: true })
            );
          }}
        />
      </View>
    </View>
  );
};

const AdminNavigator = () => {
  const privilege = useSelector((state) => state.profile.login.privilege);
  return (
    <drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <drawer.Screen name="Home" component={AdminNav} />
      <drawer.Screen name="Profile" component={PerfilScreen} />
      {/* <drawer.Screen name="Company" component={CompanyScreen} /> */}
      <drawer.Screen name="Historial" component={HistorialScreen} />
      {privilege === "Admin" && (
        <drawer.Screen name="CreateEmployee" component={CreateEmployeScreen} />
      )}
      <drawer.Screen name="Employee" component={EmployeeScreen} />
      {privilege === "Admin" ? (
        <drawer.Screen name="Zones" component={ZonasScreen} />
      ) : (
        <drawer.Screen name="Zones" component={SuperZoneDetailScreen} />
      )}
      {privilege === "Admin" ? (
        <drawer.Screen name="Destiny" component={DestinyScreen} />
      ) : (
        <drawer.Screen name="Destiny" component={SuperDestinyScreen} />
      )}
    </drawer.Navigator>
  );
};

export default AdminNavigator;

const styles = StyleSheet.create({
  headerDrawerContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "grey",
    paddingVertical: 10,
  },
  drawerLogo: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
  },
  footerDrawerContainer: {
    paddingTop: 10,
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderColor: "grey",
  },
});
