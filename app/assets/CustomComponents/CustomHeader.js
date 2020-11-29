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
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { useIsFocused } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import CartLogo from "../icons/cart.svg";
import FavouriteLogo from "../icons/favorite.svg";
import firebase from "firebase/app";
import "firebase/firestore";
import Request from "../../lib/request";
import AsyncStorage from "@react-native-community/async-storage";
import { firebaseConfig } from "../../../firebaseConfig.js";
import { Colors } from "../Colors";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const request = new Request();
const db = firebase.firestore();

const win = Dimensions.get("window");
let userId;
export default function CustomKinujoWord({ text, onFavoritePress, onPress }) {
  const [cartCount, onCartChanged] = React.useState(0);
  const ratioKinujo = win.width / 4 / 78;
  const ratioFavorite = win.width / 14 / 24;
  const ratioCart = win.width / 11 / 23;
  const isFocused = useIsFocused();
  const [user, onUserChanged] = React.useState({});
  const [userAuthorityID, onUserAuthorityIDChanged] = React.useState(0);
  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function (url) {
      request.get(url).then((response) => {
        onUserChanged(response.data);
        onUserAuthorityIDChanged(response.data.authority.id);
      });
      onCartChanged(0);
      const subscriber = db
        .collection("users")
        .doc(String(user.id))
        .collection("carts")
        .get()
        .then((querySnapShot) => {
          onCartChanged(querySnapShot.docs.length);
        });
    });
  }, [isFocused]);
  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        flexDirection: "row",
        alignItems: "center",
        height: heightPercentageToDP("7%"),
        justifyContent: "space-evenly",
      }}
    >
      <StatusBar
        style={{ height: Platform.OS === "ios" ? 20 : StatusBar.currentHeight }}
      />

      <Image
        style={{
          width: win.width / 4,
          height: 22 * ratioKinujo,
          position: "absolute",
          left: 0,
          marginLeft: widthPercentageToDP("5%"),
        }}
        source={require("../Images/headerKinujo.png")}
      />

      <Text
        style={{
          fontSize: RFValue(12),
        }}
      >
        {text}
      </Text>
      <View
        style={{
          flexDirection: "row-reverse",
          position: "absolute",
          right: 0,
          alignItems: "center",
        }}
      >
        {userAuthorityID <= 3 ? (
          <View></View>
        ) : (
          <TouchableWithoutFeedback onPress={onPress}>
            <View
              style={{
                width: win.width / 11,
                height: 21 * ratioCart,
                marginRight: widthPercentageToDP("3%"),
              }}
            >
              {cartCount ? (
                <View style={styles.notificationNumberContainer}>
                  <Text
                    style={{
                      alignSelf: "center",
                      fontSize: RFValue(10),
                      color: "white",
                    }}
                  >
                    {cartCount}
                  </Text>
                </View>
              ) : (
                <View></View>
              )}
              <CartLogo
                style={{
                  width: win.width / 11,
                  height: 21 * ratioCart,
                  marginRight: widthPercentageToDP("5%"),
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
        <TouchableWithoutFeedback onPress={onFavoritePress}>
          <FavouriteLogo
            style={{
              marginRight: widthPercentageToDP("5%"),
            }}
            width={win.width / 11}
            height={21 * ratioCart}
          />
        </TouchableWithoutFeedback>
      </View>
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
