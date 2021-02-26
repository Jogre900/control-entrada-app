import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Vibration,
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
import { MainColor, lightColor } from "../../assets/colors.js";
import Modal from "react-native-modal";
import { VisitCard } from "../../components/visitCard";
import { FloatingBotton } from "../../components/floatingBotton";
import { Spinner } from "../../components/spinner";
import { SearchVisitModal } from "../../components/searchVisitModal";
import { Header } from "../../components/header.component";
import { connect } from "react-redux";
const { width } = Dimensions.get("window");

const VisitScreen = ({ navigation, profile }) => {
  console.log("profile----", profile);
  const [loading, setLoading] = useState(false);
  const [selectItem, setSeletedItem] = useState([]);
  const [active, setActive] = useState(false);
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
    setVisits([]);
    setLoading(true);
    try {
      let res = await axios.get(
        `${API_PORT()}/api/findTodayVisitsByUser/${profile.userZone[0].id}`
      );
      if (!res.data.error) {
        setLoading(false);
        setVisits(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
    }
  };

  //ONLONGPRESS
  const onLong = (id) => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      //hideCheckMark();
      return;
    }
    Vibration.vibrate(100), setSeletedItem(selectItem.concat(id));
    //showCheckMark();
    //setChangeStyle(!changeStyle);
  };

  const clearList = () => setSeletedItem([]);

  const selectAll = () => {
    let array = [];
    visits.map(({ id }) => array.push(id));
    console.log(array);
    setSeletedItem(array);
  };

  // {findIt && (
  //   <View style={{ flex: 1 }}>
  //     {visitsDni.map((elem, i) => (
  //       <TouchableOpacity
  //         onPress={() =>
  //           navigation.navigate("departure", { id: elem.id })
  //         }
  //         style={styles.listItemBox}
  //         key={elem.id}
  //       >
  //         <View>
  //           {elem.Fotos.map((foto) => (
  //             <Image
  //               key={foto.id}
  //               source={{
  //                 uri: `${API_PORT()}/public/imgs/${foto.picture}`,
  //               }}
  //               style={styles.profilePic}
  //             />
  //           ))}
  //         </View>
  //         <View style={styles.subItemBox}>
  //           <Text style={styles.nameText}>
  //             {citizen.name} {citizen.lastName}
  //           </Text>
  //           <Text style={styles.dataText}>{citizen.dni}</Text>
  //         </View>
  //         <View style={styles.subItemBox}>
  //           <Ionicons name="ios-pin" size={22} color="grey" />
  //           <Text style={styles.dataText}>{elem.Destino.name}</Text>
  //         </View>
  //         <View style={styles.subItemBox}>
  //           <Text style={styles.labelText}>Entrada:</Text>
  //           <Text style={styles.dataText}>
  //             {moment(elem.entryDate).format("MMM D, HH:mm a")}
  //           </Text>
  //         </View>
  //         <View style={styles.subItemBox}>
  //           <Text style={styles.labelText}>Salida:</Text>
  //           <Text style={styles.dataText}>
  //             {moment(elem.departureDate).format("MMM D, HH:mm a")}
  //           </Text>
  //         </View>

  //       </TouchableOpacity>
  //     ))}
  //   </View>
  // )}

  useEffect(() => {
    todayVisit();
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      {selectItem.length > 0 ? (
        <Header
          value={selectItem.length}
          clearAction={clearList}
          //deleteAction={() => deleteZones(selectItem)}
          selectAction={selectAll}
        />
      ) : (
        <TopNavigation
          style={{ elevation: 0 }}
          title="Salida"
          leftControl={goBackAction()}
        />
      )}

      {loading && <Spinner message="Cargando..." />}

      {visits && !loading &&
        <ScrollView>
          {visits.map((elem) => (
            <TouchableOpacity
              key={elem.id}
              onPress={
                selectItem.length > 0
                  ? () => onLong(elem.id)
                  : () => navigation.navigate("departure", { id: elem.id })
              }
              onLongPress={() => onLong(elem.id)}
              delayLongPress={200}
            >
              <VisitCard data={elem} selected={selectItem.includes(elem.id) ? true : false}/>
            </TouchableOpacity>
          ))}
        </ScrollView>
      }

      <FloatingBotton icon="ios-search" onPress={() => setActive(true)} />
      <SearchVisitModal status={active} onClose={() => setActive(false)} />
    </View>
  );
};
const mapStateToProps = (state) => ({
  profile: state.profile.profile,
});

export default connect(mapStateToProps, {})(VisitScreen);

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
