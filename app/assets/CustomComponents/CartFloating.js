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
  PixelRatio,
  TouchableWithoutFeedback,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const win = Dimensions.get("window");
import CartIcon from "../icons/cart.svg";

export default function CustomBlackBackArrow({ onPress, icon }) {
  const insets = useSafeAreaInsets();
  return (
    <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={{
            width: 50,
            height: 50,
            padding: 10,
            borderRadius: win.width / 2,
            backgroundColor: "#FFF",
            position: "absolute",
            bottom: insets.bottom + insets.top + 15,
            right: 20,
            shadowColor: "#000",
            shadowOffset: {
              width: 1,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
            <CartIcon
              style={{
                width: 30,
                height: 30,
              }}
              source={require("../icons/search.svg")}
              resizeMode="contain"
            />
        </View>
    </TouchableWithoutFeedback>
  );
}
