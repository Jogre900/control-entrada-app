//import * as firebase from 'firebase'
//import {v4 as uuid4} from 'uuid'
import firebase from "./firebase";

const FireMethods = {
  async saveEntrance(name, lastName, dni, destiny, hora_entrada, hora_salida, foto) {
    return await firebase.database().ref("/entradas").push({
      nombre: name,
      apellido: lastName,
      cedula: dni,
      destino: destiny,
      hora_entrada: hora_entrada,
      hora_salida: hora_salida,
      foto: foto,
    });
    //id: uuid4();
  },
  async updateEntrance(id, hora_salida) {
    console.log("id ipdate: ", id);
    return await firebase.database().ref("entradas").child(id).update({
      hora_salida,
    });
    //id: uuid4();
  },

  async getEntrance(callback) {
    var usersRef = firebase.database().ref("entradas");

    await firebase
      .database()
      .ref(usersRef)
      .once("value", (snapshot) => {
        //console.log("snapshot-val", snapshot.val());
        let datos = "";
        if (snapshot.val()) {
          datos = snapshot.val();
        }
        callback(datos);
      });
  },
  async getEntranceById(dni, callback) {
    let ref = firebase.database().ref("/entradas");
    await firebase
      .database()
      .ref(ref)
      .orderByChild("cedula")
      .equalTo(dni)
      .on("value", (snapshot) => {
        let usuario = snapshot.val();
        callback(usuario);
      });
  },

  async getDuplicateDni(dni, callback) {
    let ref = firebase.database().ref("/entradas");
    let search = {};
    let response = {
      data: null,
      msg: "",
    };
    await firebase.database().ref(ref)
      .orderByChild("cedula")
      .equalTo(dni)
      .on("value", (snapshot) => {
        console.log(snapshot.val());
        search = snapshot.val();
      });

    if (search && Object.entries(search).length > 0) {
      await Object.keys(search).map((item) => {
        if (search[item].hora_salida == "") {
          response.data = search[item];
          response.data.timeStamp = item;
        }
      });
      if (response.data == null) {
        response.msg = "No Posee Entrada Registrada.";
      }
    } else {
      console.log("paso por aqui");
      response.msg = "La Cedula Ingresada Nunca ha Sido Registrada.";
    }
    callback(response);
  },
};

module.exports = FireMethods;
