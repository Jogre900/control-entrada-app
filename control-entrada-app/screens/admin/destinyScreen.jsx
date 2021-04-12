import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Vibration,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import { TopNavigation } from "../../components/TopNavigation.component";
import { FloatingBotton } from "../../components/floatingBotton";
import { FormContainer } from "../../components/formContainer";
import { DestinyCard } from "../../components/destinyCard";
import { Header } from "../../components/header.component";
import { CreateDestinyModal } from "../../components/CreateDestinyModal";
import { StatusModal } from "../../components/statusModal";
import { PrompModal } from "../../components/prompModal";
import { Spinner } from "../../components/spinner";
import { NotFound } from "../../components/NotFound";
import { routes } from "../../assets/routes";
import { BackAction } from "../../helpers/ui/ui";

let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};

const DestinyScreen = ({
  navigation,
  zonesRedux,
  privilege,
  userZone,
  destinos,
  addDestiny,
  removeDestiny,
}) => {
  const [statusModalProps, setStatusModalProps] = useState(statusModalValues);

  const [visible, setVisible] = useState(false);
  const [zoneId, setZoneId] = useState();
  const [destinys, setDestinys] = useState([]);
  const [promp, setPromp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectItem, setSeletedItem] = useState([]);
  
  //CHEKC CREATE
  const checkCreate = (status, message, data) => {
    setStatusModalProps((values) => ({
      ...values,
      visible: true,
      status,
      message,
    }));
    addDestiny(data);
    setDestinys((prevValue) => [...prevValue, data]);
  };
  //CHECK DELETE
  const checkDeleted = (status, message) => {
    setStatusModalProps((values) => ({
      ...values,
      visible: true,
      status,
      message,
    }));
    if (status) {
      removeDestiny(selectItem);
      setDestinys((prevValue) =>
        prevValue.filter((elem) => !selectItem.includes(elem.id))
      );
    }
    clearList();
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
    setSeletedItem(array);
  };
  // MOSTRAR TODOS LOS DESTINOS SI
  // ERES ADMIN O SOLO LOS DE TU ZONA SI ERES SUPERVISOR
  useEffect(() => {
    let filterDestiny = [];
    if (privilege === "Admin") {
      filterDestiny = destinos.filter((elem) => elem.zoneId === zoneId);
    } else {
      filterDestiny = destinos.filter(
        (elem) => elem.zoneId === userZone[0].ZoneId
      );
    }
    setDestinys(filterDestiny);
  }, [zoneId]);

  useFocusEffect(
    React.useCallback(() => {
      //setZone([]);
      setSeletedItem([]);
    }, [])
  );

  useEffect(() => {
    setZoneId(zonesRedux.length ? zonesRedux[0].id : zonesRedux.id);
  }, [zonesRedux]);

  return (
    <View style={{ flex: 1 }}>
      {selectItem.length > 0 ? (
        <Header
          value={selectItem.length}
          clearAction={clearList}
          deleteAction={() => setPromp(true)}
          selectAction={selectAll}
        />
      ) : (
        <TopNavigation
          title="Destinos"
          leftControl={BackAction(navigation, routes.ADMIN_HOME)}
        />
      )}
      {loading && <Spinner />}
      {zonesRedux.length > 0 || zonesRedux ? (
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <FormContainer
            title={
              privilege === "Admin" ? "Selecione la zona" : zonesRedux.zone
            }
            style={{ marginTop: 10 }}
          >
            {privilege === "Admin" && (
              <Picker
                mode="dropdown"
                selectedValue={zoneId}
                onValueChange={(value) => {
                  setZoneId(value);
                }}
              >
                {zonesRedux.map((item) => {
                  return (
                    <Picker.Item
                      label={item.zone}
                      value={item.id}
                      key={item.id}
                    />
                  );
                })}
              </Picker>
            )}
            {destinys.length ? (
              <>
                {destinys.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={
                      selectItem.length > 0 ? () => onLong(item.id) : null
                    }
                    onLongPress={() => onLong(item.id)}
                    delayLongPress={200}
                  >
                    <DestinyCard
                      data={item}
                      selected={selectItem.includes(item.id) ? true : false}
                    />
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <Text style={styles.labelText}>* La zona no posee destinos</Text>
            )}
          </FormContainer>
        </ScrollView>
      ) : (
        <NotFound
          message="No tienes zonas creadas"
          navigation={navigation}
          route="admin-home"
        />
      )}

      <CreateDestinyModal
        zoneId={privilege === "Admin" ? zoneId : userZone[0].ZoneId}
        status={visible}
        create={checkCreate}
        onClose={() => setVisible(false)}
      />
      <PrompModal
        visible={promp}
        onClose={() => setPromp(false)}
        deleted={checkDeleted}
        data={selectItem}
        url="destiny"
      />
      <StatusModal
        {...statusModalProps}
        onClose={() =>
          setStatusModalProps((values) => ({ ...values, visible: false }))
        }
      />
      {zonesRedux.length > 0 || zonesRedux ? (
        <FloatingBotton icon="ios-add" onPress={() => setVisible(true)} />
      ) : null}
    </View>
  );
};

const mapStateToProps = (state) => ({
  zonesRedux: state.zones.zones,
  destinos: state.destiny.destinys,
  userZone: state.profile.profile.userZone,
  privilege: state.profile.login.privilege,
});

const mapDispatchToProps = (dispatch) => ({
  addDestiny(destiny) {
    dispatch({
      type: "ADD_DESTINY",
      payload: destiny,
    });
  },
  removeDestiny(destiny) {
    dispatch({
      type: "REMOVE_DESTINY",
      payload: destiny,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DestinyScreen);

const styles = StyleSheet.create({
  labelText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8e8e8e",
  },
});
