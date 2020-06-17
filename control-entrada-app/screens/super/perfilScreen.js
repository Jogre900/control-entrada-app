import React from "react";
import { View, Text, StyleSheet, Image, TextInput, Alert, TouchableHighlight } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import Input from "../../components/input.component";

export const PerfilScreen = (props) => {
  const [passChange, setPassChange] = React.useState("");

  const [repeatPass, setRepeatPass] = React.useState("");

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

  return (
    <View>
      <TopNavigation title="Perfil" leftControl={goBackAction()} />
      <View style={styles.perfilContainer}>
        <Image style={styles.perfilLogo} source={require("../../assets/images/security-logo.png")} />
        <Text>Security. All Right Reserved</Text>
        <View style={styles.editBox}>
          <Input title="Nombre" secureTextEntry={false} shape="flat" icon="ios-person" style={styles.input} />
          <Text>Cambio de Contraseña</Text>
          <Input
            style={styles.input}
            title="Clave"
            icon="ios-eye-off"
            //alignText="center"
            shape="flat"
            secureTextEntry={true}
            onChangeText={(text) => {
              setPassChange(text);
            }}
            value={passChange}
          />
          {passChange != "" ? (
            <Input
              style={styles.input}
              icon="ios-eye-off"
              title="Repetir Clave"
              //alignText="center"
              secureTextEntry={true}
              shape="flat"
              onChangeText={(text) => {
                setRepeatPass(text);
              }}
              value={repeatPass}
            />
          ) : null}
          {passChange === repeatPass ? <MainButton style={{ width: "100%" }} title="Guardar Cambios" /> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  perfilContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  perfilLogo: {
    width: 120,
    height: 120,
  },
  editBox: {
    marginTop: 30,
    //justifyContent: "center",
    //alignItems: "center",
    width: "75%",
  },
  input: {
    marginBottom: 10,
  },
});
