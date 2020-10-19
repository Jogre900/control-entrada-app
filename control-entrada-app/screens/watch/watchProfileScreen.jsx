import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  TouchableHighlight,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { API_PORT } from "../../config/index";
import AsyncStorage from "@react-native-community/async-storage";
import moment from "moment";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";
import { MainColor, lightColor } from "../../assets/colors.js";
import Modal from "react-native-modal";
import { Divider } from "../../components/Divider";

export const WatchProfileScreen = (props) => {
  const [editVisibility, setEditVisibility] = useState(false);
  const [passChange, setPassChange] = useState("");
  const [repeatPass, setRepeatPass] = useState("");
  const [passCaption, setPassCaption] = useState("");
  const [profile, setProfile] = useState();
  const [destiny, setDestiny] = useState();
  const [destinyvisibility, setDestinyvisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  //GET PROFILE
  const getProfile = async () => {
    setLoading(true);
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
          setLoading(false);
          setProfile(res.data.data);
          setDestiny(res.data.data.userZone[0].Zone.Destinos);
        }
      } catch (error) {
        console.log("error: ", error.response);
      }
    }
  };
  //UPDATE PASSWORD
  const updatePassword = async () => {
    console.log(passChange, repeatPass);
    setLoading(true);
    if (passChange === "") {
      setPassCaption("Debe Llenar los campos");
      return;
    } else if (passChange != repeatPass) {
      setPassCaption("Las contraseñas no son iguales");
    } else {
      try {
        let res = await axios.put(
          `${API_PORT()}/api/updatePass/${profile.id}`,
          {
            password: repeatPass,
          }
        );
        if (res) {
          console.log(res.data);
          setLoading(false);
          setPassChange("");
          setRepeatPass("");
          alert("Cambio de contraseña exitoso");
        }
      } catch (error) {
        console.log(error.response);
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
  //LOADING
  const LoadingModal = () => {
    return (
      <Modal
        isVisible={loading}
        onBackdropPress={() => setModalVisible(!modalVisible)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color={MainColor} />
        </View>
      </Modal>
    );
  };
  //RENDER CHANGE PASS CONTAINER
  const ChangePass = () => {
    return (
      <View>
        <View>
          <Input
            title="Clave"
            icon="ios-eye-off"
            shape="flat"
            secureTextEntry={true}
            onChangeText={(value) => {
              setPassChange(value), setPassCaption("");
            }}
            value={passChange}
          />
          <Input
            icon="ios-eye-off"
            title="Repetir Clave"
            secureTextEntry={true}
            shape="flat"
            onChangeText={(text) => {
              setRepeatPass(text), setPassCaption("");
            }}
            value={repeatPass}
          />
          <Text style={{ color: "red", fontSize: 16, alignSelf: "center" }}>
            {passCaption}
          </Text>
        </View>

        <MainButton
          onPress={() => updatePassword()}
          style={{ width: "100%" }}
          title="Guardar Cambios"
        />
      </View>
    );
  };

  //RENDER DESTINY LIST
  const DestinyList = () => {
    return (
      <React.Fragment>
        {destiny.map((elem) => (
          <View
            key={elem.id}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons
              name="ios-checkmark"
              size={28}
              color={lightColor}
              style={{ marginHorizontal: 8 }}
            />
            <Text>{elem.name}</Text>
          </View>
        ))}
      </React.Fragment>
    );
  };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <View style={styles.container}>
      <TopNavigation title="Mi Perfil" leftControl={goBackAction()} />
      {profile ? (
        <ScrollView contentContainerStyle={styles.perfilContainer}>
          <View style={styles.section1}>
            <Image
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                resizeMode: "cover",
              }}
              source={{ uri: `${API_PORT()}/public/imgs/${profile.picture}` }}
            />
            <Text style={styles.profileName}>
              {profile.name} {profile.lastName}
            </Text>
            <Text style={styles.dataText}>{profile.email}</Text>
            <Text style={styles.dataText}>Dni: {profile.dni}</Text>
          </View>
          <View style={styles.section2}>
            <View style={styles.dateContainer}>
              <Text style={styles.containerTitle}>Horario</Text>
              <Divider size="small" />
              <View style={styles.dateBox}>
                <View style={styles.dateIconBox}>
                  <Ionicons name="ios-document" size={28} color={lightColor} />
                </View>
                <Text style={styles.dataText}>
                  Contratado el:{" "}
                  {moment(profile.userZone[0].assignationDate).format(
                    "D MMM YYYY"
                  )}
                </Text>
              </View>
              <View style={styles.dateBox}>
                <View style={styles.dateIconBox}>
                  <Ionicons name="ios-calendar" size={28} color={lightColor} />
                </View>
                <Text style={styles.dataText}>
                  Cambio Turno:{" "}
                  {moment(profile.userZone[0].changeTurnDate).format(
                    "D MMM YYYY"
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.zoneContainer}>
              <Text style={styles.containerTitle}>Zona Asignada</Text>
              <Divider size="small" />
              <View style={styles.zoneBox}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.dateIconBox}>
                    <Ionicons
                      name="ios-business"
                      size={28}
                      color={lightColor}
                    />
                  </View>
                  <Text style={styles.dataText}>
                    {profile.userZone[0].Zone.zone}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginVertical: 5,
                    }}
                  >
                    <View style={styles.dateIconBox}>
                      <Ionicons name="ios-pin" size={28} color={lightColor} />
                    </View>
                    <Text>Destinos</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => setDestinyvisibility(!destinyvisibility)}
                  >
                    <Ionicons
                      name={
                        destinyvisibility ? "ios-arrow-up" : "ios-arrow-down"
                      }
                      size={28}
                      color="grey"
                    />
                  </TouchableOpacity>
                </View>
                {destinyvisibility && <DestinyList />}
              </View>
            </View>
            <View style={styles.editContainer}>
              <Text style={styles.containerTitle}>Editar</Text>
              <Divider size="small" />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text>Cambio de Contraseña</Text>
                <TouchableOpacity
                  onPress={() => setEditVisibility(!editVisibility)}
                >
                  <Ionicons name="md-create" size={22} color="grey" />
                </TouchableOpacity>
              </View>
              {editVisibility && (
                <View>
                  <View>
                    <Input
                      title="Clave"
                      icon="ios-eye-off"
                      shape="flat"
                      secureTextEntry={true}
                      onChangeText={(value) => {
                        setPassChange(value), setPassCaption("");
                      }}
                      value={passChange}
                    />
                    <Input
                      icon="ios-eye-off"
                      title="Repetir Clave"
                      secureTextEntry={true}
                      shape="flat"
                      onChangeText={(text) => {
                        setRepeatPass(text), setPassCaption("");
                      }}
                      value={repeatPass}
                    />
                    <Text
                      style={{
                        color: "red",
                        fontSize: 16,
                        alignSelf: "center",
                      }}
                    >
                      {passCaption}
                    </Text>
                  </View>

                  <MainButton
                    onPress={() => updatePassword()}
                    style={{ width: "100%" }}
                    title="Guardar Cambios"
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      ) : (
        <LoadingModal />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  perfilContainer: {
    alignItems: "center",
  },
  section1: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: "10%",
    width: "90%",
    borderRadius: 5,
    marginVertical: 2.5,
  },
  perfilLogo: {
    width: 120,
    height: 120,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "100",
    color: "black",
  },
  containerTitle: {
    fontSize: 16,
    fontWeight: "normal",
    color: MainColor,
  },
  dataText: {
    fontSize: 14,
    fontWeight: "100",
  },
  section2: {
    width: "90%",
  },
  dateContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
  },
  dateBox: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  dateIconBox: {
    flexDirection: "row",
    marginHorizontal: 8,
  },
  zoneContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
  },
  zoneBox: {
    marginVertical: 5,
  },
  editContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
  },
  input: {
    marginBottom: 2,
  },
});
