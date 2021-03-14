import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MainButton } from "../../components/mainButton.component";
import { useDispatch } from "react-redux";
export const Page1Screen = ({ navigation }) => {
  const dispatch = useDispatch({ type: "TURN_OFF", payload: false });
  return (
    <View style={Styles.container}>
      <View style={styles.textContainer}>
        <Text>
          Gracias por elegirnos!, con Security podras controlar de manera
          sencilla el transito de personas en tu negocio.
        </Text>
        <Text>
          Security te brinda la opcion de registrar tus zonas con destinos que
          necesitas resguardar y asignar personal de seguridad o supervicion si
          asi lo necesitas de una manera muy facil. Como administrador puedes crear personal con un rol especifico y asignarlos a una zona que ya tengas registrada previamente.
        </Text>
        <View style={styles.buttonContainer}>
          <MainButton title="Omitir" onPress={dispatch} outline />
          <MainButton
            title="Siguiente"
            onPress={() => navigation.navigate("PAGE_2")}
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
