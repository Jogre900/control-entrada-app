import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  KeyboardAvoidingView,
} from "react-native";

//components
import { TopNavigation } from '../../components/TopNavigation.component'
import { Input } from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { TouchableHighlight, TouchableWithoutFeedback } from "react-native-gesture-handler";


const formContent = () => {
  return (
    <View style={{ marginTop: 10, paddingHorizontal: "12%" }}>
      <Input title="Nombre" shape="round" />
      <Input title="Apellido" shape="round" />
      <Input title="DNI" shape="round" />
      <Input title="Destino" shape="round" />
      <View>
        <MainButton title="Registrar Entrada" />
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");
const cover = require("../../assets/images/background.jpg");
const profilePic = require("../../assets/images/female-2.jpg");
const watchPic = require("../../assets/images/male-2.jpg");

export const Entrada2Screen = (props) => {
  const [activeTab, setActiveTab] = React.useState("0");
  const [saveImg, setSaveImg] = React.useState(null);
  const [changeImg, setChangeImg] = React.useState(false);
  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync();
    console.log(result);
    setSaveImg(result.uri);
    setChangeImg(true);
  };

  const goBackAction = () => {
      return (
          <View>
              <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
                  <Ionicons name='ios-arrow-back' size={28} color='white'/>
              </TouchableWithoutFeedback>
          </View>
      )
  }

  return (
      <View style={{ flex: 1 }}>
        <KeyboardAvoidingView style={styles.imgBackground} behavior="padding">
        <TopNavigation
        title='Entrada'
        leftControl={goBackAction()}
        />
        <ImageBackground source={cover} style={styles.imgBackground}>
          <View style={styles.cover}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <View style={{ position: "relative", marginBottom: 10 }}>
                {saveImg ? (
                  <Image source={{ uri: saveImg }} style={styles.profilePic} />
                ) : (
                  <View style={{borderRadius: 70, backgroundColor: 'white', width:140, height:140, justifyContent:'center', alignItems:'center'}}>
                      <Ionicons
                    name="ios-person"
                    size={120}
                    color="grey"
                  />
                  </View>
                )}
                <TouchableOpacity
                  onPress={() =>
                    pickImage((res) => {
                      console.log(res);
                    })
                  }
                  style={styles.cameraIcon}
                >
                  {changeImg ? (
                    <Ionicons name="ios-close" size={42} color="#ff7e00" />
                  ) : (
                    <Ionicons name="ios-camera" size={42} color="#ff7e00" />
                  )}
                </TouchableOpacity>
              </View>
              {/* <View style={styles.nameBox}>
                <Text style={styles.nameText}>Jose Del Corral</Text>
              </View> */}
            </View>
          </View>
        </ImageBackground>
        <View style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: 5 }}>
            {/* //------CODE FROM TABBAR------// */}
            {/* ///----------------------------//////// */}
            <View style={{ marginTop: 10, paddingHorizontal: "12%" }}>
              <Input title="Nombre" shape="flat" />
              <Input title="Apellido" shape="round" />
              <Input title="DNI" shape="round" />
              <Input title="Destino" shape="round" />
              <View>
                <MainButton title="Registrar Entrada" />
              </View>
            </View>
          </View>
        </View>
    </KeyboardAvoidingView>
      </View>
  );
};

const styles = StyleSheet.create({
  imgBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  cover: {
    backgroundColor: "black",
    flex: 1,
    alignItems: "center",
    opacity: 0.8,
    justifyContent: "center",
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  nameBox: {
    height: 40,
    //backgroundColor: "orange",
    paddingHorizontal: 10,
    borderRadius: 20,
    top: "10%",
    justifyContent: "center",
  },
  nameText: {
    textAlign: "center",
    fontSize: 32,
    color: "#fff",
  },
  tabBar: {
    flexDirection: "row",
    height: 50,
    position: "relative",
  },
  tab1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //borderBottomWidth: 1,
    borderColor: "grey",
  },
  tab2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //borderBottomWidth: 1,
    borderColor: "grey",
  },
  //elemento 1
  dataBox: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    //justifyContent:'space-between'
  },
  labelText: {
    fontSize: 14,
    color: "grey",
  },
  dataText: {
    fontSize: 17,
    //fontWeight:'200',
    paddingLeft: 20,
  },
  //emento 2
});
