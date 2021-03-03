import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Vibration,
  Animated,
} from "react-native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

//componentes

import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import { Header } from "../../components/header.component";
import Input from "../../components/input.component.jsx";
import { MainButton } from "../../components/mainButton.component";
import moment from "moment";
import { MainColor } from "../../assets/colors";
import { ZoneCard } from "../../components/zoneCard";
import { FloatingBotton } from "../../components/floatingBotton";
import CreateZoneModal from "../../components/createZoneModal";
import { StatusModal } from "../../components/statusModal";
import { PrompModal } from "../../components/prompModal";

const ZonasScreen = ({
  navigation,
  companyRedux,
  saveZones,
  addZones,
  removeZones,
  zonesRedux,
  setAvailable,
}) => {
  const [selectItem, setSeletedItem] = useState([]);
  const [visible, setVisible] = useState(false);
  const [create, setCreate] = useState(false);
  const [message, setMessage] = useState("");
  //const [changeStyle, setChangeStyle] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [zone, setZone] = useState([]);
  const [zoneName, setZoneName] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [scaleUp, setScaleUp] = useState(new Animated.Value(0));
  // const opacityInterpolate = scaleUp.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [0.1, 1],
  // });

  const showCheckMark = () => {
    Animated.timing(scaleUp, {
      toValue: 1,
      duration: 1000,
    }).start();
  };
  const hideCheckMark = () => {
    Animated.timing(scaleUp, {
      toValue: 0,
      duration: 1000,
    }).start();
  };

  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("admin-home")}>
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

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
    zonesRedux.map(({ id }) => array.push(id));
    console.log(array);
    setSeletedItem(array);
  };
  //CHECK CREATE
  const checkCreate = (status, message) => {
    setCreate(status);
    setMessage(message);
  };
  //CHECK DELETE
  const checkDeleted = (status, message) => {
    setMessage(message), setCreate(true);
    if (status) {
      removeZones(selectItem);
    }
    clearList();
  };
  useFocusEffect(
    React.useCallback(() => {
      //setZone([]);
      setSeletedItem([]);
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      {selectItem.length > 0 ? (
        <Header
          value={selectItem.length}
          clearAction={clearList}
          //deleteAction={() => deleteZones(selectItem)}
          selectAction={selectAll}
        />
      ) : (
        <TopNavigation title="Zonas" leftControl={goBackAction()} />
      )}
      <ScrollView>
        <View>
          {zonesRedux.length > 0 ? (
            zonesRedux.map((item, i) => (
              <View key={i}>
                <TouchableOpacity
                  onPress={
                    selectItem.length > 0
                      ? () => onLong(item.id)
                      : () =>
                          navigation.navigate("zone_detail", {
                            zoneId: item.id,
                          })
                  }
                  onLongPress={() => onLong(item.id)}
                  delayLongPress={200}
                >
                  <ZoneCard
                    data={item}
                    selected={selectItem.includes(item.id) ? true : false}
                  />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text>No hay zonas creadas!</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <CreateZoneModal
        status={visible}
        create={checkCreate}
        onClose={() => setVisible(false)}
      />
      <PrompModal
        status={promp}
        onClose={() => setPromp(false)}
        deleted={checkDeleted}
        data={selectItem}
        uri="deleteZone"
      />
      <StatusModal
        status={create}
        onClose={() => setCreate(false)}
        message={message}
      />
      <FloatingBotton icon="ios-add" onPress={() => setVisible(true)} />
    </View>
  );
};

const stateToProps = (state) => ({
  companyRedux: state.profile.company,
  zonesRedux: state.zones.zones,
});

const mapDispatchToProps = (dispatch) => ({
  // saveZones(zones) {
  //   dispatch({
  //     type: "setZones",
  //     payload: zones,
  //   });
  // },
  addZones(zones) {
    dispatch({
      type: "addZones",
      payload: zones,
    });
  },
  removeZones(zonesId) {
    dispatch({
      type: "REMOVE_ZONES",
      payload: zonesId,
    });
  },
  setAvailable(users) {
    dispatch({
      type: "SET_AVAILABLE",
      payload: users,
    });
  },
});

export default connect(stateToProps, mapDispatchToProps)(ZonasScreen);

const styles = StyleSheet.create({
  listItemBox: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 5,
    justifyContent: "space-between",
    alignItems: "center",
    //backgroundColor: "#fff",
    marginVertical: 10,
  },
  selectedItem: {
    backgroundColor: "rgba(20, 144, 150, 0.4)",
  },
});
