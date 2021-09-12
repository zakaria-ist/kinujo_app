import React from "react";
import { AppRegistry, AppConfig, StatusBar, Platform } from "react-native";
// import AccountExamination from "./app/Screens/RegistrationStore";
// import SMS from "./app/Screens/SMSAuthentication";
// import CR from "./app/Screens/SearchProducts";
import Navigator from "./app/Routes/LoginStack";
import BackdropProvider from "@mgcrea/react-native-backdrop-provider";
import firebase from "firebase/app";
import "firebase/firestore";
import messaging from "@react-native-firebase/messaging";
import { firebaseConfig } from "./firebaseConfig";
import { useNavigation } from "react-navigation-hooks";
import { cos } from "react-native-reanimated";
import { enableScreens } from 'react-native-screens';
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function AppAndroid() {
  enableScreens();
  return (
    <BackdropProvider>
      <StatusBar barStyle="default" />
      <Navigator />
    </BackdropProvider>
  );
}
