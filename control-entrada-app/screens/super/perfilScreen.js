import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  TouchableHighlight,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
import { Input } from "../../components/input.component";

export const PerfilScreen = (props) => {
  const [textChange, setTextChange] = React.useState("");
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
        <Image
          style={styles.perfilLogo}
          source={require("../../assets/images/security-logo.png")}
        />
        <Text>Security. All Right Reserved</Text>
        <View style={styles.editBox}>
          <Text>Cambio de Contraseña</Text>
          <Input
            style={styles.input}
            title="Clave"
            alignText="center"
            shape="round"
            secureTextEntry={true}
            onChangeText={(text) => {
              setTextChange(text);
            }}
            value={textChange}
          />
          {textChange != "" ? (
            <Input
              
              title="Repetir Clave"
              alignText="center"
              secureTextEntry={true}
              shape="round"
              onChangeText={(text) => {
                setRepeatPass(text);
              }}
              value={repeatPass}
            />
          ) : null}
          {repeatPass != "" ? <MainButton style={{width: '100%'}}title="Guardar Cambios" /> : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  perfilContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  perfilLogo: {
    width: 120,
    height: 120,
  },
  editBox: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    width: '75%'
  },
  input: {
    marginTop: 10
  },
});
