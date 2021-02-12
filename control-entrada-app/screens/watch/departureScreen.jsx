import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
  ActivityIndicator
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
import AsyncStorage from "@react-native-community/async-storage";

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
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableWithoutFeedback>
      </View>
    );
  };
  //FIND VISIT BY ID
  const findVisitId = async () => {
    try {
      let res = await axios.get(`${API_PORT()}/api/findVisitId/${id}`);
      console.log(res.data)
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
    let token = await getToken();
    try {
      let res = await axios.put(`${API_PORT()}/api/updateVisit/${id}`, data, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      if (!res.data.error) {
        console.log(res.data);
        setEntryCheck(true);
        setUpdateVisit(res.data.data);
        alert("salida registrada!")
      }
    } catch (error) {
      console.log("error: ", error.message);
      alert(error.message)
    }
  };

  //GET TOKEN
  const getToken = async () => {
    const token = await AsyncStorage.getItem("watchToken");
    if (token) {
      console.log("token------", token);
      return token;
    }
  };
  useEffect(() => {
    findVisitId();
  }, [id]);

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
          <View style={styles.dateContainer}>
            <Text>Datos de Ingreso</Text>
            <Divider size="small" />
            <Text>
              Nombre {visit.Visitante.name}
              {visit.Visitante.lastName}
            </Text>
            <Text>DNI{visit.Visitante.dni}</Text>
            <Text>Visita</Text>
            <Divider size="small" />
            <Text>Destino{visit.Destino.name}</Text>
            <Text>
              Hora de entrada{moment(visit.entryDate).format("MMM Do, HH:mm a")}
            </Text>
            <Image
              style={{ width: 100, height: 100 }}
              source={{
                uri: `${API_PORT()}/public/imgs/${visit.Fotos[0].picture}`,
              }}
            />
            <Text>Observacion entrada {visit.descriptionEntry}</Text>

            <View>
              <Text>
                Hora de salida
                {moment(visit.departureDate).format("D, HH:mm a")}
              </Text>
              <Text>Observacion salida {visit.descriptionDeparture}</Text>
            </View>

            {
              <Input
                title="Descripcion Salida (Opcional)"
                value={departureText}
                onChangeText={(value) => setDepartureText(value)}
                shape="flat"
              />
            }
          </View>
          <View>
            <MainButton
              title="Registrar Salida"
              onPress={() => updateEntry()}
            />
          </View>
        </ScrollView>
      ) : <ActivityIndicator size="large" color={MainColor}/>
      }
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
