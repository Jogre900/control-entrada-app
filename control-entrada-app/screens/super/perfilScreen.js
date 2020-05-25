import React from "react";
import { View, Text, StyleSheet, Image, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { MainButton } from "../../components/mainButton.component";
export const PerfilScreen = (props) => {
  
  const [textChange, setTextChange] = React.useState(false)
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
          <TextInput onChangeText={()=>{setTextChange(true)}} placeholder="pass" style={styles.input} />
          {(setTextChange)?Alert.alert('algo'):Alert.alert('algo 2')}
          {/* {(setTextChange)? <MainButton
            title="Guardar Cambios"
            onPress={() => {
              Alert.alert("Perfil Actualizado");
            }}
          />: null} */}
          
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  perfilContainer: {
    alignItems: "center",
  },
  perfilLogo: {
    width: 120,
    height: 120,
  },
  editBox: {
      marginTop: 30
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "grey",
  },
});
