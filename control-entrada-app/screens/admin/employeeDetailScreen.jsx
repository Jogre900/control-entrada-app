import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from "react-native";

//COMPONENT
import { TopNavigation } from "../../components/TopNavigation.component";
import { API_PORT, ThirdColor } from "../../config/index";
import { Ionicons } from "@expo/vector-icons";
import {Divider} from '../../components/Divider'
import moment from 'moment'

export const EmployeeDetailScreen = (props) => {
  console.log(props.route.params);
  const profile = props.route.params;
  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Employee");
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Perfil" leftControl={goBackAction()} />
      <View style={styles.section1}>
        <Image
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            resizeMode: "cover",
          }}
          source={{ uri: `${API_PORT()}/public/imgs/${profile.picture}` }}
        />
        <Text style={styles.profileName}>
          {profile.name} {profile.lastName}
        </Text>
        <Text>{profile.email}</Text>
        <View style={styles.privilegeBox}>
          <Text style={styles.privilegeText}>{profile.privilege}</Text>
        </View>
      </View>
      <View style={styles.section2}>
        <Text>Datos Personales</Text>
        <Divider size="small" />
        {/* <View>
          <Text>{profile.dni}</Text>

          {profile.userZone.length > 0 ? (
             <View>
              <Text>Contratado el: {profile.userZone[0].assignationDate}</Text>
              <Text>Cambio de Turno: {profile.userZone[0].changeTurnDate}</Text>
            </View> 
          ) : (
            <Text>
              Registrado el: {moment(profile.createdAt).format("D MMM YYYY")}
            </Text>
          )} 
        </View> */}

        {/* <View>
          <Ionicons name="ios-business" size={28} color={ThirdColor} />
          {profile.userZone.length > 0 ? (
            <Text>{profile.userZone[0].Zone.zone}</Text>
          ) : (
            <Text>El usuario no posea zona asignada.</Text>
          )}
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section1: {
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  section2: {
    height: "50%",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "100",
    color: "black",
  },
  privilegeBox: {
    backgroundColor: ThirdColor,
    borderRadius: 12,
  },
  privilegeText: {
    alignSelf: "center",
    fontSize: 18,
    color: "#fff",
    fontWeight: "normal",
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});
