import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
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
import { FormContainer } from "../../components/formContainer";
import Avatar from "../../components/avatar.component";

const PerfilScreen = ({ navigation, profile, company }) => {
  console.log("profile-redux:  ", profile);
  console.log("company-redux:  ", company);

  //const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(false);
  const [editVisibility, setEditVisibility] = useState(false);
  const [passCaption, setPassCaption] = useState("");
  const [passChange, setPassChange] = React.useState("");

  const [repeatPass, setRepeatPass] = React.useState("");

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
    );
  };
  //GET TOKEN
  const getToken = async (value) => {
    try {
      let token = await AsyncStorage.getItem(value);
      if (token) return token;
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

  return (
    <View style={styles.container}>
      <TopNavigation
        title="Perfil"
        leftControl={goBackAction()}
        rightControl={editAction()}
      />

      {profile ? (
        <ScrollView contentContainerStyle={styles.perfilContainer}>
          <View
            style={{
              backgroundColor: "#fff",
              width: "90%",
              borderRadius: 5,
              marginVertical: 5,
              padding: 8,
              elevation: 5,
            }}
          >
            <View
              style={{
                alignSelf: "center",
              }}
            >
              <Avatar
                size={120}
                uri={`${API_PORT()}/public/imgs/${profile.picture}`}
              />
            </View>
            <Text style={styles.profileName}>
              {profile.name} {profile.lastName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                //backgroundColor: 'green',
                justifyContent: "space-between",
                marginVertical: 15,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>{profile.dni}</Text>
                <Text style={styles.labelText}>dni</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>{profile.email}</Text>
                <Text style={styles.labelText}>email</Text>
              </View>
            </View>
          </View>
          <FormContainer title="Negocio">
            {company.map((elem) => (
              <>
                <Text style={styles.contentText}>{elem.companyName}</Text>
                <Text style={styles.contentText}>{elem.businessName}</Text>
                <Text style={styles.contentText}>{elem.logo}</Text>
                <Text style={styles.contentText}>{elem.city}</Text>
                <Text style={styles.contentText}>{elem.address}</Text>
                <Text style={styles.contentText}>{elem.nic}</Text>
                <Text style={styles.contentText}>{elem.phoneNumber}</Text>
                <Text style={styles.contentText}>{elem.phoneNumberOther}</Text>
              </>
            ))}
          </FormContainer>

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
  perfilLogo: {
    width: 120,
    height: 120,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "100",
    color: "black",
  },
  contentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
  },
  labelText: {
    fontSize: 14,
    color: "#8e8e8e",
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
    width: "90%",
  },
  input: {
    marginBottom: 2,
  },
});

const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  company: state.profile.company,
});
export default connect(mapStateToProps, {})(PerfilScreen);
