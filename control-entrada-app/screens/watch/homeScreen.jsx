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
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { storage } from "../../helpers/asyncStorage";
import { useFocusEffect } from "@react-navigation/native";

import { routes } from '../../assets/routes'
import { LogOutModal } from "../../components/logOutModal";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";

//constants
import { mainColor } from "../../constants/Colors";

const cover = require("../../assets/images/background.jpg");

const { width, height } = Dimensions.get("window");

export const HomeScreen = ({navigation}) => {
  const [logModal, setLogModal] = useState(false)
  const dispatch = useDispatch();
  const logOut = () => {
    return new Promise((resolve, reject) => {
      resolve(dispatch({ type: "CLEAR_STORAGE" }));
    });
  };
  const deleteToken = async () => {
    logOut()
      .then(() => storage.removeItem("userToken"))
      .then(() => navigation.navigate(routes.MAIN));
  };

  const backAction = () => {
    setLogModal(true)
    return true;
  };

  const goToProfile = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.WATCH_PROFILE);
          }}
        >
          <Ionicons name="ios-person" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const leftControls = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => setLogModal(true)}>
          <Ionicons name="ios-log-out" size={28} color="white" style={{transform:[{rotate: '180deg'}]}}/>
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
        leftControl={leftControls()}
        rightControl={goToProfile()}
      />
      <View style={styles.contentContainer}>
        <ImageBackground source={cover} style={styles.imageBackground}>
          <View style={styles.backcover}>
            <View style={styles.actionContainer}>
              <MainButton
                title="Entrada"
                style={styles.button}
                onPress={() => {
                  navigation.navigate(routes.ENTRY);
                }}
              />
              <MainButton
                title="Salida"
                style={styles.button}
                onPress={() => {
                  navigation.navigate(routes.EXIT);
                }}
              />
            </View>
          </View>
        </ImageBackground>
      </View>
      <LogOutModal
        status={logModal}
        navigation={navigation}
        onClose={() => setLogModal(false)}
      />
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
    marginVertical: 2.5
  },
});
