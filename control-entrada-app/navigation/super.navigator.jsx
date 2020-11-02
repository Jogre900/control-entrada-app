import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView } from "@react-navigation/drawer";
import { Ionicons } from '@expo/vector-icons'
//SCREENS
import { DetailViewScreen } from "../screens/admin/detailViewScreen";
import { ZoneDetailScreen } from "../screens/admin/zoneDetailScreen";
import { NotificationScreen } from "../screens/admin/notificationScreen";
import ZonasScreen from "../screens/admin/zonesScreen";
import { DestinyScreen } from "../screens/admin/destinyScreen";
import { HistorialScreen } from "../screens/admin/historialScreen";
import PerfilScreen from "../screens/admin/perfilScreen";
import { EmployeeScreen } from "../screens/admin/employeeScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const SuperNav = () => {
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="detail-view" component={DetailViewScreen} />
    <Stack.Screen name="notification" component={NotificationScreen} />
    <Stack.Screen name="zone_detail" component={ZoneDetailScreen} />
  </Stack.Navigator>;
};

const drawerData = [
    {label: "Perfil", route: "Profile", icon: "ios-person"},
    {label: "Historial", route: "Historial", icon: "ios-calendar"},
    {label: "Empleados", route: "Employee", icon: "ios-people"},
    {label: "Zona", route: "Zones", icon: "ios-business"},
    {label: "Destinos", route: "Destiny", icon: "ios-pin"},
]

const DrawerContent = (props) => {
  return (
    <View>
      <DrawerHeader {...props} />
      <DrawerBody {...props} />
    </View>
  );
};

const DrawerBody = ({navigation}) => {
    return (
        <View style={{flex: 1}}>
            <DrawerContentScrollView>
                <View> style={styles.drawerSection}
                    <Text>Header Drawer Section</Text>
                </View>
                <View style={styles.drawerSection}>
                    {
                        drawerData.map((data, i) => (
                            <DrawerItem
                            key={i}
                            icon={({color, size})=> <Ionicons name={data.icon} color={color} size={size}/>}
                            label={data.label}
                            onPress={() => navigation.navigate(route)}
                            />
                        ))
                    }
                </View>
            </DrawerContentScrollView>
            <View style={styles.bottonDrawerSection}>
                <Text>Drawer Botton</Text>
            </View>
        </View>
    )
}

export const SuperDrawer = () => {
  <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
    <Drawer.Screen name="SuperHome" component={SuperNav} />
    <drawer.Screen name="Profile" component={PerfilScreen} />
    <drawer.Screen name="Hitorial" component={HistorialScreen} />
    <drawer.Screen name="Employee" component={EmployeeScreen} />
    <drawer.Screen name="Zones" component={ZonasScreen} />
    <drawer.Screen name="Destiny" component={DestinyScreen} />
  </Drawer.Navigator>;
};

const styles = StyleSheet.create({
    drawerSection: {
        flex: 1
    },
    bottonDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#4f4f4f',
        borderTopWidth: 1
    }
})