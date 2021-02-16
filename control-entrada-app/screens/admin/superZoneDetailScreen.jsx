import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

//componentes
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Divider } from "../../components/Divider";
import { MainColor, lightColor } from "../../assets/colors";
import CheckBox from "@react-native-community/checkbox";
import Avatar from "../../components/avatar.component";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";

const SuperZoneDetailScreen = ({
  route,
  navigation,
  privilege,
  userZone,
  zoneRedux,
  availableU,
  setNewEmployee,
}) => {
  console.log("ZONE REDUX-----------",zoneRedux)
  //const  {zoneId}  = route?.params;
  
  //const [zoneId, setZoneId] = useState(route.params.zoneId)
  //const [params, setParams] = useState()
  const [destiny, setDestiny] = useState();
  const [zoneEmployee, setZoneEmployee] = useState();
  //const [availableU, setAvailableU] = useState([]);
  const [user, setUser] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [changeTurn, setChangeTurn] = useState(new Date());
  const [listVisible, setListVisible] = useState(false);
  const [check, setCheck] = useState(false);
  //const [zoneRedux[0], setZoneApi] = useState();
  // const zoneId = id;
  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  //FORM MODAL
  // const FormModal = () => {
  //   return (
  //     <Modal
  //       isVisible={modalVisible}
  //       onBackdropPress={() => setModalVisible(!modalVisible)}
  //       backdropColor="transparent"
  //     >
  //       <View
  //         style={{
  //           flex: 1,
  //           backgroundColor: "#fff",
  //           justifyContent: "center",
  //         }}
  //       >
  //         {/* <Text>User Id: {user.id}</Text> */}
  //         <Text>Entrada: {moment(changeTurn).format("Do MMM")}</Text>
  //         <MainButton
  //           title="Fecha de Entrada"
  //           onPress={() => showDatepicker()}
  //         />
  //         {show && (
  //       <View>
  //         <DateTimePicker
  //           testID="dateTimePicker1"
  //           value={changeTurn}
  //           mode="date"
  //           is24Hour={true}
  //           display="default"
  //           onChange={onChange}
  //         />
  //       </View>
  //     )}
  //         <MainButton title="Cambio Turno" onPress={() => showDatepicker()} />
  //         <MainButton title="Asignar" outline onPress={() => asignPersonal()} />
  //       </View>
  //     </Modal>
  //   );
  // };

  //REQUEST ZONE
  const requestZone = async () => {
    setZoneApi();
    try {
      const res = await axios.get(`${API_PORT()}/api/findZone/${privilege === 'Admin' ? zoneId : userZone[0].ZoneId}`);
      console.log("zone by Id from api---", res.data.data);
      if (!res.data.error) {
        setZoneApi(res.data.data);
        setDestiny(res.data.data.Destinos);
        setZoneEmployee(res.data.data.encargado_zona);
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  // const renderAvailable = ({ item }) => (
  //   <TouchableOpacity
  //     onPress={() => {
  //       navigation.push("asign_employee", { item, id, zone });
  //     }}
  //   >
  //     <View style={styles.listEmployeBox}>
  //       <Avatar.Picture
  //         size={50}
  //         uri={`${API_PORT()}/public/imgs/${item.picture}`}
  //       />
  //       <View style={styles.listSubItemBox}>
  //         <View style={{ alignItems: "center" }}>
  //           <View style={styles.privilegeBox}>
  //             <Text
  //               style={{
  //                 color: "#fff",
  //                 fontSize: 16,
  //                 lineHeight: 16,
  //               }}
  //             >
  //               {item.privilege}
  //             </Text>
  //           </View>
  //           <Text>
  //             {item.name} {item.lastName}
  //           </Text>
  //         </View>
  //         {/* <Text>Cambio de Turno: {moment(item.changeTurnDate).format('D MMM YYYY')}</Text> */}
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );
  const renderDestiny = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 5,
      }}
    >
      <View style={{ flexDirection: "row", backgroundColor: "skyblue" }}>
        <Ionicons name="ios-checkmark" size={22} color={lightColor} />
        <Text>{item.name}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteDestiny(item.id)}>
        <Ionicons name="ios-trash" size={28} color="#ccc" />
      </TouchableOpacity>
    </View>
  );
  const renderWatchman = ({ item }) => (
    <View style={styles.listEmployeBox}>
      <Image
        style={styles.avatar}
        source={{ uri: `${API_PORT()}/public/imgs/${item.User.Employee.picture}` }}
      />
      <View style={styles.listSubItemBox}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.privilegeBox}>
            <Text style={{ color: "#fff", fontSize: 16, lineHeight: 16 }}>
              {item.User.UserCompany[0].privilege}
            </Text>
          </View>
          <Text>
            {item.User.Employee.name} {item.User.Employee.lastName}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text>Asignado:</Text>
          <Text>{moment(item.assignationDate).format("D MMM YYYY")}</Text>
        </View>
        {/* <Text>Cambio de Turno: {moment(item.changeTurnDate).format('D MMM YYYY')}</Text> */}
      </View>
    </View>
  );

  // const deleteWarning = (id) => {
  //   Alert.alert("Seguro que desea borrar este destino?", [
  //     {
  //       text: "Cancel",
  //       style: "cancel"
  //     },
  //     {
  //       text: "OK",
  //       onPress:() => {
  //         deleteDestiny(id)
  //       }
  //     }
  // ])
  // }

  // const onChange = (event, selectedDate) => {
  //   const currentDate = selectedDate || changeTurn;
  //   setShow(Platform.OS === "ios");
  //   setChangeTurn(currentDate);
  // };
  // const showDatepicker = () => {
  //   showMode("date");
  // };
  // const showMode = (currentMode) => {
  //   setShow(true);
  //   //setMode(currentMode);
  // };
  // const asignPersonal = () => {
  //   console.log(user)
  //   try {
  //     let res = axios.post(`${API_PORT()}/api//createUserZone`, {
  //       userId: user.id,
  //       zoneId: zone.id,
  //       chargeTurn,
  //     });
  //     if (!res.data.error) {
  //       setNewEmployee(user);
  //       setUser("");
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setZoneId(route.params.zoneId)
  //   }, [])
  // );
