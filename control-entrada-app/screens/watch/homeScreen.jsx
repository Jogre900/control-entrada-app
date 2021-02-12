import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Alert
} from "react-native";
import axios from "axios";
import { API_PORT } from "../../config/index";
import { Ionicons } from "@expo/vector-icons";
import { connect, useDispatch } from "react-redux";
import { storage } from "../../helpers/asyncStorage";
import { useFocusEffect } from "@react-navigation/native";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";

//constants
import { mainColor } from "../../constants/Colors";

const cover = require("../../assets/images/background.jpg");

const { width, height } = Dimensions.get("window");

export const HomeScreen = (props) => {
  const dispatch = useDispatch();
  const logOut = () => {
    return new Promise((resolve, reject) => {
      resolve(dispatch({ type: "CLEAR_STORAGE" }));
    });
  };
  const deleteToken = async () => {
    logOut()
      .then(() => storage.removeItem("userToken"))
      .then(() => props.navigation.navigate("Main"));
  };

  const backAction = () => {
    Alert.alert("", "Cerrar Sesion?", [
      {
        text: "No",
        onPress: () => null,
        style: "cancel",
      },
      { text: "Si", onPress: () => deleteToken() },
    ]);
    return true;
  };

  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("watch-profile");
          }}
        >
          <Ionicons name="ios-person" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const rightControls = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => deleteToken()}>
          <Ionicons name="ios-log-out" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", backAction);
      };
    }, [])
  );
  return (
    <View style={styles.container}>
      <TopNavigation
        title="Control de visitas"
        leftControl={goBackAction()}
        rightControl={rightControls()}
      />
      <View style={styles.contentContainer}>
        <ImageBackground source={cover} style={styles.imageBackground}>
          <View style={styles.backcover}>
            <View style={styles.actionContainer}>
              <MainButton
                title="Entrada"
                style={styles.button}
                onPress={() => {
                  props.navigation.navigate("entrada");
                }}
              />
              <MainButton
                title="Salida"
                style={styles.button}
                onPress={() => {
                  props.navigation.navigate("salida");
                }}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  backcover: {
    backgroundColor: "black",
    flex: 1,
    width: width,
    height: height,
    opacity: 0.8,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  actionContainer: {
    width: "75%",
    marginBottom: "10%",
  },
  button: {
    borderColor: "#ff7e00",
  },
});
