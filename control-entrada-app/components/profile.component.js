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
import { Input } from "./input.component";
import { MainButton } from "./mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const element1 = () => {
  return (
    <View style={{ marginTop: 10, paddingHorizontal: 5 }}>
      <View style={styles.dataBox}>
        <Text style={styles.labelText}>DNI:</Text>
        <Text style={styles.dataText}>19222907</Text>
      </View>
      <View style={styles.dataBox}>
        <Text style={styles.labelText}>Destino:</Text>
        <Text style={styles.dataText}>Apt 104</Text>
      </View>
      <View style={styles.dataBox}>
        <Text style={styles.labelText}>Hora de Entrada:</Text>
        <Text style={styles.dataText}>10:00 am</Text>
      </View>
      <View style={styles.dataBox}>
        <Text style={styles.labelText}>Hora de Salida:</Text>
        <Text style={styles.dataText}>10:00 pm</Text>
      </View>
    </View>
  );
};

const formContent = () => {
  return (
    <View style={{ marginTop: 10, paddingHorizontal: '12%'}}>
      
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
const cover = require("../assets/images/background.jpg");
const profilePic = require("../assets/images/female-2.jpg");
const watchPic = require("../assets/images/male-2.jpg");

export const ProfileComponent = () => {
  const [activeTab, setActiveTab] = React.useState("0");

  const [xTabOne, setXTabOne] = React.useState();
  const [xTabTwo, setXTabTwo] = React.useState();
  const [hightContent1, setHightContent1] = React.useState(-5000);
  const [saveImg, setSaveImg] = React.useState();
  const translateTab = new Animated.Value(0);
  const translateContent1 = new Animated.Value(0);
  const translateContent2 = new Animated.Value(width);

  const animatedOverlay = (tabCoor, tabActive) => {
    //setActiveTab(tabActive)
    Animated.spring(translateTab, {
      toValue: tabCoor,
      duration: 500,
      speed: 12,
      bounciness: 5,
    }).start();
    if (tabActive == 0) {
      Animated.parallel([
        Animated.spring(translateContent1, {
          toValue: 0,
          duration: 500,
        }).start(),
        Animated.spring(translateContent2, {
          toValue: width,
          duration: 500,
          speed: 12,

          bounciness: 5,
        }).start(),
      ]);
      //setActiveTab1({color: 'orange'})
      //setActiveTab2({color: 'grey'})
    } else {
      Animated.parallel([
        Animated.spring(translateContent1, {
          toValue: -width,
          duration: 500,
        }).start(),
        Animated.spring(translateContent2, {
          toValue: 0,
          duration: 500,
          speed: 12,

          bounciness: 5,
        }).start(),
      ]);
      //setActiveTab2({color: 'orange'})
      //setActiveTab1({color: 'grey'})
    }
  };

  const element2 = () => {
    return (
      <View
        style={{
          paddingHorizontal: 5,
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <View style={styles.dataBox}>
            <Text style={styles.labelText}>Nombre:</Text>
            <Text style={styles.dataText}>Jose Del Corral</Text>
          </View>
          <View style={styles.dataBox}>
            <Text style={styles.labelText}>DNI</Text>
            <Text style={styles.dataText}>19222907</Text>
          </View>
          <View style={styles.dataBox}>
            <Text style={styles.labelText}>Identificaion:</Text>
            <Text style={styles.dataText}>9987654</Text>
          </View>
        </View>
        <View style={{ justifyContent: "center" }}>
          <Image
            source={watchPic}
            style={{ width: 140, height: 140, borderRadius: 70 }}
          />
          <Image
            source={{ uri: saveImg }}
            style={{ width: 120, height: 120, borderRadius: 70 }}
          />
        </View>
      </View>
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync();
    console.log(result);
    setSaveImg(result.uri);
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{flex:1}} behavior='padding'>
      <ImageBackground source={cover} style={styles.imgBackground}>
        <View style={styles.cover}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {/* <Ionicons name="ios-person" size={120} color="#fff" /> */}
            <View style={{ position: "relative", marginBottom: 10 }}>
              <Image source={profilePic} style={styles.profilePic} />
              {/* <TouchableOpacity
                onPress={() =>
                  pickImage((res) => {
                    console.log(res);
                  })
                }
                style={styles.cameraIcon}
              >
                <Ionicons name="ios-camera" size={38} color="orange" />
              </TouchableOpacity> */}
            </View>
            <View style={styles.nameBox}>
              <Text style={styles.nameText}>Jose Del Corral</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 5 }}>
          {/* //------CODE FROM TABBAR------// */}
          {/* ///----------------------------//////// */}
          <View style={styles.tabBar}>
            <Animated.View
              style={{
                //backgroundColor: "blue",
                height: "100%",
                width: "50%",
                position: "absolute",
                top: 0,
                left: 0,
                borderColor: "orange",
                borderBottomWidth: 2,
                transform: [
                  {
                    translateX: translateTab,
                  },
                ],
              }}
            />
            <TouchableOpacity
              style={styles.tab1}
              onLayout={(event) => {
                setXTabOne(event.nativeEvent.layout.x);
              }}
              onPress={() => {
                animatedOverlay(xTabOne, 0);
              }}
            >
              <Text style={{ color: activeTab === "0" ? "orange" : "grey" }}>
                Datos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tab2}
              onLayout={(event) => {
                setXTabTwo(event.nativeEvent.layout.x);
              }}
              onPress={() => {
                animatedOverlay(xTabTwo, 1);
              }}
            >
              <Text style={{ color: activeTab === "1" ? "orange" : "grey" }}>
                Seguridad
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            
            <Animated.View
              onLayout={(event) => {
                setHightContent1(event.nativeEvent.layout.height);
              }}
              style={{
                transform: [
                  {
                    translateX: translateContent1,
                  },
                ],
              }}
            >
              {element1()}
            </Animated.View>
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: translateContent2,
                  },
                  {
                    translateY: -hightContent1,
                  },
                ],
              }}
            >
              {element2()}
            </Animated.View>
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
    flexDirection: 'row',
    alignItems:'center',
    //justifyContent:'space-between'
  },
  labelText: {
    fontSize: 14,
    color:'grey'
  },
  dataText: {
    fontSize: 17,
    //fontWeight:'200',
    paddingLeft:20
  },
  //emento 2
});
