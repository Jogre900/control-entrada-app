import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

//components
import { TopNavigation } from "../../components/TopNavigation.component";

export const HomeSuperScreen = (props) => {
  const params = {
    props: props,
    title: "Entradas del dia",
  };
  return (
    <View>
      <TopNavigation {...params} />
    </View>
  );
};
