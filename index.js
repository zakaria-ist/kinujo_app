import { registerRootComponent } from "expo";
import App from "./App";
import firebase from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import messaging from '@react-native-firebase/messaging';
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
console.disableYellowBox = true;
