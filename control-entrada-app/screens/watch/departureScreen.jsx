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
import { storage } from "../../helpers/asyncStorage";
import { LoadingModal } from "../../components/loadingModal";
import { StatusModal } from "../../components/statusModal";
import { FormContainer } from "../../components/formContainer";
import Avatar from "../../components/avatar.component";

export const DepartureScreen = (props) => {
  console.log("PARAMETROS----", props.route.params);
  const { id } = props.route.params;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
    setSuccess(false);
    setLoading(true);
    const token = await storage.getItem("userToken");
    try {
      let res = await axios.put(`${API_PORT()}/api/updateVisit/${id}`, data, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      console.log("UPDATE ENTRY-----", res.data);
      if (!res.data.error) {
        console.log(res.data);
        setEntryCheck(true);
        setUpdateVisit(res.data.data);
        setSuccess(true);
        setLoading(false);
      }
    } catch (error) {
      console.log("error: ", error.message);
      setLoading(false);
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

      {visit && (
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <View style={styles.profileContainer}>
            <View style={{ marginBottom: 10, alignSelf: "center" }}>
              <Avatar.Picture
                size={120}
                uri={`${API_PORT()}/public/imgs/${visit.Visitante.picture}`}
              />
            </View>

            <Text style={styles.nameText}>
              {visit.Visitante.name} {visit.Visitante.lastName}
            </Text>

            <View style={styles.profileDataContainer}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>{visit.Visitante.dni}</Text>
                <Text style={styles.labelText}>dni</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>
                  {visit.UserZone.Zona.zone}
                </Text>
                <Text style={styles.labelText}>Zona</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>{visit.Destino.name}</Text>
                <Text style={styles.labelText}>Destino</Text>
              </View>
            </View>
          </View>

          <FormContainer title="Datos">
            <Text>
              Hora de entrada:
              {moment(visit.entryDate).format("HH:mm a")}
            </Text>
            <Image
              style={{
                width: "100%",
                height: 250,
                borderRadius: 5,
                marginVertical: 5,
                overflow: "hidden",
              }}
              source={{
                uri: `${API_PORT()}/public/imgs/${visit.Fotos[0].picture}`,
              }}
            />
            <Text>Observacion: {visit.descriptionEntry}</Text>
          </FormContainer>
          <FormContainer title="Salida">
            {visit.entryDate !== visit.departureDate ? (
              <>
                <Text>
                  Hora de salida
                  {moment(visit.departureDate).format("D, HH:mm a")}
                </Text>
                <Text>Observacion: {visit.descriptionDeparture ? visit.descriptionDeparture : '----'}</Text>
              </>
            ) : (
              <>
                <Input
                  title="Descripcion Salida (Opcional)"
                  value={departureText}
                  onChangeText={(value) => setDepartureText(value)}
                  shape="flat"
                />
              </>
            )}
          </FormContainer>
          <View style={{width: '90%'}}>
            <MainButton
              title="Registrar Salida"
              onPress={() => updateEntry()}
            />
          </View>
        </ScrollView>
      )}
      <LoadingModal status={loading} />
      <StatusModal status={succes} onClose={() => setSuccess(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 5,
    padding: 8,
    elevation: 5,
  },
  profileDataContainer: {
    flexDirection: "row",
    //backgroundColor: 'green',
    justifyContent: "space-between",
    marginVertical: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  dateContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
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
  captionText: {
    fontSize: 16,
    fontWeight: "normal",
    color: "red",
  },
});
