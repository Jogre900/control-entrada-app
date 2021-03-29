import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { connect, useDispatch } from "react-redux";

import { routes } from "../../assets/routes";

//components
import { MainButton } from "../../components/mainButton.component";

const { width, height } = Dimensions.get("window");

const MainScreen = ({
  navigation,
  saveProfile,
  saveCompany,
  saveLogin,
  route,
  isToken,
  token,
  privilege,
}) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/background.jpg")}
        style={styles.imageBackground}
      >
        <StatusBar hidden={true} />

        <TouchableWithoutFeedback
          style={styles.backCover}
          onPress={() => Keyboard.dismiss()}
        >
          <KeyboardAvoidingView style={styles.backCover} behavior="padding">
            <Image
              style={styles.logo}
              source={require("../../assets/images/security-logo.png")}
            />
            <View style={styles.buttonBox}>
              <MainButton
                title="Ingresar"
                style={styles.input}
                onPress={() => {
                  navigation.navigate(routes.LOGIN);
                }}
              />
              <MainButton
                title="Registrate"
                style={[styles.input]}
                textStyle={{color: '#fff'}}
                outline
                onPress={() => {
                  navigation.navigate(routes.REGISTER);
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonBox: {
    marginBottom: "10%",
    width: "75%",
    //position: "absolute",
  },
  imageBackground: {
    resizeMode: "cover",
    flex: 1,
  },
  backCover: {
    backgroundColor: "black",
    flex: 1,
    width: width,
    height: height,
    opacity: 0.8,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    bottom: "25%",
  },
  input: {
    marginVertical: 5,
  },
});

const mapStateToProps = (state) => {
  return {
    isToken: state.profile,
    //token: state.profile?.login.token,
    //privilege: state.profile.login.privilege,
  };
};

const mapDispatchToProps = (dispatch) => ({
  saveProfile(profile) {
    dispatch({
      type: "SAVE_PROFILE",
      payload: profile,
    });
  },
  saveCompany(company) {
    dispatch({
      type: "SAVE_COMPANY",
      payload: company,
    });
  },
  saveLogin(login) {
    dispatch({
      type: "SET_LOGIN",
      payload: login,
    });
  },
});
export default connect(mapStateToProps, mapDispatchToProps)(MainScreen);
