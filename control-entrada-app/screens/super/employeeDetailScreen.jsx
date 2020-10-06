import React from 'react'
import { View, TouchableHighlight, Image, Text, StyleSheet } from 'react-native'

//COMPONENT
import {TopNavigation} from '../../components/TopNavigation.component'
import {API_PORT, ThirdColor} from '../../config/index'
import { Ionicons } from "@expo/vector-icons";
export const EmployeeDetailScreen = (props) => {
    const profile = props.route.params
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
        <View style={{flex: 1}}>
            <TopNavigation title="Perfil" leftControl={goBackAction()}/>
            <View style={styles.section1}>
            <Image 
              style={{width: 120, height: 120, borderRadius: 60, resizeMode: 'cover'}}
              source={{uri: `${API_PORT()}/public/imgs/${profile.picture}`}}/>
              <Text style={styles.profileName}>{profile.name} {profile.lastName}</Text>
              <Text>{profile.email}</Text>
              <View style={styles.privilegeBox}>
              <Text style={styles.privilegeText}>{profile.privilege}</Text>
              </View>
            </View>
            <View style={styles.section2}>
            <Text>{profile.dni}</Text>
              
              
              <Text>Contratado el: {profile.userZone[0].assignationDate}</Text>
              <Text>Cambio de Turno: {profile.userZone[0].changeTurnDate}</Text>
              <View>
              <Ionicons name='ios-business' size={28} color={ThirdColor}/>
              <Text>{profile.userZone[0].Zone.zone}</Text>
              </View> 
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  container : {
    flex: 1
  },
  section1: {
    height: '40%', justifyContent: 'center', alignItems: 'center'
  },
  section2: {
    height: '50%'
  },
  profileName: {
    fontSize: 22,
    fontWeight: '100',
    color: 'black'
  },
  privilegeBox: {
    backgroundColor: ThirdColor,
    borderRadius: 12
  },
  privilegeText: {
    alignSelf: 'center',
    fontSize: 18,
    color: '#fff',
    fontWeight: 'normal',
    paddingHorizontal: 10,
    paddingVertical: 3
  }
})


              
