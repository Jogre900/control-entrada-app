import React from "react";
import { View, Text, StyleSheet, Alert, StatusBar } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export const TopNavigation = (params) => (
  <View style={styles.container}>
    <StatusBar hidden={true} />
    <RectButton
      onPress={() => {
        params.props.navigation.toggleDrawer();
      }}
    >
      <Ionicons name="md-menu" size={32} color="grey" />
    </RectButton>
    <View>
      <Text style={styles.title}>{params.title}</Text>
    </View>
    <RectButton
      onPress={() => {
        Alert.alert("NOTI");
      }}
    >
      <Ionicons name="ios-notifications" size={32} color="grey" />
    </RectButton>
  </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    title: {
        fontSize: 17,
    }

});
