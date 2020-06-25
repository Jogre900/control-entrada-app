import React from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import firebase from '../../lib/firebase'
import { Ionicons } from "@expo/vector-icons";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";

//constants
import { mainColor } from "../../constants/Colors";

const cover = require("../../assets/images/background.jpg");

const { width, height } = Dimensions.get("window");

export const HomeScreen = (props) => {
  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        props.navigation.popToTop();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const rightControls = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="ios-log-out" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

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
