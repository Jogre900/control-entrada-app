import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Image,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Input } from "../../components/input.component";

export const EntradaScreen = (props) => {
  const goBackAction = () => {
    return (
      <RectButton
        onPress={() => {
          props.navigation.goBack();
        }}
      >
        <Ionicons name="ios-arrow-back" size={32} color="grey" />
      </RectButton>
    );
  };

  const inputProps = {
    placeholderTextColor: "black",
    style: {
      borderBottomWidth: 1,
      borderColor: "grey",
      height: 40,
    },
  };

  return (
    <View style={styles.container}>
      <TopNavigation title="Registrar Entrada" leftControl={goBackAction()} />
      <View style={{ paddingHorizontal: 5 }}>
        <View style={styles.detailCardContainer}>
          <View style={styles.detailCard}>
            <View style={styles.cardContainer1}>
              <View>
                <Input
                  title="DNI"
                  shape="round"
                  textColor="black"
                  alignText="center"
                />
              </View>
              <View>
                <Input
                  title="Nombre"
                  shape="round"
                  textColor="black"
                  alignText="center"
                />
              </View>
              <View>
                <Input
                  title="Apellido"
                  shape="round"
                  textColor="black"
                  alignText="center"
                />
              </View>
              <View>
                <Input
                  title="Destino"
                  shape="round"
                  textColor="black"
                  alignText="center"
                />
              </View>
            </View>
            <View style={styles.cardContainer2}>
              <View style={styles.pictureBox}>
                <Ionicons name="md-camera" size={32} color="grey" />
              </View>
            </View>
          </View>
        </View>
      </View>

      <MainButton
        title="Registrar"
        onPress={() => {
          Alert.alert("Registro exitoso!");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  detailCardContainer: {
    marginBottom: 20,
    backgroundColor: "#eee",
    borderRadius: 5,
    padding: 10,
    borderWidth: 0.5,
    borderColor: "grey",
  },
  detailCard: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardContainer1: {
    maxWidth: "60%",
    width: "55%",
    justifyContent: "space-around",
  },
  cardContainer2: {
    maxWidth: "40%",
    width: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  pictureBox: {
    borderWidth: 1,
    borderColor: "grey",
    borderStyle: "dashed",
    borderRadius: 5,
    width: 120,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});
