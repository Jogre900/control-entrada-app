import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import axios from 'axios'
import { API_PORT } from '../../config/index'
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-community/async-storage'

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";

//constants
import { mainColor } from "../../constants/Colors";

const cover = require("../../assets/images/background.jpg");

const { width, height } = Dimensions.get("window");

export const HomeScreen = (props) => {
  const [profile, setProfile] = useState()
  const getProfile = async () => {
    const token = await AsyncStorage.getItem("watchToken")
    console.log(token)
    if(token){
      try {
        let res = await axios.get(`${API_PORT()}/api/profile`, {
          headers: {
            'Authorization': `bearer ${token}` 
          }
        })
        if(res){
          console.log("Profile:--", res.data)
          setProfile(res.data.data)
        }
      } catch (error) {
        console.log("error: ", error) 
      }
    }
    
  }
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

  useEffect(() => {
    getProfile()
  }, [])
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
                  props.navigation.navigate("entrada", profile);
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
