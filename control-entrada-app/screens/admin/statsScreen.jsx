import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { helpers } from "../../helpers";
import { TopNavigation } from "../../components/TopNavigation.component";
import { routes } from "../../assets/routes";
import { BackAction } from "../../helpers/ui/ui";
import Avatar from "../../components/avatar.component";
import { useSelector } from "react-redux";
import { API_PORT } from "../../config";
export const StatsScreen = ({ navigation }) => {
  const [zoneMax, setZoneMax] = useState();
  const [destinyMax, setDestinyMax] = useState();
  const [visitMax, setVisitMax] = useState();
  const company = useSelector((state) => state.profile.company);
  const zones = useSelector((state) => state.zones.zones);
  const visits = useSelector((state) => state.visits.today);
  console.log(visits);
  let zonesId = [];
  zones.map(({ id }) => zonesId.push(id));
  const fetchZoneMax = async () => {
    try {
      const res = await helpers.zoneMaxVisit(company[0].id);
      //console.log("res zone", res.data)
      if (res.data.error) {
        console.log(res.data.msg);
        return;
      } else {
        setZoneMax(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchDestinyMax = async () => {
    console.log("zone id--", zonesId);
    try {
      const res = await helpers.destinyMaxVisit(zonesId);
      if (res.data.error) {
        console.log(res.data.msg);
      } else {
        setDestinyMax(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchVisitRegMax = async () => {
    try {
      const res = await helpers.maxUserVisit(company[0].id);
      if (res.data.error) {
        console.log(res.data.msg);
      } else {
        setVisitMax(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchZoneMax();
  }, []);
  useEffect(() => {
    fetchDestinyMax();
  }, []);
  useEffect(() => {
    fetchVisitRegMax();
  }, []);
  return (
    <View style={styles.container}>
      <TopNavigation
        title="Datos Generales"
        leftControl={BackAction(navigation, routes.ADMIN_HOME)}
      />
      <TouchableOpacity>
        <Text>Visitas totales registradas</Text>
        <Text>{visits.length ? visits.length : "----"}</Text>
        {visits
          .filter((_, index) => index < 3)
          .map((elem) => {
            return (
              <Avatar.Picture
                size={32}
                uri={`${API_PORT()}/public/imgs/${elem.Visitante.picture}`}
              />
            );
          })}
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Seguridad con mas registro de entradas</Text>
        {visitMax && (
          <>
            <View style={styles.pictureContainer}>
              <Avatar.Picture
                size={120}
                uri={`${API_PORT()}/public/imgs/${visitMax.Employee.picture}`}
              />
            </View>
            <Text>
              {visitMax.Employee.name} {visitMax.Employee.lastName}
            </Text>
            <Text>Entradas: {visitMax.UserCompany[0].visits}</Text>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Zona con mas visitas</Text>
        {zoneMax && (
          <Text>
            {zoneMax.zone} {zoneMax.visits}
          </Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity>
        <Text>Destino con mas visitas</Text>
        {destinyMax && (
          <Text>
            {destinyMax.name} {destinyMax.visits}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pictureContainer: {
    height: 120,
    width: 120,
    alignSelf: "center",
    position: "relative",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
    borderRadius: 120 / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
