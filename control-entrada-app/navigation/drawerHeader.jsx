import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Avatar from "../components/avatar.component";
import { API_PORT } from "../config/index";
import { connect } from "react-redux";
import Constants from "expo-constants";
import { MainColor } from "../assets/colors";

const DrawerHeader = ({ navigation, adminProfile }) => {
  return (
    <View style={styles.drawerHeadercontainer}>
      <Avatar.Picture size={60} uri={`${API_PORT()}/public/imgs/${adminProfile.picture}`} style={styles.avatar} />
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {adminProfile.name} {adminProfile.lastName}
            </Text>
            <Text style={styles.caption} numberOfLines={1}>
              {adminProfile.email}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  adminProfile: state.profile.profile,
});
export default connect(mapStateToProps, {})(DrawerHeader);

const styles = StyleSheet.create({
  drawerHeadercontainer: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: MainColor,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  avatar: {
    marginRight: 20,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    //lineHeight: 36
  },
  caption: {
    color: "#fff",
  },
});
