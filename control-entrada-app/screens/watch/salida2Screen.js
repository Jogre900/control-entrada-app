import React from "react";
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, ScrollView, ImageBackground, Image, KeyboardAvoidingView, Keyboard } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { TopNavigation } from "../../components/TopNavigation.component";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import FireMethods from "../../lib/methods.firebase";
import * as ImagePicker from "expo-image-picker";
import moment from 'moment'
const { width } = Dimensions.get("window");
const cover = require("../../assets/images/background.jpg");
const profilePic = require("../../assets/images/female-2.jpg");
const watchPic = require("../../assets/images/male-2.jpg");

export const Salida2Screen = (props) => {
  const [activeTab, setActiveTab] = React.useState("0");
  const [buscar, setBuscar] = React.useState("");
  const [encontrado, setEncontrado] = React.useState(false);
  const [person, setPerson] = React.useState({});
  const [horaSalida, setHoraSalida] = React.useState();

  const getHour = () => {
    let hour = moment().format("MMM Do YY, h:mm a")
    setHoraSalida(hour);
    return hour
  };

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

  const buscarProfile = async (id) => {
    setEncontrado(false);
    let resp  
    await FireMethods.getDuplicateDni(id, data => {
      resp = data
    });
    console.log("resp",resp)
    if(!resp){
      alert("encontrado")
    }else{
      alert("usuario ya marco salida")
    }
    setPerson(await resp);
    setEncontrado(true);
    Keyboard.dismiss();
  };

  const update = () => {
    console.log("person:  ",person)
    FireMethods.updateEntrance(person.timeStamp, getHour());
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Salida" leftControl={goBackAction()} />
      <View style={styles.searchBox}>
        <View style={{ width: "70%" }}>
          <Input title="Buscar por DNI" shape="round" alignText="center" style={{ backgroundColor: "white" }} onChangeText={(valor) => setBuscar(valor)} value={buscar} />
        </View>
        <RectButton title="Buscar" onPress={() => buscarProfile(buscar)}>
          <Ionicons name="ios-search" size={28} color="white" />
        </RectButton>
      </View>
      {encontrado ? (
        <View style={{ flex: 1 }}>
          <ImageBackground source={cover} style={styles.imgBackground}>
            <View style={styles.cover}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {/* <Ionicons name="ios-person" size={120} color="#fff" /> */}
                <View style={{ position: "relative", marginBottom: 10 }}>
                  <Image source={{uri: person.foto}} style={styles.profilePic} />
                </View>
                <View style={styles.nameBox}>
      <Text style={styles.nameText}>{person.nombre} {person.apellido}</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
          <View style={{ flex: 1, alignItems: "center" }}>
            <View style={{ width: "75%" }}>
              <View style={styles.dataBox}>
                <Text style={styles.labelText}>DNI:</Text>
      <Text style={styles.dataText}>{person.cedula}</Text>
              </View>
              <View style={styles.dataBox}>
                <Text style={styles.labelText}>Destino:</Text>
      <Text style={styles.dataText}>{person.destino}</Text>
              </View>
              <View style={styles.dataBox}>
                <Text style={styles.labelText}>Hora de Entrada:</Text>
                <Text style={styles.dataText}>{person.hora_entrada}</Text>
              </View>
              <View style={styles.dataBox}>
                <Text style={styles.labelText}>Hora de Salida:</Text>
                <Text style={styles.dataText}>{horaSalida}</Text>
              </View>
              <View>
                <MainButton
                  title="Marcar salida"
                  onPress={() => {
                    update();
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      ) : null}
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
