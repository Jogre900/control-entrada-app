import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Vibration, BackHandler } from "react-native";
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

//componentes

import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import { MainButton } from "../../components/mainButton.component";
import { MainColor } from "../../assets/colors";
import { EmployeeCard } from "../../components/employeeCard";
import { DestinyCard } from "../../components/destinyCard";
import { ZoneDetailCard } from "../../components/zoneDetailCard";
import { FormContainer } from "../../components/formContainer";
import { Header } from "../../components/header.component";
import { Spinner } from "../../components/spinner";
import { helpers } from "../../helpers";
import { routes } from "../../assets/routes";
import { BackAction } from "../../helpers/ui/ui";

const ZoneDetailScreen = ({ route, navigation, privilege, userZone, zoneRedux, availableU, setNewEmployee }) => {
  const zoneId = privilege === "Admin" ? route?.params.zoneId : userZone[0].ZoneId;
  const [selectItem, setSeletedItem] = useState([]);
  const [loading, setLoading] = useState(false);
  //const [availableU, setAvailableU] = useState([]);
  const [listVisible, setListVisible] = useState(false);
  const [zoneApi, setZoneApi] = useState();
  const [destiny, setDestiny] = useState();
  const [zoneEmployee, setZoneEmployee] = useState();

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
    setLoading(true);
    try {
      const res = await helpers.fetchZoneById(privilege === "Admin" ? zoneId : userZone[0].ZoneId);
      if (!res.data.error) {
        setLoading(false);
        setZoneApi(res.data.data);
        setDestiny(res.data.data.Destinos);
        setZoneEmployee(res.data.data.encargado_zona);
      } else {
        setLoading(false);
        alert(res.data.msg);
      }
    } catch (error) {
      setLoading(false);
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

  const onLong = (id) => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      //  hideCheckMark();
      return;
    }
    Vibration.vibrate(100), setSeletedItem(selectItem.concat(id));
    //showCheckMark();
    //setChangeStyle(!changeStyle);
  };
  const clearList = () => setSeletedItem([]);

  const selectAll = () => {
    let array = [];
    zoneApi.Destinos.map(({ id }) => array.push(id));
    setSeletedItem(array);
  };

  const goBackHardware = () => {
    //TODO aqui y abajo debes poner segun rol
    navigation.navigate(routes.ADMIN_HOME);
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", goBackHardware);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", goBackHardware);
      };
    }, [])
  );

  useEffect(() => {
    requestZone();
  }, [zoneId]);

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
        <TopNavigation title={zoneApi ? zoneApi.zone : null} leftControl={BackAction(navigation, routes.ADMIN_HOME)} />
      )}
      {loading && <Spinner message="Cargando..." />}
      {zoneApi && (
        <ScrollView>
          <View style={{ alignItems: "center" }}>
            <ZoneDetailCard data={zoneApi} />
            <FormContainer title="Destinos">
              {zoneApi.Destinos.length > 0 ? (
                zoneApi.Destinos.map((elem) => (
                  <TouchableOpacity key={elem.id} onPress={selectItem.length > 0 ? () => onLong(elem.id) : null} onLongPress={() => onLong(elem.id)} delayLongPress={200}>
                    <DestinyCard data={elem} selected={selectItem.includes(elem.id) ? true : false} />
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.labelText}>La zona no posee destinos creados</Text>
              )}
            </FormContainer>
            <FormContainer title="Encargados">
              {zoneApi.encargado_zona.length > 0 ? (
                zoneApi.encargado_zona.map((elem) => (
                  <View key={elem.id}>
                    <EmployeeCard data={elem} zone={true} />
                  </View>
                ))
              ) : (
                <View>
                  <Text style={styles.labelText}>La zona no posea Personal Asignado</Text>
                  <View>
                    <Text>Agregar Personal</Text>
                    <MainButton.Icon onPress={() => setListVisible(!listVisible)} name={listVisible ? "ios-arrow-up" : "ios-arrow-down"} size={22} color="#4f4f4f" />
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
            </FormContainer>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const mapStateToProps = (state) => ({
  zoneRedux: state.zones.zones,
  availableU: state.employee.available,
  userZone: state.profile.profile.userZone,
  privilege: state.profile.login.privilege,
});

const mapDispatchToProps = (dispatch) => ({
  setNewEmployee(user) {
    dispatch({
      type: "ASIGN_EMPLOYEE",
      payload: user,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ZoneDetailScreen);

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
  labelText: {
    fontSize: 14,
    color: "#8e8e8e",
    fontWeight: "600",
  },
});
