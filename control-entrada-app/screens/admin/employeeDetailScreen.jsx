import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

//COMPONENT
import { TopNavigation } from "../../components/TopNavigation.component";
import { API_PORT } from "../../config/index";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "../../components/Divider";
import { MainColor, ThirdColor } from "../../assets/colors";
import axios from "axios";
import moment from "moment";

export const EmployeeDetailScreen = (props) => {
  const [user, setUser] = useState();
  console.log("DETAIL EMPLOYEE-----", props.route.params);
  const { id } = props.route.params;
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

  const requestUser = async () => {
    setUser();
    try {
      const res = await axios.get(`${API_PORT()}/api/findUser/${id}`);
      if (!res.data.error) {
        setUser(res.data.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    requestUser();
  }, [id]);
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Perfil" leftControl={goBackAction()} />
      {user ? (
        <View>
          <View style={styles.section1}>
            <Image
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                resizeMode: "cover",
              }}
              source={{
                uri: `${API_PORT()}/public/imgs/${user.Employee.picture}`,
              }}
            />
            <Text style={styles.profileName}>
              {user.Employee.name} {user.Employee.lastName}
            </Text>
            <Text>{user.email}</Text>
            <View style={styles.privilegeBox}>
              <Text style={styles.privilegeText}>
                {user.UserCompany[0].privilege}
              </Text>
            </View>
          </View>
          <View style={styles.section2}>
            <Text>Datos Personales</Text>
            <Divider size="small" />
            <View>
              <Text>DNI: {user.Employee.dni}</Text>

              {user.userZone.length > 0 ? (
                <View>
                  <Text>
                    Contratado el:{" "}
                    {moment(user.userZone[0].assignationDate).format(
                      "D MM YYYY"
                    )}
                  </Text>
                  <Text>
                    Cambio de Turno:{" "}
                    {moment(user.userZone[0].changeTurnDate).format(
                      "d MM YYYY"
                    )}
                  </Text>
                </View>
              ) : (
                <Text>
                  Registrado el: {moment(user.createdAt).format("D MMM YYYY")}
                </Text>
              )}
            </View>

            <View style={styles.dataContainer}>
              <Text style={styles.containerTitle}>Area de Trabajo</Text>
              <Ionicons name="ios-business" size={28} color={ThirdColor} />
              <Divider size="small" />
              {user.userZone.length > 0 ? (
                <Text>Asignado: {user.userZone[0].Zona.zone}</Text>
              ) : (
                <Text>El usuario no posea zona asignada.</Text>
              )}
            </View>
          </View>
        </View>
      ) : (
        <ActivityIndicator size="small" color={MainColor} />
      )}
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
  dataContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: "normal",
    color: MainColor,
  },
});
