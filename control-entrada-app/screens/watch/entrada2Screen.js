import React, { useEffect } from "react";
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
  Alert,
} from "react-native";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import firebase from "../../lib/firebase";
import FireMethods from "../../lib/methods.firebase";
import moment from "moment";

const getDate = () => {
  let date = moment().format("MMM Do YY, h:mm a");
  return date;
};

const { width } = Dimensions.get("window");
const cover = require("../../assets/images/background.jpg");
const profilePic = require("../../assets/images/profile-picture.png");
const watchPic = require("../../assets/images/male-2.jpg");

export const Entrada2Screen = (props) => {
  const [saveImg, setSaveImg] = React.useState(null);
  const [changeImg, setChangeImg] = React.useState(false);
  const [userId, setUserId] = React.useState();
  const [name, setName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [dni, setDni] = React.useState("");
  const [destiny, setDestiny] = React.useState("");
  const [imgUrl, setImgUrl] = React.useState();

  const getUserId = () => {
    try {
      let userid = firebase.auth().currentUser;
      setUserId(userid);
      //console.log("user-Id:---",userid)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserId();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync();
    console.log(" result----", result);
    setSaveImg(await result.uri);
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

  const upLoadImage = async (uri) => {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.onerror = reject;
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          resolve(xhr.response);
        }
      };
      xhr.open("GET", uri);
      xhr.responseType = "blob";
      xhr.send();
    }).then(async (response) => {
      let data = response;
      await firebase.storage().ref("imag").child(`${dni}`).put(data);
      setImgUrl(
        await firebase.storage().ref("imag").child(`${dni}`).getDownloadURL()
      );
    });
  };

  const saveEntrance = async () => {
    await upLoadImage(saveImg);
    console.log("uri:   ",imgUrl)
    await FireMethods.saveEntrance(
      name,
      lastName,
      dni,
      destiny,
      getDate(),
      "",
      imgUrl
    );

    // upLoadImage(saveImg)
    // .then(response => {
    //   firebase.storage().ref("imag").child(dni).put(response)
    //   firebase.storage().ref("imag").child(dni).getDownloadURL()
    //   .then(url => {
    //     setImgUrl(url)
    //     console.log("url",imgUrl)
    //     FireMethods.saveEntrance(name, lastName, dni, destiny, getDate(), "", imgUrl)
    //   })
    // })
  };

  return (
    <TouchableWithoutFeedback
      style={{ flex: 1 }}
      onPress={() => Keyboard.dismiss()}
    >
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
        <View style={{ flex: 1, alignItems: "center" }}>
          <View
            style={{
              marginTop: 20,
              width: "75%",
            }}
          >
            <Input
              title="Nombre"
              secureTextEntry={false}
              shape="flat"
              icon="ios-person"
              style={styles.input}
              onChangeText={(name) => setName(name)}
              value={name}
            />
            <Input
              title="Apellido"
              secureTextEntry={false}
              shape="flat"
              icon="ios-person"
              style={styles.input}
              onChangeText={(lastname) => setLastName(lastname)}
              value={lastName}
            />
            <Input
              title="DNI"
              secureTextEntry={false}
              shape="flat"
              icon="ios-card"
              style={styles.input}
              onChangeText={(dni) => setDni(dni)}
              value={dni}
            />
            <Input
              title="Destino"
              secureTextEntry={false}
              shape="flat"
              icon="ios-pin"
              style={styles.input}
              onChangeText={(destiny) => setDestiny(destiny)}
              value={destiny}
            />

            <View>
              <MainButton
                title="Registrar Entrada"
                style={{ marginTop: 10 }}
                onPress={() => saveEntrance()}
              />
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
  input: {
    marginBottom: 10,
  },
});
