import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Image,
  TouchableHighlight
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
      <View style={styles.contentContainer}>
        <View style={styles.detailCardContainer}>
          <View style={styles.detailCard}>
            <View style={styles.cardContainer1}>
              <Input
                title="DNI"
                shape="round"
                textColor="black"
                alignText="center"
              />

              <Input
                title="Nombre"
                shape="round"
                textColor="black"
                alignText="center"
              />

              <Input
                title="Apellido"
                shape="round"
                textColor="black"
                alignText="center"
              />

              <Input
                title="Destino"
                shape="round"
                textColor="black"
                alignText="center"
              />
            </View>
            <View style={styles.cardContainer2}>
              <View style={styles.pictureBox}>
                <Ionicons name="md-camera" size={32} color="grey" />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.buttonBox}>
          <MainButton
            title="Registrar"
            onPress={() => {
              Alert.alert("Registro exitoso!");
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  detailCardContainer: {
    width: "100%",
    padding: 10,
    borderWidth: 0.5,
    borderColor: "grey",
    borderRadius: 5,
  },
  detailCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardContainer1: {
    width: "55%",
    justifyContent: "space-around",
  },
  cardContainer2: {
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
  buttonBox: {
    width: "76%",
    marginTop: 20,
  },
});
