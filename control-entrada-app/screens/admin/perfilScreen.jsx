import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { connect } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { routes } from '../../assets/routes'
import { BackAction } from '../../helpers/ui/ui'

//components
import { TopNavigation } from "../../components/TopNavigation.component";
import { API_PORT } from "../../config/index";
import { FormContainer } from "../../components/formContainer";
import Avatar from "../../components/avatar.component";


const PerfilScreen = ({ navigation, profile, company }) => {
  console.log("profile-redux:  ", profile);
  console.log("company-redux:  ", company);


  const [passChange, setPassChange] = React.useState("");
  const [repeatPass, setRepeatPass] = React.useState("");

  const editAction = () => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(routes.EDIT_PROFILE);
          }}
        >
          <Ionicons name="md-create" size={28} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <TopNavigation
        title="Perfil"
        leftControl={BackAction(navigation, routes.ADMIN_HOME)}
        rightControl={editAction()}
      />

      {profile ? (
        <ScrollView contentContainerStyle={styles.perfilContainer}>
          <View style={styles.profileTopContainer}>
            <View style={styles.pictureContainer}>
              <Avatar.Picture
                size={120}
                uri={`${API_PORT()}/public/imgs/${profile.picture}`}
              />
            </View>
            <Text style={styles.profileName}>
              {profile.name} {profile.lastName}
            </Text>
            <View
              style={{
                flexDirection: "row",
                //backgroundColor: 'green',
                justifyContent: "space-between",
                marginVertical: 15,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>{profile.dni}</Text>
                <Text style={styles.labelText}>dni</Text>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.contentText}>{profile.email}</Text>
                <Text style={styles.labelText}>email</Text>
              </View>
            </View>
          </View>
          <FormContainer title="Negocio">
            {company.map((elem, index) => (
              <View key={index}>
                <Text style={styles.contentText}>Compañia: {elem.companyName}</Text>
                <Text style={styles.contentText}>Razon Social: {elem.businessName}</Text>
                {/* <Text style={styles.contentText}>{elem.logo}</Text> */}
                <Text style={styles.contentText}>Ciudad: {elem.city}</Text>
                <Text style={styles.contentText}>Direccion: {elem.address}</Text>
                <Text style={styles.contentText}>NIC: {elem.nic}</Text>
                <Text style={styles.contentText}>Telefono: {elem.phoneNumber}</Text>
                <Text style={styles.contentText}>Telefono Adicional: {elem.phoneNumberOther}</Text>
              </View>
            ))}
            <Avatar.Picture
              size={60}
              uri={`${API_PORT()}/public/imgs/${company[0].logo}`}
            />
          </FormContainer>
        </ScrollView>
      ) : null}
    </View>
  );
};


const mapStateToProps = (state) => ({
  profile: state.profile.profile,
  company: state.profile.company,
});
export default connect(mapStateToProps, {})(PerfilScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  perfilContainer: {
    alignItems: "center",
  },
  profileTopContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 5,
    padding: 8,
    elevation: 5,
  },
  pictureContainer: {
    alignSelf: "center",
    position: "relative",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
    borderRadius: 120 / 2,
    backgroundColor: "#fff",
  },
  perfilLogo: {
    width: 120,
    height: 120,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "100",
    color: "black",
    alignSelf: "center",
  },
  contentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#262626",
  },
  labelText: {
    fontSize: 14,
    color: "#8e8e8e",
  },
  dataText: {
    fontSize: 14,
    fontWeight: "100",
  },
  editContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    marginVertical: 2.5,
    padding: 8,
    width: "90%",
  },
  input: {
    marginBottom: 2,
  },
});

