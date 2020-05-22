import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { TopNavigation } from "../../components/TopNavigation.component";
import { DetailCard } from '../../components/detailCard.component'



export const DetailViewScreen = (props) => {
  console.log('props detail-view =======', props)
  const data = props.route.params;
  const params = {
    id: false,
    props: props,
    title: "Vista Detallada",
  };
  
  return (
    <View>
      <TopNavigation {...params} />
      <DetailCard data={data}/>
    </View>
  );
};


