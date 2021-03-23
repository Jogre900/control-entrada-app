import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";

//COMPONENT
import { TopNavigation } from "../../components/TopNavigation.component";
import { API_PORT } from "../../config/index";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "../../components/Divider";
import { FormContainer } from "../../components/formContainer";
import { Spinner } from "../../components/spinner";
import { MainColor, ThirdColor } from "../../assets/colors";
import { routes } from '../../assets/routes'
import { BackAction } from '../../helpers/ui/ui'
import Avatar from "../../components/avatar.component";
import axios from "axios";
import moment from "moment";

export const EmployeeDetailScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  console.log("DETAIL EMPLOYEE-----", route.params);
  const { id } = route.params;

  const requestUser = async () => {
    setLoading(true);
    setUser();
    try {
      const res = await axios.get(`${API_PORT()}/api/findUser/${id}`);
      if (!res.data.error) {
        console.log(res.data.data)
        setUser(res.data.data);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  useEffect(() => {
    requestUser();
  }, [id]);
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Perfil" leftControl={BackAction(navigation, routes.EMPLOYEE)} />
      {loading && <Spinner message="Cargando..." />}
      {user && (
        <View style={{alignItems: 'center'}}>
          <View style={styles.profileContainer}>
            <View style={styles.pictureContainer}>
              <Avatar.Picture
                size={120}
                uri={`${API_PORT()}/public/imgs/${user.Employee.picture}`}
              />
            </View>
            <Text style={styles.profileName}>
              {user.Employee.name} {user.Employee.lastName}
            </Text>
            <View style={styles.profileDataContainer}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>
                  {user.UserCompany[0].privilege}
                </Text>
                <Text style={styles.labelText}>Rol</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>
                  {user.userZone[0].Zona.zone}
                </Text>
                <Text style={styles.labelText}>Zona</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>{user.UserCompany.length ? user.UserCompany[0].visits : '0'}</Text>
                <Text style={styles.labelText}>Entradas</Text>
              </View>
            </View>

            {/* <Text>{user.email}</Text>
            <View style={styles.privilegeBox}>
              <Text style={styles.privilegeText}>
                {user.UserCompany[0].privilege}
              </Text>
            </View> */}
          </View>
          <FormContainer>
            <View>
            <Text>Email: {user.email}</Text>
              <Text>DNI: {user.Employee.dni}</Text>

              {user.userZone.length > 0 ? (
                <View>
                  <Text>
                    Contratado el:
                    {moment(user.userZone[0].assignationDate).format(
                      "D MMM YYYY"
                    )}
                  </Text>
                  <Text>
                    Fin de Contrato:
                    {moment(user.userZone[0].changeTurnDate).format(
                      "D MMM YYYY"
                    )}
                  </Text>
                </View>
              ) : (
                <Text>
                  Registrado el: {moment(user.createdAt).format("D MMM YY")}
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
          </FormContainer>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 5,
    padding: 8,
    elevation: 5,
  },
  pictureContainer: {
    alignSelf: "center",
    position: "relative",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
    borderRadius: 120 / 2,
    backgroundColor: "#fff",
  },
  profileDataContainer: {
    flexDirection: "row",
    //backgroundColor: 'green',
    justifyContent: "space-between",
    marginVertical: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  contentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
  },
  labelText: {
    fontSize: 14,
    color: "#8e8e8e",
  },
  section2: {
    height: "50%",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "100",
    color: "black",
    alignSelf: 'center'
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
