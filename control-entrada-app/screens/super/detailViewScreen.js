import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

import { TopNavigation } from '../../components/TopNavigation.component'

export const DetailViewScreen = (props) => {
  const data = props.route.params;
  const params = {
    id: false,
    props: props,
    title: 'Vista Detallada'
  }
  console.log("data", data);
  return (
    <View>
        <TopNavigation {...params}/>
      {data.map((index) => {
        return (
          <View>
            <Text>{index.cedula}</Text>
            <Text>{index.nombre}</Text>
            <Text>{index.entrada}</Text>
            <Text>{index.salida}</Text>
          </View>
        );
      })}
    </View>
  );
};
