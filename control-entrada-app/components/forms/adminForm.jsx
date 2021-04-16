import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FormContainer } from "../formContainer";
import { MainColor, Success } from "../../assets/colors";
import Avatar from "../avatar.component";
import Input from "../input.component";
import { CameraModal } from "../cameraModal";

const inputProps = {
  shape: "flat",
  textColor: "grey",
};

export const AdminForm = ({ handleChange, value, caption }) => {
  
  const [camera, setCamera] = useState({
    visible: false,
    type: "",
  });
  const openCamera = (type) => {
    setCamera({ ...camera, visible: true, type });
  };

  const profilePic = (uri, fileName, fileType) => {
    
    
    handleChange("uri", uri);
    handleChange("fileName", fileName);
    handleChange("fileType", fileType);
  };
  const companyPic = (uri, fileName, fileType) => {
    
    
    handleChange("uriLogo", uri);
    handleChange("fileNameLogo", fileName);
    handleChange("fileTypeLogo", fileType);
  };
  return (
    <>
      <FormContainer title="Datos Personales">
        <View style={styles.pictureContainer}>
          {value.uri ? (
            <Avatar.Picture size={120} uri={value.uri} />
          ) : (
            <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
          )}
          <TouchableOpacity
            onPress={() => {
              openCamera("profile");
            }}
            style={styles.openCameraButton}
          >
            <Ionicons name="ios-camera" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
        <Input
          title="Nombre"
          icon="ios-person"
          onChangeText={(name) => handleChange("name", name)}
          value={value.name}
          {...inputProps}
          // caption={caption.name}
        />
        <Input
          title="Apellido"
          icon="ios-person"
          onChangeText={(lastName) => handleChange("lastName", lastName)}
          value={value.lastName}
          {...inputProps}
          // caption={caption.lastName}
        />
        <Input
          title="DNI"
          icon="ios-card"
          onChangeText={(dni) => handleChange("dni", dni)}
          value={value.dni}
          // caption={caption.dni}
          {...inputProps}
        />
        <Input
          title="Correo"
          icon="ios-mail"
          onChangeText={(email) => handleChange("email", email)}
          value={value.email}
          // caption={caption.email}
          {...inputProps}
        />
        <Input
          //style={{ borderColor: passEqual && Success }}
          title="Contraseña"
          onChangeText={(password) => handleChange("password", password)}
          value={value.password}
          // caption={caption.password}
          secureTextEntry
          {...inputProps}
        />
        <Input
          //style={{ borderColor: passEqual && Success }}
          title="Repetir Contraseña"
          onChangeText={(repPass) => handleChange("repPass", repPass)}
          value={value.repPass}
          // caption={caption.repPass}
          secureTextEntry
          {...inputProps}
        />
        <View>
          <Text style={styles.caption}>{caption}</Text>
        </View>
      </FormContainer>
      <FormContainer title="Datos de la empresa">
        <Input
          title="Empresa"
          icon="md-business"
          onChangeText={(companyName) =>
            handleChange("companyName", companyName)
          }
          {...inputProps}
          //caption={registerCaption.companyName}
        />
        <Input
          title="Razon social"
          icon="ios-briefcase"
          onChangeText={(businessName) =>
            handleChange("businessName", businessName)
          }
          {...inputProps}
          //   caption={registerCaption.businessName}
        />
        <Input
          title="nic"
          icon="ios-card"
          onChangeText={(nic) => handleChange("nic", nic)}
          {...inputProps}
          //   caption={registerCaption.nic}
        />
        <Input
          title="Direccion (Opcional)"
          icon="ios-pin"
          onChangeText={(address) => handleChange("address", address)}
          {...inputProps}
        />
        <Input
          title="Ciudad (Opcional)"
          icon="ios-home"
          onChangeText={(city) => handleChange("city", city)}
          {...inputProps}
        />
        <Input
          title="Telefono"
          icon="md-call"
          keyboardType="numeric"
          returnKeyType='next'
          onChangeText={(phoneNumber) =>
            handleChange("phoneNumber", phoneNumber)
          }
          {...inputProps}
          //   caption={registerCaption.phoneNumber}
        />
        <Input
          title="Telefono adicional (Opcional)"
          icon="md-call"
          keyboardType="numeric"
          onChangeText={(phoneNumberOther) =>
            handleChange("phoneNumberOther", phoneNumberOther)
          }
          {...inputProps}
        />
        <Text style={styles.labelText}>
          *Puedes agregar un logo para tu empresa
        </Text>
        <View style={styles.pictureContainer}>
          {value.uriLogo ? (
            <Avatar.Picture size={120} uri={value.uriLogo} />
          ) : (
            <Avatar.Icon size={32} name="md-photos" color="#8e8e8e" />
          )}
          <TouchableOpacity
            onPress={() => {
              openCamera("company");
            }}
            style={styles.openCameraButton}
          >
            <Ionicons name="ios-camera" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
        <CameraModal
          status={camera.visible}
          onClose={() => setCamera({ ...camera, visible: false })}
          profile={profilePic}
          anotherPic={companyPic}
          type={camera.type}
        />
      </FormContainer>
    </>
  );
};

const styles = StyleSheet.create({
  pickPictureContainer: {
    backgroundColor: "#fff",
    width: "90%",
    borderRadius: 5,
    marginVertical: 5,
    padding: 8,
    elevation: 5,
  },
  pictureContainer: {
    height: 120,
    width: 120,
    alignSelf: "center",
    position: "relative",
    marginVertical: 10,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
    borderRadius: 120 / 2,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  openCameraButton: {
    position: "absolute",
    bottom: 0,
    right: -15,
    backgroundColor: MainColor,
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    borderColor: "#fff",
    borderWidth: 2,
    elevation: 10,
  },
  labelText:{
    fontSize: 14,
    color: '#8e8e8e'
  },
  caption: {
    fontSize: 16,
    fontWeight: "500",
    color: "red",
    letterSpacing: 0.5,
    marginLeft: 5,
  },
});
