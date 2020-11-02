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
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

export default function CustomBlackBackArrow({ onPress, icon }) {
  return (
    <SafeAreaView style={{
      zIndex: 99
    }}>
      <View
        style={{
          width: 50,
          height: 50,
          padding: 10,
          borderRadius: "50%",
          backgroundColor: "#FFF",
          position: "fixed",
          bottom: 70,
          right: 10,
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
        <TouchableWithoutFeedback>
          <Image
            style={{
              width: 30,
              height: 30
            }}
            source={require("../icons/search.svg")}
            resizeMode="contain"
          />
        </TouchableWithoutFeedback>
      </View>
    </SafeAreaView>
  );
}
