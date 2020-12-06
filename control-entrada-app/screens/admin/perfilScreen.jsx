import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { connect} from 'react-redux'
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";
import axios from "axios";
import { API_PORT } from "../../config/index";
import AsyncStorage from "@react-native-community/async-storage";
import { Divider } from "../../components/Divider";
import { MainColor } from "../../assets/colors";
import Modal from "react-native-modal";


const PerfilScreen = ({ navigation, profile }) => {
  console.log("profile-redux:  ", profile)
  //const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false)
  const [editVisibility, setEditVisibility] = useState(false);
  const [passCaption, setPassCaption] = useState("")
  const [passChange, setPassChange] = React.useState("");

  const [repeatPass, setRepeatPass] = React.useState("");
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
  const goBackAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons name="ios-arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  const editAction = () => {
    return (
      <View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("edit_profile");
        }}
      >
        <Ionicons name="md-create" size={28} color="white" />
      </TouchableOpacity>
    </View>
    )
  }
  //GET TOKEN
  const getToken = async (value) => {
    try {
      let token = await AsyncStorage.getItem(value);
      if (token) return token;
    } catch (error) {
      alert(error.message);
    }
  };
  //REQUEST ADMIN PROFILE
  const requestProfile = async () => {
    let token = await getToken("userToken");
    try {
      let res = await axios.get(`${API_PORT()}/api/profile`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      if (!res.data.error) {
        console.log(res.data);
        setProfile(res.data.data);
      }
    } catch (error) {
      alert(error.message);
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
        if (!res.data.error) {
          console.log(res.data);
          setLoading(false);
          setPassChange("");
          setRepeatPass("");
          alert("Cambio de contraseña exitoso");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  // useEffect(() => {
  //   requestProfile();
  // }, []);
  return (
    <View style={styles.container}>
      <TopNavigation title="Perfil" leftControl={goBackAction()} rightControl={editAction()}/>
      
        {profile ? (
          <ScrollView contentContainerStyle={styles.perfilContainer}>
            <View style={styles.section1}>
              <View 
              style={{
                width: 120,
                  height: 150,
      //            borderRadius: 20/2,
   //               borderColor: '#ccc',
     //             borderWidth: 3,
                  overflow: 'hidden'
              }}
              >
              <Image
                
                style={{flex: 1,
    width: null,
    height: null,
    borderRadius: 150/2,
   resizeMode: 'contain'
     }}
                source={{ uri: `${API_PORT()}/public/imgs/${profile.picture}` }}
              />
              </View>
              <Text style={styles.profileName}>
                {profile.name} {profile.lastName}
              </Text>
              <Text style={styles.dataText}>{profile.email}</Text>
              <Text style={styles.dataText}>Dni: {profile.dni}</Text>
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
          </ScrollView>
        ) : null}
      
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
    
  editContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
    width: '90%'
  },
  input: {
    marginBottom: 2,
  },
});

const mapStateToProps = state => ({
  profile : state.profileReducer.profile
})
export default connect(mapStateToProps, {})(PerfilScreen)