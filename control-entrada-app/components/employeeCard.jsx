import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "./avatar.component";
import { API_PORT } from "../config/index";
import { MainColor, ThirdColor, lightColor } from "../assets/colors";
import moment from "moment";

export const EmployeeCard = ({ data, key, zone }) => {
  return (
    <View style={styles.listEmployeBox} key={key}>
      <Avatar.Picture
        size={45}
        uri={`${API_PORT()}/public/imgs/${
          data.User?.Employee.picture || data.Employee.picture
        }`}
      />
      <View style={styles.listSubItemBox}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.contentText}>
            {data.User?.Employee.name || data.Employee.name}{" "}
            {data.User?.Employee.lastName || data.Employee.lastName}
          </Text>
          <View>
            <Text style={styles.labelText}>
              {data.User?.UserCompany[0].privilege ||
                data.UserCompany[0].privilege}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          {zone ? (
            <Text style={styles.contentText}>
              {moment(data.assignationDate).format("D MMM YYYY")}
            </Text>
          ) : (
            <Text style={styles.contentText}>
              {data.userZone[0]?.Zona.zone}
            </Text>
          )}
          <Text style={styles.labelText}>Asignado</Text>
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
    marginVertical: 4,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  listSubItemBox: {
    borderBottomWidth: 0.5,
    borderColor: "grey",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 5,
    //backgroundColor: 'pink',
    width: "80%",
    //height: 30,
  },
  privilegeBox: {
    backgroundColor: ThirdColor,
    borderRadius: 5,
    padding: 8,
    //height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  contentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
  },
  labelText: {
    fontSize: 14,
    color: "#8e8e8e",
  },
});
