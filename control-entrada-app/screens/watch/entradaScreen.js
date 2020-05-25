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
      <View style={{paddingHorizontal: 5}}>
      <View style={styles.detailCardContainer}>
        <View style={styles.detailCard}>
          <View style={styles.cardContainer1}>
            <View>
              <TextInput placeholder="Cedula" {...inputProps} />
            </View>
            <View>
              <TextInput
                placeholder="Nombre"
                textContentType="password"
                {...inputProps}
              />
            </View>
            <View>
              <TextInput placeholder="Apellido" {...inputProps} />
            </View>
            <View>
              <TextInput placeholder="Destino" {...inputProps} />
            </View>
          </View>
          <View style={styles.cardContainer2}>
            <View
              style={styles.pictureBox}
            >
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
    backgroundColor: "#cccccc",
    borderRadius: 5,
    padding: 5,
    //height: '40%'
  },
  detailCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    //minWidth: DEVICE_WIDTH,
  },
  cardContainer1: {
    maxWidth: "60%",
    width: "100%",
    //height: '100%',
    justifyContent: "space-around",
    backgroundColor: "#cccc",
  },
  cardContainer2: {
    maxWidth: "40%",
    width: "100%",

    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#cccc",
  },
  pictureBox: {
      borderWidth: 1,
      borderColor: 'grey',
      borderStyle: 'dashed',
      borderRadius: 5,
      width: 120,
      height: 120,
      justifyContent: "center",
      alignItems: "center",
    
  },
  cardTitleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 17,
  },
  cardText: {
    fontSize: 14,
  },
  dataText: {
    fontSize: 20,
  },
});
