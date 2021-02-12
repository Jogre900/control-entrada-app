import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";

import { TopNavigation } from "../../components/TopNavigation.component";
import axios from "axios";
import moment from "moment";
import { API_PORT } from "../../config/index";
import { Ionicons } from "@expo/vector-icons";
import { MainColor } from "../../assets/colors";
import { Divider } from "../../components/Divider";
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";
import { storage } from '../../helpers/asyncStorage'

export const DepartureScreen = (props) => {
  console.log("PARAMETROS----", props.route.params);
  const { id } = props.route.params;

  const [visit, setVisit] = useState();
  const [departureText, setDepartureText] = useState("");
  const [entryCheck, setEntryCheck] = useState(false);
  const [updateVisit, setUpdateVisit] = useState();
  //GO BACK
  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  //FIND VISIT BY ID
  const findVisitId = async () => {
    try {
      let res = await axios.get(`${API_PORT()}/api/findVisitId/${id}`);
      console.log(res.data);
      if (!res.data.error) {
        setVisit(res.data.data);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  //UPDATE ENTRY
  const updateEntry = async () => {
    let data = {
      departureDate: moment(),
      descriptionDeparture: departureText,
    };
    const token = await storage.getItem('userToken');
    try {
      let res = await axios.put(`${API_PORT()}/api/updateVisit/${id}`, data, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      console.log("UPDATE ENTRY-----",res.data)
      if (!res.data.error) {
        console.log(res.data);
        setEntryCheck(true);
        setUpdateVisit(res.data.data);
        alert("salida registrada!");
      }
    } catch (error) {
      console.log("error: ", error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    findVisitId();
  }, [id, entryCheck]);

  return (
    // <>
    // {console.log("render"),
    //   visit ?
    //   <Text>{visit.Visitante.name}</Text>
    //   :
    //   <ActivityIndicator size="large" color={MainColor}/>
    // }
    // </>

    <View style={{ flex: 1 }}>
      <TopNavigation title="Marcar Salida" leftControl={goBackAction()} />

      {visit ? (
        <ScrollView>
          <View>
            <Image
              style={styles.profilePic}
              source={{
                uri: `${API_PORT()}/public/imgs/${visit.Visitante.picture}`,
              }}
            />
          </View>
          <View style={{alignItems: 'center'}}>

          
          <View style={styles.dateContainer}>
            <Text style={styles.containerTitle}>Datos</Text>
            <Divider size="small" />
            <Text>
              Nombre: {visit.Visitante.name} {visit.Visitante.lastName}
            </Text>
            <Text>DNI: {visit.Visitante.dni}</Text>
            <Text>Destino: {visit.Destino.name}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.containerTitle}>Ingreso</Text>
            <Divider size="small" />
            <Text>
              Hora de entrada: {moment(visit.entryDate).format("MMM Do, HH:mm a")}
            </Text>
            <Image
              style={{ width: 100, height: 100 }}
              source={{
                uri: `${API_PORT()}/public/imgs/${visit.Fotos[0].picture}`,
              }}
            />
            <Text>Observacion: {visit.descriptionEntry}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.containerTitle}>Salida</Text>
            <Divider size="small" />
            {visit.entryDate !== visit.departureDate ? (
              <>
                <Text>
                  Hora de salida
                  {moment(visit.departureDate).format("D, HH:mm a")}
                </Text>
                <Text>Observacion: {visit.descriptionDeparture}</Text>
              </>
            ) : (
              <>
                <Input
                  title="Descripcion Salida (Opcional)"
                  value={departureText}
                  onChangeText={(value) => setDepartureText(value)}
                  shape="flat"
                />
                <View>
                  <MainButton
                    title="Registrar Salida"
                    onPress={() => updateEntry()}
                  />
                </View>
              </>
            )}
          </View>
          </View>
        </ScrollView>
      ) : (
        <ActivityIndicator size="large" color={MainColor} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profilePicBox: {
    borderRadius: 5,
    backgroundColor: "#fff",
    //width: '100%',
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    width: "100%",
    height: 250,
    //borderRadius: 70,
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: "normal",
    color: MainColor,
  },
  dateContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: "normal",
    color: MainColor,
  },
  captionText: {
    fontSize: 16,
    fontWeight: "normal",
    color: "red",
  },
});
