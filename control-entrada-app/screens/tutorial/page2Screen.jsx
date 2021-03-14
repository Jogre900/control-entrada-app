import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MainButton } from "../../components/mainButton.component";
import { useDispatch } from "react-redux";
export const Page2Screen = ({ navigation }) => {
  const dispatch = useDispatch({ type: "TURN_OFF", payload: false });
  return (
    <View style={Styles.container}>
      <View style={styles.textContainer}>
        <Text>Zonas y Destinos</Text>
        <Text>
          Lo primero que debes hacer es crear un zona nueva en el apartado de
          Zona de la barra latera, de esta manera ya podras asignar personal a
          esta. No olvides que puedes agregarle destinos para asi tener mas
          detalles sobre que lugarles son los mas concurridos por las personas.
        </Text>
        <Text>
          Para crear una Zona solo debes ingresar un nombre y una hora de
          entrada y salida, en lapso de 24 horas. Para los destinos solo
          necesitas un nombre e igual que las zonas, encontraras Destinos en la
          barra lateral.
        </Text>
        <View style={styles.buttonContainer}>
          <MainButton title="Atras" onPress={() => navigation.navigate("PAGE_1")} outline />
          <MainButton
            title="Siguiente"
            onPress={() => navigation.navigate("PAGE_3")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.5)",
    padding: 20,
  },
  textContainer: {
    backgroundColor: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
