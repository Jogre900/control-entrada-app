import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Avatar from "../components/avatar.component";
import { MainColor, ThirdColor } from "../assets/colors";
import { API_PORT } from "../config/index";
import moment from "moment";

const iconProps = {
  size: 22,
  color: ThirdColor,
  style: {
    marginRight: 4,
  },
};

export const VisitCard = ({ data, selected }) => {
  const { Fotos, Visitante, Destino } = data;
  return (
    <View
      style={[
        styles.visitContainer,
        { backgroundColor: selected ? "#ddd" : "#fff" },
      ]}
    >
      <View style={styles.dataContainer}>
        <View style={styles.dataContainerView}>
          <Avatar.Picture
            size={50}
            uri={`${API_PORT()}/public/imgs/${Fotos[0].picture}`}
          />
        </View>
        <View style={styles.nameContainer}>
          <View
            style={{
              //backgroundColor: "blue",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: 'space-between',
              //width: '100%'
            }}
          >
            <Text style={styles.contentText} numberOfLines={1}>
              {Visitante.name} {Visitante.lastName}
            </Text>
            
            
          </View>
          <View style={{ 
            flexDirection: "row", 
          //backgroundColor: "red" ,
          justifyContent: 'space-between'
          }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {/* <Ionicons name="md-globe" {...iconProps} /> */}
              <Text style={styles.dataText} numberOfLines={1}>
                {/* {Destino.Zona.zone} */}
              </Text>
            </View>
            
            {/* <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 0,
              }}
            >
               <Ionicons name="ios-pin" {...iconProps} /> 
              <Text style={styles.dataText} numberOfLines={1}> {Destino.name}</Text>
            </View> */}
          </View>
        </View>
      </View>
      <View style={styles.locationContainer}>
      <View
              style={{
                //backgroundColor: "pink",
                alignItems: "center",
                flexDirection: "row",
                marginLeft: 10
              }}
            >
              <Text style={styles.dataText} numberOfLines={1}>Entrada: </Text>
              <Text style={styles.contentText} numberOfLines={1}>
                {moment(data.entryDate).format("D MMM YYYY")}
              </Text>
            </View>
      <View
              style={{
                //backgroundColor: "pink",
                alignItems: "center",
                flexDirection: "row",
                marginLeft: 10
              }}
            >
              <Text style={styles.dataText} numberOfLines={1}>Salida: </Text>
              <Text style={styles.contentText} numberOfLines={1}>
                {data.entryDate !== data.departureDate ? moment(data.entryDate).format("D MMM YYYY"): '----'}
              </Text>
            </View>
      </View>

      {/* <View style={styles.dataContainerView}>
                  <Text>Entrada</Text>
                  <Text style={styles.dataText}>
                    {moment(elem.ntryDate).format("HH:mm a")}
                  </Text>
                </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  listEntry: {
    paddingHorizontal: 5,
    //backgroundColor: 'tomato',
    flex: 1,
  },
  visitContainer: {
    flexDirection: "row",
    //justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    //borderBottomWidth: 0.5,
    borderColor: "grey",
    marginVertical: 4,
    //borderRadius: 5,
    backgroundColor: "#fff",
  },
  dataContainer: {
    flexDirection: "row",
    //backgroundColor: "red",
    alignItems: "center",
    flex: 1,
  },
  nameContainer: {
    marginLeft: 8,
    justifyContent: "flex-start",
    //backgroundColor: "green",
    flex: 1
  },
  locationContainer: {
    //backgroundColor: "blue",
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: "column",
    //alignItems: "center",
    //marginRight: 5,
    marginLeft: 10,
  },
  dataContainerView: {
    justifyContent: "center",
    alignItems: "center",
    //width: "33%",
    //maxWidth: "33%",
  },
  iconContainer: {
    alignItems: "center",
    marginRight: 5,
  },
  contentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
  },
  dataText: {
    fontSize: 14,
    color: "#8e8e8e",
  },
});
