import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAKOUbowtB8YpHIpHQPuc5FyU4PWirRBXI",
  authDomain: "control-entrada-app.firebaseapp.com",
  databaseURL: "https://control-entrada-app.firebaseio.com",
  projectId: "control-entrada-app",
  storageBucket: "control-entrada-app.appspot.com",
  messagingSenderId: "1029871149264",
  appId: "1:1029871149264:web:a49ebbd44985fbde19fed5",
  measurementId: "G-HRQRKMCFX9",
}

export default firebase.initializeApp(firebaseConfig)