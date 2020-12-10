import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MainButton } from "../../components/mainButton.component";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { connect } from "react-redux";
import axios from "axios";
import { API_PORT } from "../../config/index.js";
import { Picker } from "@react-native-community/picker";
import { MainColor, lightColor } from "../../assets/colors.js";
import { Divider } from "../../components/Divider";

const AsignEmployee = ({ setNewEmployee, route }) => {
  const { item, id, zone } = route.params;
  const [user, setUser] = useState();
  const [privilege, setPrivilege] = useState("Supervisor")
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [changeTurn, setChangeTurn] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShow(Platform.OS === "ios");
    setStartDate(currentDate);
  };
  const showDatepicker = () => {
    showMode("date");
  };
  const showMode = (currentMode) => {
    setShow(true);
    //setMode(currentMode);
  };

  const onChange2 = (event, selectedDate) => {
    const currentDate = selectedDate || changeTurn;
    setShow2(Platform.OS === "ios");
    setChangeTurn(currentDate);
  };
  const showDatepicker2 = () => {
    showMode2("date");
  };
  const showMode2 = (currentMode) => {
    setShow2(true);
    //setMode(currentMode);
  };
  const asignPersonal = async () => {
    //console.log(user);
    try {
      let res = await axios.post(`${API_PORT()}/api//createUserZone`, {
        userId: item.id,
        privilege,
        zoneId: id,
        assignationDate: startDate.toString(),
        changeTurnDate: changeTurn.toString(),
      });
      console.log(res.data)
      if (!res.data.error) {
        setNewEmployee(item);
        setUser("");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <View>
      <Text>{item.name}</Text>
      <Text>{zone}</Text>
      <Text>zona id: {id}</Text>

      <View>
        <Text style={styles.containerTitle}>Tipo Usuario</Text>
        <Divider size="small" />
        <Picker
          mode="dropdown"
          selectedValue={privilege}
          onValueChange={(value) => setPrivilege(value)}
        >
          <Picker.Item label={"Supervisor"} value={"Supervisor"} />
          <Picker.Item label={"Vigilante"} value={"Watchman"} />
        </Picker>
      </View>

      <Text>Inicio Turno: {moment(startDate).format("Do MMM")}</Text>
      <Text>Fin Turno: {moment(changeTurn).format("Do MMM")}</Text>
      {show && (
        <View>
          <DateTimePicker
            testID="dateTimePicker1"
            value={startDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        </View>
      )}
      {show2 && (
        <View>
          <DateTimePicker
            testID="dateTimePicker2"
            value={changeTurn}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onChange2}
          />
        </View>
      )}
      <View>
        <MainButton title="Inicio Turno" onPress={() => showDatepicker()} />
        <MainButton title="Fin Turno" onPress={() => showDatepicker2()} />
        <MainButton title="Asignar" outline onPress={() => asignPersonal()} />
      </View>
    </View>
  );
};
const mapDispatchToProps = (dispatch) => ({
  setNewEmployee(user) {
    dispatch({
      type: "ASIGN_EMPLOYEE",
      payload: user,
    });
  },
});
export default connect(null, mapDispatchToProps)(AsignEmployee);

const styles = StyleSheet.create({
    containerTitle: {
        fontSize: 16,
        fontWeight: "normal",
        color: MainColor,
      },
})