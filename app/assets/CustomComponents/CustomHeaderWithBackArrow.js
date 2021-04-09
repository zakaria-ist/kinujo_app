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
import firebase from "firebase/app";
import "firebase/firestore";
import Request from "../../lib/request";
import AsyncStorage from "@react-native-community/async-storage";
import { firebaseConfig } from "../../../firebaseConfig.js";
import { Colors } from "../Colors";
import KinujoWord from "../icons/kinujo.svg";
import BackArrow from "../icons/arrow_back.svg";
import CustomAlert from "../../lib/alert";
const alert = new CustomAlert();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const request = new Request();
const db = firebase.firestore();

const win = Dimensions.get("window");
let userId;
export default function CustomKinujoWord({
  text,
  onFavoritePress,
  onPress,
  onBack,

  onCartCount,
  overrideCartCount,
}) {
  const [cartCount, onCartChanged] = useStateIfMounted(0);
  const ratioKinujo = win.width / 4 / 78;
  const ratioFavorite = win.width / 14 / 24;
  const ratioCart = win.width / 11 / 23;
  const isFocused = useIsFocused();
  const [user, onUserChanged] = useStateIfMounted({});
  const [userAuthorityID, onUserAuthorityIDChanged] = useStateIfMounted(0);
  const [state, setState] = useStateIfMounted(false);
  React.useEffect(() => {
    AsyncStorage.getItem("user").then(function (url) {
      request.get(url).then((response) => {
        onUserChanged(response.data);
        onUserAuthorityIDChanged(response.data.authority.id);

        const subscriber = db
          .collection("users")
          .doc(String(response.data.id))
          .collection("carts")
          .get()
          // .then((querySnapShot) => {
          //   onCartChanged(0);
          //   onCartChanged(querySnapShot.docs.length);
          //   if (onCartCount) {
          //     onCartCount(querySnapShot.docs.length);
          //   }
          // });
          .then((querySnapShot) => {
            let totalItemQty = 0
            querySnapShot.forEach(documentSnapshot => {
              totalItemQty += parseInt(documentSnapshot.data().quantity)
            });
            onCartChanged(0);
            onCartChanged(totalItemQty);
            if (onCartCount) {
              onCartCount(totalItemQty)
            }
          });
      });
    });
  }, [isFocused]);
  React.useEffect(() => {
    if (overrideCartCount >= 0) {
      console.log("overRideCart", overrideCartCount);
      onCartChanged(overrideCartCount);
      // setState(!state);
    }
  }, [overrideCartCount]);

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
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          left: 0,
          alignItems: "center",
          marginLeft: widthPercentageToDP("3%"),
        }}
      >
        <TouchableWithoutFeedback onPress={onBack}>
          <BackArrow style={{ width: RFValue(20), height: RFValue(20) }} />
        </TouchableWithoutFeedback>
        <KinujoWord
          style={{
            width: win.width / 4,
            height: 22 * ratioKinujo,
            marginLeft: widthPercentageToDP("3%"),
          }}
        />
      </View>
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
