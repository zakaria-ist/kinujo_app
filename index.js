import { registerRootComponent } from "expo";
import App from "./App";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
console.disableYellowBox = true;
