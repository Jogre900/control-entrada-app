import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  TouchableHighlight,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_PORT } from "../../config/index";
import AsyncStorage from "@react-native-community/async-storage";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";
import { MainColor } from "../../assets/colors.js";

export const WatchPerfilScreen = (props) => {
  const [passChange, setPassChange] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [profile, setProfile] = useState();

  const getProfile = async () => {
    const token = await AsyncStorage.getItem("watchToken");
    console.log("token del local storage:---", token);
    if (token) {
      try {
        let res = await axios.get(`${API_PORT()}/api/profile`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        if (res) {
          console.log("Profile:--", res.data);
          setProfile(res.data.data);
        }
      } catch (error) {
        console.log("error: ", error);
      }
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

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <View>
      <TopNavigation title="Perfil" leftControl={goBackAction()} />
      <View style={styles.perfilContainer}>
        {profile ? (
          <View>
            <Image
              style={styles.perfilLogo}
              source={{ uri: `${API_PORT()}/public/imgs/${profile.picture}` }}
            />
            <Text>
              {profile.name} {profile.lastName}
            </Text>
            <Text>{profile.email}</Text>
            <Text>{profile.dni}</Text>
          </View>
        ) : (
          <ActivityIndicator size="normal" color={MainColor} />
        )}
        <View style={styles.editBox}>
          <Text>Cambio de Contraseña</Text>
          <Input
            style={styles.input}
            title="Clave"
            icon="ios-eye-off"
            //alignText="center"
            shape="flat"
            secureTextEntry={true}
            onChangeText={(text) => {
              setPassChange(text);
            }}
            value={passChange}
          />
          {passChange != "" ? (
            <Input
              style={styles.input}
              icon="ios-eye-off"
              title="Repetir Clave"
              //alignText="center"
              secureTextEntry={true}
              shape="flat"
              onChangeText={(text) => {
                setRepeatPass(text);
              }}
              value={repeatPass}
            />
          ) : null}
          {passChange === repeatPass && repeatPass ? (
            <MainButton style={{ width: "100%" }} title="Guardar Cambios" />
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  perfilContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  perfilLogo: {
    width: 120,
    height: 120,
  },
  editBox: {
    marginTop: 30,
    //justifyContent: "center",
    //alignItems: "center",
    width: "75%",
  },
  input: {
    marginBottom: 10,
  },
});
