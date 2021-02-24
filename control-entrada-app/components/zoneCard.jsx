import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { ThirdColor } from '../assets/colors'

const iconProps = {
  name: "ios-timer",
  size: 20,
  color: "green",
  style: { marginRight: 5 },
};

export const ZoneCard = ({ data, selected }) => {
  const { zone, firsEntryTime, firsDepartureTime } = data;
  return (
    <View
      style={[
        styles.visitContainer,
        { backgroundColor: selected ? "#ddd" : "#fff" },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons name="md-globe" size={22} color={ThirdColor} />
        <View
          style={{
            marginLeft: 15,
          }}
        >
          <Text style={styles.contentText}>{zone}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              //backgroundColor: "beige",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                //marginHorizontal: 10
              }}
            >
              <Ionicons {...iconProps} />
              <Text style={styles.labelText}>{firsEntryTime}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 10,
              }}
            >
              <Ionicons {...iconProps} color="red" />
              <Text style={styles.labelText}>{firsDepartureTime}</Text>
            </View>
          </View>
        </View>
      </View>
      <Ionicons name="ios-arrow-forward" size={22} color="grey" />
    </View>
  );
};

const styles = StyleSheet.create({
  visitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    //borderBottomWidth: 0.5,
    borderColor: "grey",
    marginVertical: 4,
    //borderRadius: 5,
    backgroundColor: "#fff",
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
