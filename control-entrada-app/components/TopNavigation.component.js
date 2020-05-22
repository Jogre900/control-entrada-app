import React from "react";
import { View, Text, StyleSheet, Alert, StatusBar } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

function Notification() {
  return (
    <RectButton
      onPress={() => {
        Alert.alert("NOTI");
      }}
    >
      <Ionicons name="ios-notifications" size={32} color="grey" />
    </RectButton>
  );
}

function NormalNav() {
  return <View>
    <Ionicons name='ios-notifications' size={32} color='#eee'/>
  </View>;
}

export const TopNavigation = (params) => {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <RectButton
        onPress={() => {
          params.id
            ? params.props.navigation.toggleDrawer()
            : params.props.navigation.goBack();
        }}
      >
        {params.id ? (
          <Ionicons name="md-menu" size={32} color="grey" />
        ) : (
          <Ionicons name="ios-arrow-back" size={32} color="grey" />
        )}
      </RectButton>
      <View>
        <Text style={styles.title}>{params.title}</Text>
      </View>
      {params.id ? Notification() : NormalNav()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: '#eee'
  },
  title: {
    fontSize: 17,
  },
});
