import { registerRootComponent } from "expo";
import App from "./App";
import firebase from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import messaging from "@react-native-firebase/messaging";
import { cos } from "react-native-reanimated";
import { useNavigation } from "react-navigation-hooks";
import SplashScreen from 'react-native-splash-screen'
// firebase.firestore().clearPersistence();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
SplashScreen.hide();
// const { navigate } = useNavigation();
// // firebase.getInstance().setPersistenceEnabled(false);
// messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//   console.log("Message handled in the background!", remoteMessage);
// });
// const notificationOpen = messaging().getInitialNotification();
// if (notificationOpen) {
//   navigate("SalesManagement");
// }
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
console.disableYellowBox = true;
