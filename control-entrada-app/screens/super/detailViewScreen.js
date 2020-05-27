import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import { TopNavigation } from "../../components/TopNavigation.component";
import { DetailCard } from "../../components/detailCard.component";

export const DetailViewScreen = (props) => {
  
  const data = props.route.params;
  const goBackAction = () => {
    return (
      <RectButton
        onPress={() => {
          props.navigation.goBack();
        }}
      >
        <Ionicons name="ios-arrow-back" size={28} color="white" />
      </RectButton>
    );
  };

  return (
    <View>
      <TopNavigation title="Vista Detallada" leftControl={goBackAction()} />
      <DetailCard data={data} />
    </View>
  );
};