//   useEffect(() => {
//     requestZone()
//   }, [zoneId])
 

  return (
      
    
 
    <View style={{ flex: 1 }}>
      <TopNavigation title={zoneRedux ? zoneRedux.zone : null} leftControl={goBackAction()} />
      <ScrollView style={{ flex: 1 }}>
     
        {zoneRedux ? (
          <View>
            <View>
              <Text>{zoneRedux.zone}</Text>
              <Text>{zoneRedux.firsEntryTime}</Text>
              <Text>{zoneRedux.firsDepartureTime}</Text>
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.containerTitle}>Destinos</Text>
              <Divider size="small" />
              {zoneRedux.Destinos.length > 0 ? (
                <FlatList data={zoneRedux.Destinos} renderItem={renderDestiny} />
              ) : (
                <Text>La zona no posee destinos creados</Text>
              )}
            </View>
            <View style={styles.dataContainer}>
              <Text style={styles.containerTitle}>Encargados</Text>
              <Divider size="small" />
              {zoneRedux.encargado_zona.length > 0 ? (
            <FlatList data={zoneRedux.encargado_zona} renderItem={renderWatchman} />
          ) : (
            <View>
              <Text>La zona no posea Personal Asignado</Text>
              <View>
                <Text>Agregar Personal</Text>
                <MainButton.Icon
                  onPress={() => setListVisible(!listVisible)}
                  name={listVisible ? "ios-arrow-up" : "ios-arrow-down"}
                  size={22}
                  color="#4f4f4f"
                />
              </View>

              {/* { listVisible && (
                <View>
                  {availableU.length > 0 ? (
                    <FlatList
                      renderItem={renderAvailable}
                      data={availableU}
                      keyExtractor={(item) => item.id}
                    />
                  ) : (
                    <Text>
                      No Tiene Empleados disponibles, cree uno nuevo para
                      asignarlo
                    </Text>
                  )}
                </View>
              )} */}
            </View>
          )} 
            </View>
          </View>
        ) : (
          <ActivityIndicator size="large" color="#f09" />
        )}
      </ScrollView> 
      </View>
    
  );
};

const mapStateToProps = (state) => ({
  zoneRedux: state.zones.zones,
  availableU: state.employee.available,
  privilege: state.profile.login.privilege
});

const mapDispatchToProps = (dispatch) => ({
  setNewEmployee(user) {
    dispatch({
      type: "ASIGN_EMPLOYEE",
      payload: user,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SuperZoneDetailScreen);

const styles = StyleSheet.create({
  dataContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
    width: "90%",
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: "normal",
    color: MainColor,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
  },
  listEmployeBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 5,
  },
  listSubItemBox: {
    borderBottomWidth: 0.5,
    borderColor: "grey",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    //backgroundColor: 'pink',
    width: "80%",
    height: 70,
  },
  privilegeBox: {
    backgroundColor: MainColor,
    borderRadius: 25,
    padding: 5,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
});
