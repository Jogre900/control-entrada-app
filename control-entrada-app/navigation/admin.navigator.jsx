import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { View, StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { storage } from "../helpers/asyncStorage";
import DrawerHeader from "./drawerHeader";
import { routes } from "../assets/routes";

//screens
import HomeAdminScreen from "../screens/admin/homeAdminScreen";
import { DetailViewScreen } from "../screens/admin/detailViewScreen";
import ZonasScreen from "../screens/admin/zonesScreen";
import ZoneDetailScreen from "../screens/admin/zoneDetailScreen";
import AsignEmployee from "../screens/admin/asignEmployeeScreen";
import { NotificationScreen } from "../screens/admin/notificationScreen";
import DestinyScreen from "../screens/admin/destinyScreen";
import HistorialScreen from "../screens/admin/historialScreen";
import PerfilScreen from "../screens/admin/perfilScreen";
import EditProfileScreen from "../screens/admin/editProfileScreen";
import EmployeeScreen from "../screens/admin/employeeScreen";
import CreateEmployeScreen from "../screens/admin/createEmployeeScreen";
import { EmployeeDetailScreen } from "../screens/admin/employeeDetailScreen";
import { TutorialNavigator } from "./tutorial.navigator";

const drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const options = {
  gestureEnabled: true,
  gestureDirection: "horizontal",
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

function AdminNav() {
  const tutorial = useSelector((state) => state.profile.tutorial);
  console.log("tutorial--", tutorial);
  return (
    <Stack.Navigator headerMode="none" initialRouteName={tutorial ? routes.TUTORIAL : routes.ADMIN_HOME}>
      <Stack.Screen name={routes.TUTORIAL} component={TutorialNavigator} />
      <Stack.Screen name={routes.ADMIN_HOME} component={HomeAdminScreen} />
      <Stack.Screen name={routes.DETAIL_VIEW} component={DetailViewScreen} options={options} />
      <Stack.Screen name={routes.NOTIFICATION} component={NotificationScreen} />
      <Stack.Screen name={routes.EDIT_PROFILE} component={EditProfileScreen} options={options} />
      <Stack.Screen name={routes.ZONE_DETAIL} component={ZoneDetailScreen} options={options} />
      {/* <Stack.Screen name="asign_employee" component={AsignEmployee} /> */}
      <Stack.Screen name={routes.CREATE_EMPLOYEE} component={CreateEmployeScreen} options={options}/>
      <Stack.Screen name={routes.EMPLOYEE_DETAIL} component={EmployeeDetailScreen} options={options} />
    </Stack.Navigator>
  );
}

const adminDrawerData = [
  { label: "Inicio", route: routes.ADMIN_HOME, icon: "ios-home" },
  { label: "Historial", route: routes.HISTORIAL, icon: "ios-calendar" },
  { label: "Empleados", route: routes.EMPLOYEE, icon: "ios-people" },
  { label: "Zonas", route: routes.ZONES, icon: "md-globe" },
  { label: "Destinos", route: routes.DESTINY, icon: "ios-pin" },
  { label: "Tutorial", route: routes.TUTORIAL, icon: "md-document", params: true },
];
const superDrawerData = [
  { label: "Inicio", route: routes.ADMIN_HOME, icon: "ios-home" },
  { label: "Historial", route: routes.HISTORIAL, icon: "ios-calendar" },
  { label: "Empleados", route: routes.EMPLOYEE, icon: "ios-people" },
  { label: "Zona", route: routes.ZONE_DETAIL, icon: "md-globe" },
  { label: "Destinos", route: routes.DESTINY, icon: "ios-pin" },
];

const TUTO = 123;
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
                  icon={({ size, color }) => <Ionicons name={data.icon} size={size} color={color} />}
                  onPress={() =>
                    props.navigation.navigate(
                      data.route,
                      data.params && {
                        screen: "PAGE_1",
                        params: { TUTO },
                      }
                    )
                  }
                  key={i}
                />
              ))
            : superDrawerData.map((data, i) => (
                <DrawerItem
                  label={data.label}
                  labelStyle={{ fontSize: 15 }}
                  icon={({ size, color }) => <Ionicons name={data.icon} size={size} color={color} />}
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
          icon={({ size, color }) => <Ionicons name="ios-log-out" size={size} color={color} />}
          onPress={() => {
            //logOut().then(() => alert("SE BORRO EL STORE DE REDUX!!!"));
            storage.removeItem("userToken").then(() => props.navigation.navigate(routes.MAIN, { logOut: true }));
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
      <drawer.Screen name={routes.PROFILE} component={PerfilScreen} />
      {/* <drawer.Screen name="Company" component={CompanyScreen} /> */}
      <drawer.Screen name={routes.HISTORIAL} component={HistorialScreen} />
      
      <drawer.Screen name={routes.EMPLOYEE} component={EmployeeScreen} />
      {privilege === "Admin" ? <drawer.Screen name={routes.ZONES} component={ZonasScreen} /> : <drawer.Screen name={routes.ZONE_DETAIL} component={ZoneDetailScreen} />}
      <drawer.Screen name={routes.DESTINY} component={DestinyScreen} />
      <Stack.Screen name={routes.TUTORIAL} component={TutorialNavigator} />
    </drawer.Navigator>
  );
};

export default AdminNavigator;
