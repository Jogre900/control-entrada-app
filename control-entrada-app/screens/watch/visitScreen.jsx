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
  FlatList,
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
import { MainColor, lightColor } from "../../assets/colors.js";
import Modal from "react-native-modal";
import {connect} from 'react-redux'
const { width } = Dimensions.get("window");

const VisitScreen = ({navigation, profile}) => {
  console.log("profile----", profile)
  const [findIt, setFindIt] = useState(false);
  const [citizen, setCitizen] = useState();
  const [showList, setShowList] = useState(false);
  const [dni, setDni] = useState("");
  const [visitId, setVisitId] = useState("");
  const [visits, setVisits] = useState([]);
  const [visitsDni, setvisitsDni] = useState();
  const [updateVisit, setUpdateVisit] = useState();
  const [destiny, setDestiny] = useState({});
  const [watchman, setWatchman] = useState();
  const [entryCheck, setEntryCheck] = useState(false);
  const [saved, setSaved] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [departure, setDeparture] = useState();

  const searchRef = useRef();

  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  //REQUEST TODAY VISITS
  const todayVisit = async () => {
    setModalVisible(true);
    try {
      let res = await axios.get(
        `${API_PORT()}/api/findTodayVisitsByUser/${profile.userZone[0].id}`
      );
      console.log(res.data)
      if (!res.data.error) {
        console.log("today Visits:", res.data.data);
        setVisits(res.data.data);
        setModalVisible(false);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  //REQUEST VISIT
  const requestVisit = async () => {
    if (!dni) {
      Alert.alert("Debe ingresar un DNI valido.");
    } else {
      try {
        let res = await axios.get(`${API_PORT()}/api/findVisit/${dni}`);
        console.log("busqueda por dni:----- ", res.data);
        if (!res.data.error) {
          setCitizen(res.data.data);
          setvisitsDni(res.data.data.Visitas);
          setFindIt(true);
          setShowList(false);
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

          setVisitId(res.data.data.Visitas[0].id);
          //console.log("Visitas//----", res.data.data.Visitas[0]);
        }else{
          alert(res.data.msg)
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  //LOADING MODAL
  const LoadingModal = () => {
    return (
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(!modalVisible)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={MainColor} />
        </View>
      </Modal>
    );
  };
  //RENDER TODAY VISIT
  const renderVisits = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("departure", { id: item.id })}
      style={styles.listItemBox}
    >
      <Image
        style={{ height: 50, width: 50, borderRadius: 25, resizeMode: "cover" }}
        source={{ uri: `${API_PORT()}/public/imgs/${item.Fotos[0].picture}` }}
      />
      <View style={styles.subItemBox}>
        <Text style={styles.subItemTitle}>Nombre:</Text>
        <Text style={styles.dataText}>
          {item.Visitante.name} {item.Visitante.lastName}
        </Text>
      </View>
      <View style={styles.subItemBox}>
        <Text style={styles.subItemTitle}>Destino: </Text>
        <Text style={styles.dataText}>{item.Destino.name}</Text>
      </View>
      <View style={styles.subItemBox}>
        <Text style={styles.subItemTitle}>Entrada:</Text>
        <Text style={styles.dataText}>{moment(item.entryDate).format("MMM D, HH:mm a")}</Text>
      </View>
      <View style={styles.subItemBox}>
        <Text style={styles.subItemTitle}>Salida:</Text>
        <Text style={styles.dataText}>{moment(item.departureDate).format("MMM D, HH:mm a")}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    todayVisit();
  }, []);

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
        <TouchableOpacity
          onPress={() => {
            setShowList(true), setFindIt(false);
          }}
        >
          <Ionicons name="ios-list" size={28} color="white" />
        </TouchableOpacity>
      </View>
      {
        showList || !findIt
          ? visits && (
              <View>
                <FlatList data={visits} renderItem={renderVisits} />
              </View>
            )
          : null
        // <LoadingModal />
      }
      {findIt ? (
        <View style={{ flex: 1 }}>
          {visitsDni.map((elem, i) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("departure", { id: elem.id })
              }
              style={styles.listItemBox}
              key={elem.id}
            >
              <View>
                {elem.Fotos.map((foto) => (
                  <Image
                    key={foto.id}
                    source={{
                      uri: `${API_PORT()}/public/imgs/${foto.picture}`,
                    }}
                    style={styles.profilePic}
                  />
                ))}
              </View>
              <View style={styles.subItemBox}>
                <Text style={styles.nameText}>
                  {citizen.name} {citizen.lastName}
                </Text>
                <Text style={styles.dataText}>{citizen.dni}</Text>
              </View>
              <View style={styles.subItemBox}>
                <Ionicons name="ios-pin" size={22} color="grey" />
                <Text style={styles.dataText}>{elem.Destino.name}</Text>
              </View>
              <View style={styles.subItemBox}>
                <Text style={styles.labelText}>Entrada:</Text>
                <Text style={styles.dataText}>
                  {
                    moment(elem.entryDate).format("MMM D, HH:mm a")}
                </Text>
              </View>
              <View style={styles.subItemBox}>
                <Text style={styles.labelText}>Salida:</Text>
                <Text style={styles.dataText}>
                  {
                   moment(elem.departureDate).format("MMM D, HH:mm a")}
                </Text>
              </View>
              {/* <View style={styles.subItemBox}>
                <Ionicons
                  name="md-timer"
                  size={22}
                  color={
                    moment(elem.entryDate).format("HH:mm:ss") !==
                      moment(elem.departureDate).format("HH:mm:ss") &&
                    moment(elem.UserZone.Zone.firsDepartureTime).format(
                      "HH:mm:ss"
                    ) > moment(elem.departureDate).format("HH:mm:ss")
                      ? "grey"
                      : moment(elem.entryDate).format("HH:mm:ss") !==
                      moment(elem.departureDate).format("HH:mm:ss") &&
                    moment(elem.UserZone.Zone.firsDepartureTime).format(
                      "HH:mm:ss"
                    ) < moment(elem.departureDate).format("HH:mm:ss")
                      ? "green"
                      : moment().format("HH:mm:ss") <
                          moment(elem.UserZone.Zone.firsDepartureTime).format(
                            "HH:mm:ss")
                           &&
                        moment(elem.UserZone.Zone.firsDepartureTime).format(
                          "HH:mm:ss"
                        ) < moment(elem.departureDate).format("HH:mm:ss")
                      ? "red"
                      : null
                  }
                />
              </View> */}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <LoadingModal />
      )}
    </View>
  );
};
const mapStateToProps = state => ({
  profile: state.profile.profile
})

export default connect(mapStateToProps, {})(VisitScreen)

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
    backgroundColor: MainColor,
  },
  cover: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  nameBox: {
    justifyContent: "center",
  },
  nameText: {
    textAlign: "center",
    fontSize: 14,
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
  },
  dataText: {
    fontSize: 12,
  },
  //TODAY LIST STYLE
  listItemBox: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 5,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  subItemBox: {
    alignItems: "center",
  },
  subItemTitle: {
    fontWeight: "bold",
  },
});
