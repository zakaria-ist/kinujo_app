import React from "react";
import {
  Image,
  View,
  Dimensions,
  StyleSheet,
  Text,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { SvgUri } from "react-native-svg";
import { RFValue } from "react-native-responsive-fontsize";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import CloseBackLogo from "../icons/close_black.svg";
import ArrowBackLogo from "../icons/arrow_back.svg";
import CartIcon from "../icons/cart.svg";
import FavIcon from "../icons/favorite.svg";
import firebase from "firebase/app";
import "firebase/firestore";
import Request from "../../lib/request";
import AsyncStorage from "@react-native-community/async-storage";
import { useIsFocused } from "@react-navigation/native";
import KinujoWord from "../icons/kinujo.svg";
import { firebaseConfig } from "../../../firebaseConfig.js";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const request = new Request();
const db = firebase.firestore();

const win = Dimensions.get("window");
let userId;
export default function CustomKinujoWord({
  onBack,
  onClose,
  text,
  onPress,
  onFavoriteChanged,
  onFavoritePress,
  overrideCartCount,
  onCartCount,
}) {
  const [cartCount, onCartChanged] = React.useState(0);
  const ratioKinujo = win.width / 5 / 78;
  const ratioFavorite = win.width / 14 / 24;
  const ratioCart = win.width / 11 / 23;
  const isFocused = useIsFocused();
  const ratioBackArrow = win.width / 18 / 20;
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
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          left: 0,
          alignItems: "center",
        }}
      >
        <TouchableWithoutFeedback onPress={onBack}>
          <ArrowBackLogo
            style={{
              marginLeft: widthPercentageToDP("5%"),
            }}
            width={win.width / 18}
            height={20 * ratioBackArrow}
          />
        </TouchableWithoutFeedback>
        {/* <Image
          style={{
            width: win.width / 5,
            height: 22 * ratioKinujo,
            marginLeft: widthPercentageToDP("3%"),
          }}
          source={require("../Images/headerKinujo.png")}
        /> */}
        <KinujoWord
          style={{
            width: win.width / 4,
            height: 22 * ratioKinujo,
            marginLeft: widthPercentageToDP("2%"),
          }}
        />
      </View>

      <Text
        style={{
          fontSize: RFValue(11),
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
              <CartIcon
                style={{
                  width: win.width / 11,
                  height: 21 * ratioCart,
                  marginRight: widthPercentageToDP("5%"),
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        )}

        {onFavoriteChanged == null ? (
          <TouchableWithoutFeedback onPress={onFavoritePress}>
            <FavIcon
              style={{
                width: win.width / 11,
                height: 21 * ratioCart,
                marginRight: widthPercentageToDP("3%"),
              }}
            />
          </TouchableWithoutFeedback>
        ) : null}
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
