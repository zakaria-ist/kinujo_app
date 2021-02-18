import { registerRootComponent } from "expo";
import AppAndroid from "./AppAndroid";
import firebase from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import messaging from "@react-native-firebase/messaging";
import { cos } from "react-native-reanimated";
import { useNavigation } from "react-navigation-hooks";
// firebase.firestore().clearPersistence();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
registerRootComponent(AppAndroid);
// console.log = console.warn = console.error = () => {};
console.disableYellowBox = true;
