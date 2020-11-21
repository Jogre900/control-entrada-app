import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  ImageBackground,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { API_PORT } from '../../config/index'
import moment from 'moment'
import { TopNavigation } from "../../components/TopNavigation.component";
import { DetailCard } from "../../components/detailCard.component";
import { ProfileComponent } from "../../components/profile.component";

const { width } = Dimensions.get("window");
const cover = require("../../assets/images/background.jpg");
const watchPic = require("../../assets/images/male-2.jpg");

export const DetailViewScreen = (props) => {
  const visit = props.route?.params;
  //console.log(visit)
  const citizen = visit.Citizen

  const watchman = visit.UserZone.User
  console.log("visitas:-------",visit.Citizen)
  console.log("DEstino:----",visit.Destination)
  console.log("Zona: -------",visit.UserZone.Zone)
  console.log("WATCHMAN:--------", visit.UserZone.User)

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
      useNativeDriver: false
    }).start();
    if (tabActive == 0) {
      Animated.parallel([
        Animated.spring(translateContent1, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false
        }).start(),
        Animated.spring(translateContent2, {
          toValue: width,
          duration: 500,
          speed: 12,
          bounciness: 5,
          useNativeDriver: false
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

  const goBackAction = () => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            props.navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableHighlight>
      </View>
    );
  };

  const element1 = (citizen, visit) => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View style={{ width: "95%" }}>
          <View style={styles.dataBox}>
            <Text style={styles.labelText}>DNI:</Text>
      <Text style={styles.dataText}>{citizen.dni}</Text>
          </View>
          <View style={styles.dataBox}>
            <Text style={styles.labelText}>Destino:</Text>
            <Text style={styles.dataText}>{visit.Destination.name}</Text>
          </View>
          <View style={styles.dataBox}>
            <Text style={styles.labelText}>Hora de Entrada:</Text>
            <Text style={styles.dataText}>{moment(visit.departureDate).format('HH:mm a')}</Text>
          </View>
          <View style={styles.dataBox}>
            <Text style={styles.labelText}>Hora de Salida:</Text>
            <Text style={styles.dataText}>{moment(visit.entryDate).format('HH:mm a')}</Text>
          </View>
        </View>
      </View>
    );
  };

  const element2 = (watchman) => {
    return (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent:'space-between',
          }}
        >
          <View>
            <View style={styles.dataBox2}>
              <Text style={styles.labelText}>Nombre:</Text>
        <Text style={styles.dataText}>{watchman.name}</Text>
            </View>
            <View style={styles.dataBox2}>
              <Text style={styles.labelText}>DNI</Text>
        <Text style={styles.dataText}>{watchman.dni}</Text>
            </View>
            <View style={styles.dataBox2}>
              <Text style={styles.labelText}>Identificaion:</Text>
              <Text style={styles.dataText}>9987654</Text>
            </View>
          </View>
          <View>
            <Image
              source={{uri: `${API_PORT()}/public/imgs/${watchman.picture}`}}
              style={{ width: 140, height: 140, borderRadius: 70 }}
            />
            <Image
              source={{ uri: saveImg }}
              style={{ width: 120, height: 120, borderRadius: 70 }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation title="Vista Detallada" leftControl={goBackAction()} />
      <View style={{ flex: 1, backgroundColor: "pink" }}>
        <ImageBackground source={cover} style={styles.imgBackground}>
          <View style={styles.cover}>
            <View
              style={{
                //justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ marginBottom: 10 }}>
                <Image source={{ uri: `${API_PORT()}/public/imgs/${citizen.picture}` }} style={styles.profilePic} />
              </View>
              <Text style={styles.nameText}>
                {citizen.name} {citizen.lastName}
              </Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* -------------TAB BAR----------- */}
      <View style={{ flex: 1, paddingHorizontal: 5 }}>
        
        <View style={styles.tabBar}>
          <Animated.View
            style={{
              //backgroundColor: "blue",
              height: "100%",
              width: "50%",
              position: "absolute",
              top: 0,
              left: 0,
              borderColor: "#ff7e00",
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
            <Text style={{ color: activeTab === 0 ? "#ff7e00" : "grey" }}>
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
            <Text style={{ color: activeTab === 1 ? "#ff7e00" : "grey" }}>
              Seguridad
            </Text>
          </TouchableOpacity>
        </View>
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
          {element1(citizen, visit)}
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
          {element2(watchman)}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imgBackground: {
    flex: 1,
    resizeMode: "cover",
  },
  cover: {
    backgroundColor: "black",
    flex: 1,
    opacity: 0.8,
    justifyContent: "center",
  },
  profilePic: {
    width: 140,
    height: 140,
    borderRadius: 70,
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
    justifyContent: "space-between",
  },
  labelText: {
    fontSize: 14,
    color: "grey",
  },
  dataText: {
    fontSize: 17,
    //fontWeight:'200',
    paddingRight: "5%",
  },
  //elemento2
  dataBox2: {
    marginVertical: 10,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});



