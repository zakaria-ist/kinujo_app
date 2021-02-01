import { registerRootComponent } from "expo";
import firebase from "firebase/app";
import AppIos from "./AppIos"
import { firebaseConfig } from "./firebaseConfig";
import { Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { cos } from "react-native-reanimated";
import { useNavigation } from "react-navigation-hooks";
// firebase.firestore().clearPersistence();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
registerRootComponent(AppIos);
console.log = console.warn = console.error = () => {};
console.disableYellowBox = true;
