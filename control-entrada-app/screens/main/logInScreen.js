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
//     const backHandler = useRef(null)
//     useEffect(() => {
//     backHandler.current = BackHandler.addEventListener("hardwareBackPress", backAction);
//     return () => {
//       backHandler.current.remove()
//         //BackHandler.removeEventListener("hardwareBackPress", backAction);
//     };
//   }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true}/>
      <Text>LogIn Screen!</Text>
      <TextInput placeholder="usuario" />
      <TextInput placeholder="clave" />
      <Button
        onPress={() => {
          props.navigation.navigate("Home");
        }}
        title="Iniciar sesion"
      />
      <Button
        onPress={() => {
          props.navigation.navigate("super");
        }}
        title="Supervisor"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "#fff",
  },
});
