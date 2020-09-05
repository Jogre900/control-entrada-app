import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import {Ionicons} from "@expo/vector-icons";

//componentes
import { API_PORT } from "../../config/index.js";
import { TopNavigation } from "../../components/TopNavigation.component.js";
import  Input  from "../../components/input.component.js";
import { MainButton } from "../../components/mainButton.component";

export const ZonasScreen = (props) => {
  const [zoneName, setZoneName] = useState("");
  const [horaEntrada, setHoraEntrada] = useState(null);
  const [horaSalida, setHoraSalida] = useState(null);
  const [company, setCompany] = useState([]);
  
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
      )
    }

  const requestCompany = async () => {
    console.log(API_PORT)  
    let res = await axios.get(`${API_PORT()}/api/findCompany`)
      let company = res.data.data
      return setCompany(company)
  }
  useEffect(() => {
      requestCompany()
  }, [])
  return (
    <View>
      <TopNavigation title="Zonas" leftControl={goBackAction()} />
      <View>
            <View>
                {
                    company.map((elm) => 
                    <View key={elm.id}>
                        <Text>{elm.name}</Text>
                    </View>
                    )
                }
            </View>
            <Text>Crear Zona</Text>
        
             <Input
                style={{ borderColor: "#ff7e00", marginBottom: 10 }}
                styleInput={{ color: "white" }}
                title="NombreZona"
                textColor="white"
                shape="round"
                alignText="center"
                returnKeyType="next"
                
                onChangeText={(nombre) => {
                    setZoneName(nombre);
                }}
                value={zoneName}
                /> 
                 <Input
                style={{ borderColor: "#ff7e00", marginBottom: 10 }}
                styleInput={{ color: "white" }}
                title="Hora de entrada"
                textColor="white"
                shape="round"
                alignText="center"
                returnKeyType="next"
                
                onChangeText={(entrada) => {
                    setHoraEntrada(entrada);
                }}
                value={horaEntrada}
                />
                <Input
                style={{ borderColor: "#ff7e00", marginBottom: 10 }}
                styleInput={{ color: "white" }}
                title="Hora de salida"
                textColor="white"
                shape="round"
                alignText="center"
                returnKeyType="next"
                
                onChangeText={(salida) => {
                    setHoraSalida(salida);
                }}
                value={horaSalida}
                />
                <MainButton 
                title="Guardar"
                onPress={() => {
                  signIn();
                }}
              />
                </View>
    </View>
  );
};
