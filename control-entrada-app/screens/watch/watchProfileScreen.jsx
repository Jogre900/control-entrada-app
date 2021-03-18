import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,

  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_PORT } from "../../config/index";
import moment from "moment";
import { connect } from "react-redux";
//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainColor, lightColor } from "../../assets/colors.js";
import Modal from "react-native-modal";
import { FormContainer } from "../../components/formContainer";
import Avatar from "../../components/avatar.component";
import { BackAction } from '../../helpers/ui/ui'
import { routes } from '../../assets/routes'

const WatchProfileScreen = ({ navigation, profile }) => {
  const [destinyvisibility, setDestinyvisibility] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const editAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.EDIT_WATCH_PROFILE);
          }}
        >
          <Ionicons name="md-create" size={28} color="white" />
        </TouchableOpacity>
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

  //RENDER DESTINY LIST
  const DestinyList = ({ destiny }) => {
    return (
      <>
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
      </>
    );
  };
  // useEffect(() => {
  //   getProfile();
  // }, []);

  return (
    <View style={styles.container}>
      <TopNavigation title="Mi Perfil" leftControl={BackAction(navigation, routes.WATCH_HOME)} rightControl={editAction()}/>
      {profile ? (
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <View style={styles.profileContainer}>
            <View style={styles.pictureContainer}>
              <Avatar.Picture
                size={120}
                uri={`${API_PORT()}/public/imgs/${profile.picture}`}
              />
            </View>
            <Text style={styles.nameText}>
              {profile.name} {profile.lastName}
            </Text>
            <View style={styles.profileDataContainer}>
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
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>0</Text>
                <Text style={styles.labelText}>Visitas</Text>
              </View>
            </View>
          </View>

          <FormContainer title="Horario">
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
          </FormContainer>
          <FormContainer title="Zona Asignada">
            <View style={styles.zoneBox}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.dateIconBox}>
                  <Ionicons name="ios-business" size={28} color={lightColor} />
                </View>
                <Text style={styles.dataText}>
                  {profile.userZone[0].Zona.zone}
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
                    name={destinyvisibility ? "ios-arrow-up" : "ios-arrow-down"}
                    size={28}
                    color="grey"
                  />
                </TouchableOpacity>
              </View>
              {destinyvisibility && <DestinyList destiny={profile.userZone[0].Zona.Destinos} />}
            </View>
          </FormContainer>
          {/* <View style={styles.editContainer}>
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
            </View> */}
        </ScrollView>
      ) : (
        <LoadingModal />
      )}
    </View>
  );
};

const mapStateToPRops = (state) => ({
  profile: state.profile.profile,
});

export default connect(mapStateToPRops, {})(WatchProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  profileContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 5,
    padding: 8,
    elevation: 5,
  },
  pictureContainer: {
    alignSelf: "center",
    position: "relative",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
    borderRadius: 120 / 2,
    backgroundColor: "#fff",
  },
  profileDataContainer: {
    flexDirection: "row",
    //backgroundColor: 'green',
    justifyContent: "space-between",
    marginVertical: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  nameText: {
    textAlign: "center",
    fontSize: 22,
    color: "#262626",
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
