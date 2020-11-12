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
import { RFValue } from "react-native-responsive-fontsize";
import CartLogo from "../icons/cart.svg";
import FavouriteLogo from "../icons/favorite.svg";

export default function CustomKinujoWord({ text, onFavoritePress, onPress }) {
  const win = Dimensions.get("window");
  const ratioKinujo = win.width / 4 / 78;
  const ratioFavorite = win.width / 14 / 24;
  const ratioCart = win.width / 14 / 23;

  return (
    <SafeAreaView
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: heightPercentageToDP("10%"),
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
          justifyContent: "center",
          alignSelf: "center",
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
        <TouchableWithoutFeedback onPress={onPress}>
          <CartLogo
            style={{
              marginRight: widthPercentageToDP("5%"),
            }}
            width={win.width / 14}
            height={21 * ratioCart}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onFavoritePress}>
          <FavouriteLogo
            style={{
              marginRight: widthPercentageToDP("5%"),
            }}
            width={win.width / 14}
            height={21 * ratioCart}
          />
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({});
