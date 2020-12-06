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
import {
  notifications,
  NotificationMessage,
  Android,
} from "react-native-firebase-push-notifications";
import { cos } from "react-native-reanimated";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const channel = new Android.Channel(
  "chat",
  "Chat Channel",
  Android.Importance.Max
).setDescription("Chat Message Channel");
notifications.android().createChannel(channel);
messaging().onMessage((payload) => {
  // console.log("wew" + JSON.stringify(payload.data.groupName));
  notifications.displayNotification(
    new NotificationMessage()
      .setNotificationId("chat")
      .setTitle(payload.data.groupName)
      .setBody(payload.notification.body)

      .android.setChannelId("chat") //required for android
  );
});

export default function AppAndroid() {
  return (
    <BackdropProvider>
      <StatusBar barStyle="dark-content" />
      <Navigator />
    </BackdropProvider>
  );
}
