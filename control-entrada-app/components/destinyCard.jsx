import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const iconProps = {
  name: "ios-timer",
  size: 20,
  color: "green",
  style: { marginRight: 5 },
};

export const DestinyCard = ({ data, selected }) => {
  const { name } = data;
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
        <Ionicons name="ios-pin" size={28} color="grey" />
        <View
          style={{
            marginLeft: 15,
            //backgroundColor: 'red',
            //width: '100%',
            //overflow: 'hidden'
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "normal",
              lineHeight: 28,
            }}
          >
            {name}
          </Text>
          {/* <View
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
              <Text style={{}}>{firsEntryTime}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 10,
              }}
            >
              <Ionicons {...iconProps} />
              <Text style={{}}>{firsDepartureTime}</Text>
            </View>
          </View> */}
        </View>
      </View>
      {/* <Ionicons name="ios-arrow-forward" size={26} color="grey" /> */}
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
    borderBottomWidth: 0.5,
    borderColor: "grey",
    marginVertical: 4,
    //borderRadius: 5,
    backgroundColor: "#09f",
  },
});
