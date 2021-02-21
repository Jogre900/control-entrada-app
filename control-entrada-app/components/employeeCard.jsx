import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "./avatar.component";
import { API_PORT } from "../config/index";
import moment from "moment";

export const EmployeeCard = ({ data, key }) => {
  return (
    <View style={styles.listEmployeBox} key={key}>
      <Avatar.Picture
        size={30}
        uri={`${API_PORT()}/public/imgs/${data.User.Employee.picture}`}
      />
      <View style={styles.listSubItemBox}>
        <View style={{ alignItems: "center" }}>
          <View style={styles.privilegeBox}>
            <Text style={{ color: "#fff", fontSize: 16, lineHeight: 16 }}>
              {data.User.UserCompany[0].privilege}
            </Text>
          </View>
          <Text>
            {data.User.Employee.name} {data.User.Employee.lastName}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text>Asignado:</Text>
          <Text>{moment(data.assignationDate).format("D MMM YYYY")}</Text>
        </View>
        {/* <Text>Cambio de Turno: {moment(data.changeTurnDate).format('D MMM YYYY')}</Text> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
