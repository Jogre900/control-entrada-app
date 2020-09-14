import React from 'react'
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native'

//componentes
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component.jsx";
import Input from "../../components/input.component";
import { MainButton } from "../../components/mainButton.component";
import { Ionicons } from "@expo/vector-icons";

export const ZoneDetailScreen = (props) => {
    console.log(props)
    const goBackAction = () => {
        return (
          <View>
            <TouchableHighlight
              onPress={() => {
                props.navigation.goBack();
              }}
            >
              <Ionicons name="ios-arrow-back" size={28} color="white" />
            </TouchableHighlight>
          </View>
        );
      };
    return (
        <View>
            <TopNavigation title="" leftControl={goBackAction()}/>
        </View>
    )
}

const styles = StyleSheet.create({})