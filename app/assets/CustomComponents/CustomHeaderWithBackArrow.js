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

export default function CustomKinujoWord({
  onBack,
  onClose,
  text,
  onPress,
  onFavoriteChanged,
  onFavoritePress,
}) {
  const win = Dimensions.get("window");
  const ratioKinujo = win.width / 5 / 78;
  const ratioFavorite = win.width / 14 / 24;
  const ratioCart = win.width / 14 / 23;
  const ratioBackArrow = win.width / 18 / 20;
  return (
    <SafeAreaView
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: heightPercentageToDP("7%"),
        justifyContent: "space-evenly",
      }}
    >
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
        <Image
          style={{
            width: win.width / 5,
            height: 22 * ratioKinujo,
            marginLeft: widthPercentageToDP("3%"),
          }}
          source={require("../Images/headerKinujo.png")}
        />
      </View>

      <Text
        style={{
          justifyContent: "center",
          alignSelf: "center",
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
        <TouchableWithoutFeedback onPress={onPress}>
          <CartIcon
            style={{
              width: win.width / 14,
              height: 21 * ratioCart,
              marginRight: widthPercentageToDP("5%"),
            }}
          />
        </TouchableWithoutFeedback>

        {onFavoriteChanged == null ? (
          <TouchableWithoutFeedback onPress={onFavoritePress}>
            <FavIcon
              style={{
                width: win.width / 14,
                height: 21 * ratioFavorite,
                marginRight: widthPercentageToDP("3%"),
              }}
            />
          </TouchableWithoutFeedback>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({});
{
  /* <Image
style={{
  width: win.width / 14,
  height: 21 * ratioFavorite,
  marginRight: widthPercentageToDP("3%"),
}}
source={require("../Images/headerFavorite.png")}
/> */
}
