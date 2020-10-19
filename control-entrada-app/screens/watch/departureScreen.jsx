import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
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

export const DepartureScreen = (props) => {
  console.log("PARAMETROS----", props.route.params);
  
    const item = props.route.params.item
    const citizen = props.route.params.citizen
  // if(props.route.params.citizen) {const citizen = props.route.params.item}
  // if(props.route.params.entry) {const entry = props.route.params.item }
  
  console.log("item-----", item)
  // console.log("citizen:-----", citizen)
  // console.log("entry-----", entry)

  //const { entry, citizen, item } = props.route.params;
  const [departureText, setDepartureText] = useState("");
  const [entryCheck, setEntryCheck] = useState(false);
  const [updateVisit, setUpdateVisit] = useState()
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

  //UPDATE ENTRY
  const updateEntry = async () => {
    let data = {
      departureDate: moment().format("MMM d YY, HH:mm a"),
      descriptionDeparture: departureText,
    };
    try {
      let res = await axios.put(
        `${API_PORT()}/api/updateVisit/${entry.id}`,
        data
      );
      if (res) {
        console.log(res.data);
        setEntryCheck(true);
        setUpdateVisit(res.data.data)
      }
    } catch (error) {
      console.log("error: ", error.message);
    }
  };
const algo = "otra cosa"
  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Marcar Salida" leftControl={goBackAction()} />
  <Text>{citizen.name}</Text>
      {/* <ScrollView>
        <View>
          <Image
            style={styles.profilePic}
            source={{
              uri: `${API_PORT()}/public/imgs/${entry.Fotos[0].picture}`,
            }}
          /> 
        </View>
         <View style={styles.dateContainer}>
          <Text>Datos de Ingreso</Text>
          <Divider size="small" />
          <Text>
            Nombre {item.Citizen.name} || {citizen.name}
            {citizen.lastName || item.Citizen.lastName}
          </Text>
          <Text>DNI{citizen.dni}</Text>
          <Text>Destino{entry.Destination.name}</Text>
          <Text>
            Hora de entrada{moment(entry.entryDate).format("MMM d, HH:mm a")}
          </Text>
          <Text>Observacion entrada {entry.descriptionEntry}</Text>

          {
            <View>
              <Text>
                Hora de salida
                {moment(entry.departureDate).format("MMM d, HH:mm a") || moment(updateVisit.departureDate).format("MMM d, HH:mm a")}
              </Text>
              <Text>Observacion salida {entry.descriptionDeparture || updateVisit.descriptionDeparture}</Text>
            </View>
          }
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
          <MainButton title="Registrar Salida" onPress={() => updateEntry()} />
        </View>
      </ScrollView> */}
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
