import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Vibration,
} from "react-native";

import { TopNavigation } from "../../components/TopNavigation.component";

import { Ionicons } from "@expo/vector-icons";

import axios from "axios";
import { API_PORT } from "../../config/index";
import { MainColor, lightColor } from "../../assets/colors.js";

import { VisitCard } from "../../components/visitCard";
import { FloatingBotton } from "../../components/floatingBotton";
import { Spinner } from "../../components/spinner";
import { SearchVisitModal } from "../../components/searchVisitModal";
import { Header } from "../../components/header.component";
import { helpers } from "../../helpers";
import { storage } from "../../helpers/asyncStorage";
import { StatusModal } from "../../components/statusModal";
import { PrompModal } from "../../components/prompModal";
import { NotFound } from "../../components/NotFound";
import { connect } from "react-redux";

let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};

const VisitScreen = ({ navigation, profile }) => {
  const [statusModalProps, setStatusModalProps] = useState(statusModalValues);
  const [loading, setLoading] = useState(false);
  const [selectItem, setSeletedItem] = useState([]);
  const [active, setActive] = useState(false);
  const [findIt, setFindIt] = useState(false);
  const [promp, setPromp] = useState(false);
  const [hasVisit, setHasVisit] = useState(true);

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
    const token = await storage.getItem("userToken");
    const res = await helpers.findVisitUser(profile.userZone[0].id, token);
    if (!res.data.error && res.data.data.length) {
      setLoading(false);
      setVisits(res.data.data);
    } else if (!res.data.data.length) {
      setLoading(false);
      setHasVisit(false);
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

  //CHECK SEARCH
  const checkSearch = (data, status, message) => {
    if (!status) {
      setStatusModalProps((values) => ({
        ...values,
        visible: true,
        status: false,
        message,
      }));
    } else {
      setActive(false)
      setFindIt(true);
      setvisitsDni(data);
    }
  };
  //CHECK DELETE
  const checkDeleted = (status, message) => {
    setStatusModalProps((values) => ({
      ...values,
      visible: true,
      status,
      message,
    }));
    clearList();
  };

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
          deleteAction={() => setPromp(true)}
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

      {visits.length > 0 && !loading && !findIt && (
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
              <VisitCard
                data={elem}
                selected={selectItem.includes(elem.id) ? true : false}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {findIt && visitsDni &&
        visitsDni.map((elem) => (
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
            <VisitCard
              data={elem}
              selected={selectItem.includes(elem.id) ? true : false}
            />
          </TouchableOpacity>
        ))}

      <FloatingBotton icon="ios-search" onPress={() => setActive(true)} />
      <SearchVisitModal
        status={active}
        onClose={() => setActive(false)}
        search={checkSearch}
      />
      <StatusModal
        {...statusModalProps}
        onClose={() =>
          setStatusModalProps((values) => ({ ...values, visible: false }))
        }
      />
      <PrompModal
        visible={promp}
        onClose={() => setPromp(false)}
        deleted={checkDeleted}
        data={selectItem}
        url="visit"
      />
      {!hasVisit && !loading && <NotFound message="No hay visitas." />}
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
