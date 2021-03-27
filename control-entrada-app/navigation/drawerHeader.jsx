import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import Avatar from "../components/avatar.component";
import { API_PORT } from "../config/index";
import { connect } from "react-redux";
import Constants from "expo-constants";
import { MainColor } from "../assets/colors";
import { routes } from '../assets/routes'

const DrawerHeader = ({ navigation, profile, login, company }) => {
  
  return (
    <View style={styles.drawerHeadercontainer}>
      <Avatar.Picture
        size={60}
        uri={`${API_PORT()}/public/imgs/${profile.picture}`}
        style={styles.avatar}
      />
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.PROFILE);
          }}
        >
          <View>
            <Text style={styles.title} numberOfLines={1}>
              {profile ? profile.name : null} {profile ? profile.lastName : null}
            </Text>
            <View>
              {login.privilege === "Admin" ? (
                <Text style={styles.caption} numberOfLines={1}>
                  {login? login.privilege : null} {company.length ? company[0].companyName : null}
                </Text>
              ) : (
                <Text style={styles.caption} numberOfLines={1}>
                  {login ? login.privilege : null} - {profile ? profile.userZone[0].Zona.zone : null}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  login: state.profile.login,
  company: state.profile.company,
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
    fontSize: 15,
    color: "#fff",
    fontWeight: "bold",
  },
});
