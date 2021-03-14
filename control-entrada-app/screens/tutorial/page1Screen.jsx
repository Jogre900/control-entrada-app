import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MainButton } from "../../components/mainButton.component";
import { useDispatch } from "react-redux";
export const Page1Screen = ({ navigation, route }) => {
  const dispatch = useDispatch({ type: "TURN_OFF", payload: false });
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text>
          Gracias por elegirnos!, con Security podras controlar de manera
          sencilla el transito de personas en tu negocio.
        </Text>
        <Text>
          Security te brinda la opcion de registrar tus zonas con destinos que
          necesitas resguardar y asignar personal de seguridad o supervicion si
          asi lo necesitas de una manera muy facil. Como administrador puedes
          crear personal con un rol especifico y asignarlos a una zona que ya
          tengas registrada previamente.
        </Text>
        <View style={styles.buttonContainer}>
          {route.params?.TUTO ? (
            <MainButton
              style={styles.button}
              title="Salir"
              onPress={() => navigation.navigate("admin-home")}
              outline
            />
          ) : (
            <MainButton
              style={styles.button}
              title="Omitir"
              onPress={() => {
                dispatch, navigation.navigate("admin-home");
              }}
              outline
            />
          )}
          <MainButton
            style={[styles.button, {marginLeft: 20}]}
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
    justifyContent: "center",
  },
  textContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
  },
  buttonContainer: {
    width: "100%",
    flexDirection: "row",
    //backgroundColor: "red",
    justifyContent: "flex-end",
    marginTop: 50,
  },
  button: {
    width: "30%",
  },
});
