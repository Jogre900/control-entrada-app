import React from "react";
import { View, StyleSheet } from "react-native";
import { API_PORT } from "../config/index";
import Avatar from "./avatar.component";
import { SecundaryColor, ThirdColor, lightColor } from "../assets/colors";
export const ThreeAvatar = ({ data }) => {
  console.log(data);
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <Avatar.Picture
        style={[styles.avatarContainer, styles.avatar_1]}
        size={56}
        uri={`${API_PORT()}/public/imgs/${data[0]}`}
      />
      <Avatar.Picture
        style={[styles.avatarContainer, styles.avatar_2]}
        size={56}
        uri={`${API_PORT()}/public/imgs/${data[1]}`}
      />
      <Avatar.Picture
        style={[styles.avatarContainer, styles.avatar_3]}
        size={56}
        uri={`${API_PORT()}/public/imgs/${data[2]}`}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  avatarContainer: {
    borderWidth: 1.5,
    borderColor: ThirdColor,
  },
  avatar_1: {
    left: 25,
    elevation: 2,
  },
  avatar_2: {
    left: 15,
    elevation: 1,
  },
  avatar_3: {
    elevation: 0,
  },
});
