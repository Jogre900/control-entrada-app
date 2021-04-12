import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Avatar from "./avatar.component";
import moment from "moment";
import { API_PORT } from "../config";
export const NotificationCard = ({ item, onPress, navigation }) => {
  console.log(item)
    return (
    <TouchableOpacity
      style={[
        styles.notificationBox,
        {
          backgroundColor: item.read === true ? "#fff" : "#ccc",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 8,
        },
      ]}
      onPress={() => onPress(item)}
      // onPress={
      //     selectItem.length > 0
      //       ? () => onLong(item.id)
      //       : () =>
      //           alert("falta accion")
      //   }
      onLongPress={() => onLong(item.id)}
      delayLongPress={200}
    >
      <View
        style={{
          //backgroundColor: 'red',
          flex: 1,
        }}
      >
        <Avatar.Picture
          size={60}
          uri={`${API_PORT()}/public/imgs/${item.nuevaKey.picture}`}
        />
      </View>
      <View
        style={{
          //backgroundColor: 'yellow',
          flex: 3,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text>
            <Text
              style={{
                fontWeight: "700",
                color: "#262626",
                fontSize: 14,
              }}
            >
              {item.nuevaKey.name} {item.nuevaKey.lastName}{" "}
            </Text>
            <Text
              style={{
                fontWeight: "normal",
                color: "#262626",
                flex: 1,
                flexShrink: 1,
              }}
            >
              {item.notification}
            </Text>
          </Text>
        </View>
        <Text>{moment(item.createdAt).fromNow()}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    notificationBox: {
      borderBottomWidth: 0.5,
      borderColor: "grey",
      paddingVertical: 5,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },
    notificationSub: {
      fontSize: 16,
    },
  });
