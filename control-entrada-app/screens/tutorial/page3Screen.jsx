import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MainColor } from '../../assets/colors'
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from "react-redux";
import { routes } from '../../assets/routes'
export const Page3Screen = ({ navigation }) => {
  const dispatch = useDispatch({ type: "TURN_OFF", payload: false });
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
    <View>
        <Ionicons name='ios-close' size={36} color={MainColor}/>
    </View>
        <Text>Personal</Text>
        <Text>
          En Security puedes crear personal que te ayudara en la tarea de
          control, la app te brinda dos posibles roles: Supervisor y Seguridad.
        </Text>
        <Text>
          El Supervisor llevara todo el control de una zona en que tu le
          especifiques, su personal, cuando visitas han llegado y salido en el
          dia, crear nuevos destinos si es necesario.
        </Text>
        <Text>
          El personal de Seguridad seran los encargados de registrar a todos los
          visitantes, cuando ingresan y cuando salen.
        </Text>
        <View style={styles.buttonContainer}>
        <MainButton
            style={styles.button}
            title="Atras"
            onPress={() => navigation.navigate(routes.PAGE_2)}
            outline
          />
          <MainButton
            style={[styles.button, {marginLeft: 20}]}
            title="Entiendo"
            onPress={() => navigation.navigate(routes.ADMIN_HOME)}
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
