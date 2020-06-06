import React from "react";
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
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { TopNavigation } from "../../components/TopNavigation.component";
import { Input } from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const { width } = Dimensions.get("window");
const cover = require("../../assets/images/background.jpg");
const profilePic = require("../../assets/images/female-2.jpg");
const watchPic = require("../../assets/images/male-2.jpg");

export const Salida2Screen = (props) => {
  const [activeTab, setActiveTab] = React.useState("0");
  const [buscar, setBuscar] = React.useState("");
  const [encontrado, setEncontrado] = React.useState(false);
  const [horaSalida, setHoraSalida] = React.useState();

  const getHour = () => {
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    let Hour = "";
    if (hour <= 12) {
      Hour = `${hour}:${minute} am`;
    } else {
      Hour = `${hour}:${minute} pm`;
    }
    setHoraSalida(Hour);
  };

  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="orange" />
        </TouchableOpacity>
      </View>
    );
  };

  const element1 = () => {
    return (
      <View style={{ marginTop: 10, paddingHorizontal: 5 }}>
        <View style={styles.dataBox}>
          <Text style={styles.labelText}>DNI:</Text>
          <Text style={styles.dataText}>19222907</Text>
        </View>
        <View style={styles.dataBox}>
          <Text style={styles.labelText}>Destino:</Text>
          <Text style={styles.dataText}>Apt 104</Text>
        </View>
        <View style={styles.dataBox}>
          <Text style={styles.labelText}>Hora de Entrada:</Text>
          <Text style={styles.dataText}>10:00 am</Text>
        </View>
        <View style={styles.dataBox}>
          <Text style={styles.labelText}>Hora de Salida:</Text>
          <Text style={styles.dataText}>{horaSalida}</Text>
        </View>
        <View>
          <MainButton
            title="Marcar salida"
            onPress={() => {
              getHour();
            }}
          />
        </View>
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
            onChangeText={(valor) => setBuscar(valor)}
            value={buscar}
          />
        </View>
        <RectButton
          title="Buscar"
          onPress={() => {
            buscar === "19222907" ? setEncontrado(true) : setEncontrado(false);
          }}
        >
          <Ionicons name="ios-search" size={28} color="grey" />
        </RectButton>
      </View>
      {encontrado ? (
        <View style={{flex:1}}>
          <ImageBackground source={cover} style={styles.imgBackground}>
            <View style={styles.cover}>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                {/* <Ionicons name="ios-person" size={120} color="#fff" /> */}
                <View style={{ position: "relative", marginBottom: 10 }}>
                  <Image source={profilePic} style={styles.profilePic} />
                </View>
                <View style={styles.nameBox}>
                  <Text style={styles.nameText}>Jose Del Corral</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
          <View style={{ flex: 1 }}>
            <View style={{ paddingHorizontal: 5 }}>{element1()}</View>
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
    alignItems: "center",
    backgroundColor: '#ff7e00'
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
  tabBar: {
    flexDirection: "row",
    height: 50,
    position: "relative",
  },
  tab1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //borderBottomWidth: 1,
    borderColor: "grey",
  },
  tab2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //borderBottomWidth: 1,
    borderColor: "grey",
  },
  //elemento 1
  dataBox: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
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
