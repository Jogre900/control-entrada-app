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
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { Input } from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

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
const profilePic = require("../../assets/images/profile-picture.png");
const watchPic = require("../../assets/images/male-2.jpg");

// FORM dataBox
// <View style={{ flex: 1 }}>
//           <View style={{ paddingHorizontal: 5 }}>
//             {/* //------CODE FROM TABBAR------// */}
//             {/* ///----------------------------//////// */}
//             <View style={{ marginTop: 20, paddingHorizontal: "12%" }}>
//               <Input title="Nombre" shape="flat" icon='md-camera'/>
//               <Input title="Nombre" shape="flat" icon='md-camera'/>
//               <Input title="Nombre" shape="flat" icon='md-camera'/>
//               <Input title="Nombre" shape="flat" icon='md-camera'/>
//               {/* <Input title="Apellido" shape="round" />
//               <Input title="DNI" shape="round" />
//               <Input title="Destino" shape="round" /> */}
//               <View>
//                 <MainButton title="Registrar Entrada" />
//               </View>
//             </View>
//           </View>
//         </View>

export const Entrada2Screen = (props) => {
  
  const [saveImg, setSaveImg] = React.useState(null);
  const [changeImg, setChangeImg] = React.useState(false);
  
  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync();
    console.log(' result----',result);
    setSaveImg(result.uri);
    result.cancelled ? setChangeImg(false) : setChangeImg(true);
  };

  const goBackAction = () => {
    return (
      <View>
        <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableWithoutFeedback>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback style={{flex:1}} onPress={() => Keyboard.dismiss()}>
    <KeyboardAvoidingView style={styles.containerKeyboard} behavior="padding">
      <TopNavigation title="Entrada" leftControl={goBackAction()} />
      <ImageBackground source={cover} style={styles.imgBackground}>
        <View style={styles.cover}>
          <View style={{ position: "relative", marginBottom: 10 }}>
            {saveImg ? (
              <Image source={{ uri: saveImg }} style={styles.profilePic} />
            ) : (
              <View style={styles.profilePicBox}>
                <Image source={profilePic} style={styles.profilePic} />
                {/* <Ionicons name="ios-person" size={120} color="grey" /> */}
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
        </View>
      </ImageBackground>
      <View style={{ flex: 1,  
        alignItems: "center" }}>
        <View
          style={{
            marginTop: 20,
            width: "75%",
          }}
        >
          <Input title="Nombre" shape="flat" icon="ios-person" />
          <Input title="Apellido" shape="flat" icon="ios-person" />
          <Input title="DNI" shape="flat" icon="ios-card" />
          <Input title="Destino" shape="flat" icon="ios-pin" />
          
          <View>
            <MainButton title="Registrar Entrada" style={{marginTop:10}}/>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  containerKeyboard: {
    flex: 1,
    justifyContent: "center",
  },
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
  profilePicBox: {
    borderRadius: 70,
    backgroundColor: "white",
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
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
  
});
