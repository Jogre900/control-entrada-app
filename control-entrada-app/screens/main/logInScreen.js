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

//components
import { MainButton } from "../../components/mainButton.component";

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
  const paramsHome = {
    props: props,
    title: "Iniciar Sesion",
    route: "Home",
    navigate: true
  };

  const paramsSuper = {
    props: props,
    title: "Supervisor",
    route: "super",
    navigate: true
  };

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
        <MainButton title='Iniciar Sesion' onPress={()=>{props.navigation.navigate('Home')}}/>
        <MainButton title='Supervsor' onPress={()=>{props.navigation.navigate('super')}}/>
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
});
