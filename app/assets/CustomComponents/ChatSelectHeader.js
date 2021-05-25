import React, { useState } from "react";
import {
  Image,
  View,
  Dimensions,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useIsFocused } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import CartLogo from "../icons/cart.svg";
import FavouriteLogo from "../icons/favorite.svg";
import Translate from "../Translates/Translate";
import firebase from "firebase/app";
import "firebase/firestore";
import Request from "../../lib/request";
import AsyncStorage from "@react-native-community/async-storage";
import { firebaseConfig } from "../../../firebaseConfig.js";
import { Colors } from "../Colors";
import KinujoWord from "../icons/kinujo.svg";
import BackArrow from "../icons/arrow_back.svg";
import CustomAlert from "../../lib/alert";
import GroupImages from "./GroupImages";
const alert = new CustomAlert();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const request = new Request();
const db = firebase.firestore();

const win = Dimensions.get("window");
export default function ChatSelectHeader({
  onSend,
  onCancel,
}) {
  const isFocused = useIsFocused();
  React.useEffect(() => {

  }, [isFocused]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        height: heightPercentageToDP("7%"),
        justifyContent: "flex-end",
      }}
    >
      <StatusBar
        style={{ height: Platform.OS === "ios" ? 20 : StatusBar.currentHeight }}
      />
      
      <TouchableWithoutFeedback onPress={onSend}>
          <View style={{marginRight: widthPercentageToDP("2%")}}><Text>{Translate.t("send")}</Text></View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={onCancel}>
          <View style={{marginRight:widthPercentageToDP("5%")}}><Text>{Translate.t("cancel")}</Text></View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  notificationNumberContainer: {
    right: -5,
    top: -5,
    position: "absolute",
    zIndex: 1,
    borderRadius: win.width / 2,
    width: RFValue(20),
    height: RFValue(20),
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
});
