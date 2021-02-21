import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Vibration,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import axios from "axios";
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component";
import { Ionicons } from "@expo/vector-icons";
import { FloatingBotton } from "../../components/floatingBotton";
import { FormContainer } from "../../components/formContainer";
import { DestinyCard } from "../../components/destinyCard";
import { Header } from "../../components/header.component";
import { CreateDestinyModal } from "../../components/CreateDestinyModal";
import { StatusModal } from "../../components/statusModal";
import { Spinner } from "../../components/spinner";

const DestinyScreen = ({ navigation, zonesRedux, company, saveDestiny }) => {

  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [zoneId, setZoneId] = useState(zonesRedux[0].id);
  const [create, setCreate] = useState(false);
  const [destinys, setDestinys] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const [loading, setLoading] = useState(false);
  const [selectItem, setSeletedItem] = useState([]);

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

  const requestZone = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      let res = await axios.get(`${API_PORT()}/api/findZones/${companyId}`);
      if (!res.data.error) {
        setZones(res.data.data);
        setZoneId(res.data.data[0].id);
        setLoading(false);
      }
    } catch (error) {
      console.log("error: ", error.message);
    }
  };
  const requestDestiny = async () => {
    setLoading(true);
    setDestinys([]);
    setNotFound(false);
    setSeletedItem([]);
    try {
      let res = await axios.get(`${API_PORT()}/api/findDestiny/${zoneId}`);
      if (res.data.data.length >= 1) {
        setDestinys(res.data.data);
        setNotFound(false);
        setLoading(false);
      } else {
        setLoading(false);
        setNotFound(true);
        setDestinys([]);
      }
    } catch (error) {
      setLoading(false);
      console.log("error: ", error);
    }
  };
  //CHEKC CREATE
  const checkCreate = (status) => {
    setCreate(status), setSuccess(true);
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
    destinys.map(({ id }) => array.push(id));
    console.log(array);
    setSeletedItem(array);
  };
  // useEffect(() => {
  //   requestZone();
  // }, []);
  useEffect(() => {
    requestDestiny();
  }, [zoneId, create]);

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
        <TopNavigation title="Destinos" leftControl={goBackAction()} />
      )}
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <FormContainer title="Seleccione la Zona" style={{ marginTop: 10 }}>
          {zonesRedux && (
            <Picker
              mode="dropdown"
              selectedValue={zoneId}
              onValueChange={(value) => {
                setZoneId(value);
              }}
            >
              {zonesRedux.map((item, index) => {
                return (
                  <Picker.Item label={item.zone} value={item.id} key={index} />
                );
              })}
            </Picker>
          )}
          <View
            style={{
              backgroundColor: "white",
            }}
          >
            {loading && <Spinner />}
            {destinys &&
              destinys.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={selectItem.length > 0 ? () => onLong(item.id) : null}
                  onLongPress={() => onLong(item.id)}
                  delayLongPress={200}
                >
                  <DestinyCard
                    data={item}
                    selected={selectItem.includes(item.id) ? true : false}
                  />
                </TouchableOpacity>
              ))}
            {notFound && (
              <View>
                <Text>No hay Destinos disponibles</Text>
              </View>
            )}
          </View>
        </FormContainer>
      </ScrollView>
      <CreateDestinyModal
        zoneId={zoneId}
        status={visible}
        create={checkCreate}
        onClose={() => setVisible(false)}
      />
      <StatusModal status={success} onClose={() => setSuccess(false)} />
      <FloatingBotton onPress={() => setVisible(true)} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  zonesRedux: state.zones.zones,
  company: state.profile.companySelect,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DestinyScreen);
