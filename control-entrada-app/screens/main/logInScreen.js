import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  StatusBar,
  BackHandler,
  Alert,
  TouchableOpacity,
} from "react-native";

const backAction = () => {
  Alert.alert("", "Cerrar App?", [
    {
      text: "No",
      onPress: () => null,
      style: "cancel",
    },
    { text: "Cerrar", onPress: () => BackHandler.exitApp() },
  ]);
  return true;
};

export const LogInScreen = (props) => {
  const backHandler = useRef(null);
  //   useEffect(() => {
  //   backHandler.current = BackHandler.addEventListener("hardwareBackPress", backAction);
  //   return () => {
  //     backHandler.current.remove()
  //       //BackHandler.removeEventListener("hardwareBackPress", backAction);
  //   };
  // }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.buttonBox}>
        <TextInput
          style={styles.input}
          textAlign="center"
          placeholder="usuario"
        />
        <TextInput
          style={styles.input}
          textAlign="center"
          placeholder="clave"
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate("Home");
          }}
        >
          <Text>Iniciar Sesion</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            props.navigation.navigate("super");
          }}
        >
          <Text>Supervisor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 20,
  },
  buttonBox: {
    marginBottom: "10%",
    width: "75%",
  },
  input: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "grey",
    marginBottom: 10,
    height: 40,
  },
  button: {
    borderRadius: 20,
    backgroundColor: "#cccc",
    borderColor: "#cccc",
    borderWidth: 1,
    marginBottom: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
});
