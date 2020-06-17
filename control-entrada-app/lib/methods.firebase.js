//import * as firebase from 'firebase'
import firebase from "./firebase";

const FireMethods = {
  saveEntrance(name, lastName, dni, destiny, hora_entrada, foto) {
    return firebase.database().ref("/entradas").push(
      {
      nombre: name,
      apellido: lastName,
      cedula: dni,
      destino: destiny,
      hora_entrada: hora_entrada,
      foto: foto,
    }
    );
  },

  getEntrance(callback) {
    var usersRef = firebase.database().ref("entradas");

    firebase
      .database()
      .ref(usersRef)
      .on("child_added", (snapshot) => {
        //console.log("snapshot-val", snapshot.val());
        let datos = "";
        if (snapshot.val()) {
          datos = snapshot.val();
        }
        callback(datos);
      });
  },
  getEntranceById() {
    let ref = firebase.database().ref("entradas");
    firebase
      .database()
      .ref(ref)
      .on("child_added", (snapshot) => {
        let usuarios = snapshot.val();
        console.log("dni:---", usuarios.cedula);
      });
  },
  getDuplicateDni(dni) {
    let ref = firebase.database().ref("entradas");
    console.log(dni)
    firebase
      .database()
      .ref(ref)
      .equalTo(dni)
      .on("child_added", (snapshot) => {
        
          console.log(snapshot.val())
      });
  },
};

module.exports = FireMethods;
