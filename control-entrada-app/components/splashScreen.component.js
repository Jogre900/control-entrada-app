import React, { useEffect } from "react";
import { View, StyleSheet, Image, Dimensions, Animated, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");
const logo = require("../assets/images/security-logo.png");

export const SplashScreen = () => {
  const scaleUp = new Animated.Value(1);
  const opacityInterpolate = scaleUp.interpolate({
    inputRange: [1, 1.1],
    outputRange: [0.1, 1],
  });

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleUp, {
          toValue: 1.1,
          duration: 1000,
        }),
        Animated.timing(scaleUp, {
          toValue: 1,
          duration: 1000,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
        <StatusBar hidden={true}/>
      <Animated.Image
        source={logo}
        style={[
          styles.logo,
          {
            transform: [{ scale: scaleUp }],
            opacity: opacityInterpolate,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: "#ff7e00",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    //backgroundColor: 'pink'
    //transform: [{
    //  scale: scaleUp
    //}],
    //opacity: opacityInterpolate,
  },
});
