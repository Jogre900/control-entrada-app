import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView, Vibration } from "react-native";
import { Picker } from "@react-native-community/picker";
import { connect } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";

import { TopNavigation } from "../../components/TopNavigation.component";
import { Ionicons } from "@expo/vector-icons";
import { FloatingBotton } from "../../components/floatingBotton";
import { FormContainer } from "../../components/formContainer";
import { DestinyCard } from "../../components/destinyCard";
import { Header } from "../../components/header.component";
import { CreateDestinyModal } from "../../components/CreateDestinyModal";
import { StatusModal } from "../../components/statusModal";
import { Spinner } from "../../components/spinner";
import { PrompModal } from "../../components/prompModal";

const DestinyScreen = ({
  navigation,
  zonesRedux,
  destinos,
  addDestiny,
  removeDestiny,
}) => {
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);
  const [zoneId, setZoneId] = useState(zonesRedux[0].id);
  const [create, setCreate] = useState(false);
  const [destinys, setDestinys] = useState([]);
  const [promp, setPromp] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectItem, setSeletedItem] = useState([]);
  const [status, setStatus] = useState(false);

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

  //CHEKC CREATE
  const checkCreate = (status, message, data) => {
    setMessage(message);
    setStatus(status);
    setSuccess(true);
    addDestiny(data);
    setDestinys((prevValue) => [...prevValue, data]);
  };
  //CHECK DELETE
  const checkDeleted = (status, message) => {
    setStatus(status);
    setMessage(message);
    setSuccess(true);
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
  useEffect(() => {
    let filterDestiny = [];
    filterDestiny = destinos.filter((elem) => elem.zoneId === zoneId);
    setDestinys(filterDestiny);
  }, [zoneId]);

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
          deleteAction={() => setPromp(true)}
          selectAction={selectAll}
        />
      ) : (
        <TopNavigation title="Destinos" leftControl={goBackAction()} />
      )}
      {zonesRedux.length ? (
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <FormContainer title="Seleccione la Zona" style={{ marginTop: 10 }}>
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
            <View
              style={{
                backgroundColor: "white",
              }}
            >
              {destinys &&
                destinys.map((item) => (
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
              {/* {notFound && (
              <View>
                <Text>No hay Destinos disponibles</Text>
                </View>
              )} */}
            </View>
          </FormContainer>
        </ScrollView>
      ) : 
      <View>
        <Text>No hay zonas creadas!</Text>
      </View>
      }
      {loading && <Spinner />}
      <CreateDestinyModal
        zoneId={zoneId}
        status={visible}
        create={checkCreate}
        onClose={() => setVisible(false)}
      />
      <PrompModal
        visible={promp}
        onClose={() => setPromp(false)}
        deleted={checkDeleted}
        data={selectItem}
        url="deleteDestiny"
      />
      <StatusModal
        visible={success}
        onClose={() => setSuccess(false)}
        message={message}
        status={status}
      />
      <FloatingBotton icon="ios-add" onPress={() => setVisible(true)} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  zonesRedux: state.zones.zones,
  destinos: state.destiny.destinys,
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
