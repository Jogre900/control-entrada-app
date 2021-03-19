import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

import { TopNavigation } from "../../components/TopNavigation.component";
import axios from "axios";
import moment from "moment";
import { API_PORT } from "../../config/index";
import { Ionicons } from "@expo/vector-icons";
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";
import { storage } from "../../helpers/asyncStorage";
import { LoadingModal } from "../../components/loadingModal";
import { StatusModal } from "../../components/statusModal";
import { FormContainer } from "../../components/formContainer";
import { Spinner } from "../../components/spinner";
import { helpers } from "../../helpers";
import { BackAction } from "../../helpers/ui/ui";
import { routes } from "../../assets/routes";
import { connect } from "react-redux";
import Avatar from "../../components/avatar.component";

let statusModalValues = {
  visible: false,
  message: "",
  status: null,
};

const DepartureScreen = ({ navigation, route, updateVisit }) => {
  const { id } = route.params;
  const [statusModalProps, setStatusModalProps] = useState(statusModalValues);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visit, setVisit] = useState();
  const [departureText, setDepartureText] = useState("");
  const [entryCheck, setEntryCheck] = useState(false);

  //FIND VISIT BY ID
  const findVisitId = async () => {
    setLoading(true);
    try {
      let res = await axios.get(`${API_PORT()}/api/findVisitId/${id}`);
      console.log(res.data);
      if (!res.data.error) {
        setLoading(false);
        setVisit(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  //UPDATE ENTRY
  const updateEntry = async () => {
    let data = {
      departureDate: new Date().toISOString(),
      descriptionDeparture: departureText,
    };
    //setSuccess(false);
    setSaving(true);
    const token = await storage.getItem("userToken");
    const res = await helpers.updateVisit(id, data, token);
    if (!res.data.error) {
      setEntryCheck(true);
      //setUpdateVisit(res.data.data);
      updateVisit(res.data.data);
      setSaving(false);
      setStatusModalProps((values) => ({
        ...values,
        visible: true,
        status: true,
        message: res.data.msg,
      }));
    } else {
      setSaving(false);
      setStatusModalProps((values) => ({
        ...values,
        visible: true,
        status: false,
        message: res.data.msg,
      }));
    }
  };

  useEffect(() => {
    findVisitId();
  }, [id, entryCheck]);

  return (
    <View style={{ flex: 1 }}>
      <TopNavigation
        title={
          visit && !loading && visit.entryDate !== visit.departureDate
            ? "Visita"
            : "Marcar Salida"
        }
        leftControl={BackAction(navigation, routes.EXIT)}
      />
      {loading && <Spinner message="Cargando..." />}
      {visit && !loading && (
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <View style={styles.profileContainer}>
            <View style={styles.pictureContainer}>
              <Avatar.Picture
                size={120}
                uri={`${API_PORT()}/public/imgs/${visit.Visitante.picture}`}
              />
            </View>

            <Text style={styles.nameText}>
              {visit.Visitante.name} {visit.Visitante.lastName}
            </Text>

            <View style={styles.profileDataContainer}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>{visit.Visitante.dni}</Text>
                <Text style={styles.labelText}>dni</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>
                  {visit.UserZone.Zona.zone}
                </Text>
                <Text style={styles.labelText}>Zona</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>{visit.Destino.name}</Text>
                <Text style={styles.labelText}>Destino</Text>
              </View>
            </View>
          </View>

          <FormContainer title="Entrada">
            <Image
              style={{
                width: "100%",
                height: 250,
                borderRadius: 5,
                marginVertical: 5,
                overflow: "hidden",
              }}
              source={{
                uri: `${API_PORT()}/public/imgs/${visit.Fotos[0].picture}`,
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.labelText}>Entrada: </Text>
              <Text>{moment(visit.entryDate).format("D MMM YY, HH:mm a")}</Text>
            </View>
            <Text style={styles.contentText}>
              {visit.descriptionEntry ? visit.descriptionEntry : ""}
            </Text>
            {visit.entryDate !== visit.departureDate && (
              <>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.labelText}>Salida: </Text>
                  <Text>
                    {moment(visit.departureDate).format("D MMM YY, HH:mm a")}
                  </Text>
                </View>
                <>
                  <Text>
                    {visit.descriptionDeparture
                      ? visit.descriptionDeparture
                      : "----"}
                  </Text>
                </>
              </>
            )}
          </FormContainer>
          {visit.entryDate === visit.departureDate && (
            <FormContainer title="Salida">
              <Input
                title="Descripcion Salida (Opcional)"
                icon="md-create"
                shape="flat"
                value={departureText}
                onChangeText={(value) => setDepartureText(value)}
                shape="flat"
              />
            </FormContainer>
          )}
          {visit.entryDate === visit.departureDate ? (
            <View style={{ width: "90%" }}>
              <MainButton
                style={{ marginBottom: 10 }}
                title="Registrar Salida"
                onPress={() => updateEntry()}
              />
            </View>
          ) : null}
        </ScrollView>
      )}
      <LoadingModal visible={saving} message="Guardando..." />
      <StatusModal
        {...statusModalProps}
        onClose={() =>
          setStatusModalProps((values) => ({ ...values, visible: false }))
        }
      />
    </View>
  );
};
const mapDispatchToProps = (dispatch) => ({
  updateVisit(visit) {
    dispatch({
      type: "UPDATE_VISIT",
      payload: visit,
    });
  },
});

export default connect(null, mapDispatchToProps)(DepartureScreen);

const styles = StyleSheet.create({
  profileContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 5,
    padding: 8,
    elevation: 5,
  },
  profileDataContainer: {
    flexDirection: "row",
    //backgroundColor: 'green',
    justifyContent: "space-between",
    marginVertical: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
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
  dateContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
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
  captionText: {
    fontSize: 16,
    fontWeight: "normal",
    color: "red",
  },
});
