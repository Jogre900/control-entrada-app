import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { TopNavigation } from "../../components/TopNavigation.component";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import FireMethods from "../../lib/methods.firebase";
import * as ImagePicker from "expo-image-picker";
import moment from "moment";
import axios from "axios";
import { API_PORT } from "../../config/index";

const { width } = Dimensions.get("window");
const cover = require("../../assets/images/background.jpg");
const profilePic = require("../../assets/images/female-2.jpg");
const watchPic = require("../../assets/images/male-2.jpg");

export const Salida2Screen = (props) => {
  const [dni, setDni] = useState("");
  const [messageText, setMessageText] = useState("");
  const [profile, setProfile] = useState();
  const [visitId, setVisitId] = useState("");
  const [visits, setVisits] = useState([]);
  const [updateVisit, setUpdateVisit] = useState();
  const [destiny, setDestiny] = useState({});
  const [watchman, setWatchman] = useState();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [entryCheck, setEntryCheck] = useState(false);
  const [saved, setSaved] = useState(false);

  const [departure, setDeparture] = useState();

  const searchRef = useRef();

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
  //REQUEST VISIT
  const requestVisit = async () => {
    if (!dni) {
      Alert.alert("Debe ingresar un DNI valido.");
    } else {
      try {
        let res = await axios.get(`${API_PORT()}/api/findVisit/${dni}`);
        if (res) {
          setProfile(res.data.data);
          if (
            res.data.data.Visitas[0].entryDate !==
            res.data.data.Visitas[0].departureDate
          ) {
            setEntryCheck(true);
            console.log("las horas son distintas!!!!!");
          } else {
            console.log("las horas son iguales!!!!!");
            setEntryCheck(false);
          }

          setVisits(res.data.data.Visitas[0]);

          setVisitId(res.data.data.Visitas[0].id);
          console.log("Visitas//----", res.data.data.Visitas[0]);
          setDestiny(res.data.data.Visitas[0].Destination);

          setWatchman(res.data.data.Visitas[0].UserZone.User);
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
  };

  //update entry
  const updateEntry = async () => {
    setSaving(true);
    setSuccess(false);
    setSaved(false);
    let data = {
      departureDate: moment(),
      descriptionDeparture: departure,
    };
    try {
      let res = await axios.put(
        `${API_PORT()}/api/updateVisit/${visitId}`,
        data
      );
      if (res) {
        console.log(res.data);
        setUpdateVisit(res.data.data);
        setSuccess(true);
        setSaving(false);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  //LOADING
  const Splash = () => {
    return (
      <View>
        <ActivityIndicator size="large" color="#ff7e00" />
      </View>
    );
  };

  //REGISTER
  const saveSuccess = () => {
    Alert.alert("Registro Exitoso!");
    setSuccess(false);
    setSaved(true);
  };

  // useEffect(() => {
  //   requestVisit()
  // }, [saved])
  const MessageView = (props) => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>{props.message}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Salida" leftControl={goBackAction()} />
      <View style={styles.searchBox}>
        <View style={{ width: "70%" }}>
          <Input
            title="Buscar por DNI"
            shape="round"
            alignText="center"
            style={{ backgroundColor: "white" }}
            retrunKeyType="search"
            onSubmitEditing={() => requestVisit()}
            onChangeText={(valor) => setDni(valor)}
            value={dni}
          />
        </View>
        <TouchableOpacity onPress={() => requestVisit()}>
          <Ionicons name="ios-search" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {profile != null ? (
        <View style={{ flex: 1 }}>
          <ImageBackground source={cover} style={styles.imgBackground}>
            <View style={styles.cover}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {/* <Ionicons name="ios-person" size={120} color="#fff" /> */}
                <View style={{ position: "relative", marginBottom: 10 }}>
                  <Image
                    source={{
                      uri: `${API_PORT()}/public/imgs/${profile.picture}`,
                    }}
                    style={styles.profilePic}
                  />
                </View>
                <View style={styles.nameBox}>
                  <Text style={styles.nameText}>
                    {profile.name} {profile.lastName}
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={{ width: "75%" }}>
              <View style={styles.dataBox}>
                <Text style={styles.labelText}>DNI:</Text>
                <Text style={styles.dataText}>{profile.dni}</Text>
              </View>
              <View style={styles.dataBox}>
                <Text style={styles.labelText}>Destino:</Text>
                <Text style={styles.dataText}>{destiny.name}</Text>
              </View>
              <View style={styles.dataBox}>
                <Text style={styles.labelText}>Hora de Entrada:</Text>
                <Text style={styles.dataText}>
                  {moment(visits.entryDate).format("HH:mm a")}
                </Text>
              </View>
              <View>
                {saved || entryCheck ? (
                  <View>
                    <View style={styles.dataBox}>
                      <Text style={styles.labelText}>Hora de Salida:</Text>
                      <Text style={styles.dataText}>
                        {moment(visits.departureDate).format("HH:mm a") ||
                          moment(updateVisit.departureDate).format("HH:mm a")}
                      </Text>
                    </View>
                    <View style={styles.dataBox}>
                      <Text style={styles.labelText}>Descipcion Salida:</Text>
                      <Text style={styles.dataText}>
                        {
                          visits.descriptionDeparture
                          //&& updateVisit.descriptionDeparture
                        }
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <Input
                      title="Descipcion Salida (opcional)"
                      secureTextEntry={false}
                      shape="flat"
                      icon="ios-person"
                      style={styles.input}
                      onChangeText={(departure) => setDeparture(departure)}
                      value={departure}
                    />
                    <View>
                      <MainButton
                        title="Marcar salida"
                        onPress={() => {
                          updateEntry();
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      ) : (
        <MessageView message={messageText} />
      )}
      {saving ? <Splash /> : null}
      {success && saveSuccess()}
    </View>
  );
};

const styles = StyleSheet.create({
  imgBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  searchBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingBottom: 5,
    alignItems: "center",
    backgroundColor: "#ff7e00",
  },
  cover: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    opacity: 0.8,
    justifyContent: "center",
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  nameBox: {
    height: 40,
    //backgroundColor: "orange",
    paddingHorizontal: 10,
    borderRadius: 20,
    top: "10%",
    justifyContent: "center",
  },
  nameText: {
    textAlign: "center",
    fontSize: 32,
    color: "#fff",
  },

  //elemento 1
  dataBox: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    //width:'75%'
    //justifyContent:'space-between'
  },
  labelText: {
    fontSize: 14,
    color: "grey",
  },
  dataText: {
    fontSize: 17,
    //fontWeight:'200',
    paddingLeft: 20,
  },
  //emento 2
});
