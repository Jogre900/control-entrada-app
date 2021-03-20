import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Vibration, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { routes } from "../../assets/routes";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { VisitCard } from "../../components/visitCard";
import { Header } from "../../components/header.component";
import { StatusModal } from "../../components/statusModal";
import { PrompModal } from "../../components/prompModal";
import { NotFound } from "../../components/NotFound";
import { connect } from "react-redux";

const HistorialScreen = ({ navigation, visits, removeVisit }) => {
  const [selectItem, setSeletedItem] = useState([]);
  const [message, setMessage] = useState("");
  const [create, setCreate] = useState(false);
  const [promp, setPromp] = useState(false);
  const [status, setStatus] = useState(false);
  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.ADMIN_HOME);
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  //ONLONGPRESS
  const onLong = (id) => {
    if (selectItem.includes(id)) {
      setSeletedItem((value) => value.filter((elem) => elem !== id));
      return;
    }
    Vibration.vibrate(100), setSeletedItem([...selectItem, id]);
  };

  const clearList = () => setSeletedItem([]);

  const selectAll = () => {
    let array = [];
    visits.map(({ id }) => array.push(id));
    setSeletedItem(array);
  };

  //CHECK DELETE
  const checkDeleted = (status, message) => {
    setStatus(status);
    setMessage(message), setCreate(true);
    if (status) {
      removeVisit(selectItem);
    }
    clearList();
  };

  return (
    <View style={{ flex: 1 }}>
      {selectItem.length > 0 ? (
        <Header value={selectItem.length} clearAction={clearList} deleteAction={() => setPromp(true)} selectAction={selectAll} />
      ) : (
        <TopNavigation title="Historial" leftControl={goBackAction()} />
      )}
      {visits.length > 0 && (
        <ScrollView>
          {visits.map((elem) => (
            <TouchableOpacity
              key={elem.id}
              onPress={selectItem.length > 0 ? () => onLong(elem.id) : () => navigation.navigate("detail-view", { id: elem.id })}
              onLongPress={() => onLong(elem.id)}
              delayLongPress={200}
            >
              <VisitCard data={elem} selected={selectItem.includes(elem.id) ? true : false} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {!visits.length && <NotFound message="No hay visitas." />}
      <PrompModal visible={promp} onClose={() => setPromp(false)} deleted={checkDeleted} data={selectItem} url="visit" />
      <StatusModal visible={create} onClose={() => setCreate(false)} message={message} status={status} />
    </View>
  );
};

const mapStateToProps = (state) => ({
  visits: state.visits.today,
});
const mapDispatchToPros = (dispatch) => ({
  removeVisit(visits) {
    dispatch({
      type: "REMOVE_VISIT",
      payload: visits,
    });
  },
});

export default connect(mapStateToProps, mapDispatchToPros)(HistorialScreen);

const styles = StyleSheet.create({
  historialContainer: {},
  inputBox: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    width: 100,
  },
  buttonBox: {
    justifyContent: "center",
    alignItems: "center",
  },
});
