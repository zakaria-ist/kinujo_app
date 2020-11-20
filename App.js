import React from "react";
import { AppRegistry, AppConfig } from "react-native";
// import AccountExamination from "./app/Screens/RegistrationStore";
import SMS from "./app/Screens/SMSAuthentication";
import CR from "./app/Screens/SearchProducts";
import Navigator from "./app/Routes/LoginStack";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  return <Navigator />;
}
