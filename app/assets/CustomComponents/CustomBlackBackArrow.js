import React from "react";
import { Image, View, TouchableWithoutFeedback } from "react-native";
import { Dimensions } from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
export default function CustomBlackBackArrow({ onPress }) {
  const win = Dimensions.get("window");
  const ratio = win.width / 20 / 20;
  return (
    <View>
      <TouchableWithoutFeedback onPress={onPress}>
        <Image
          style={{
            width: win.width / 20,
            height: 20 * ratio,
            marginTop: heightPercentageToDP("3%"),
            marginLeft: widthPercentageToDP("5%"),
          }}
          source={require("../Images/blackBackArrow.png")}
        />
      </TouchableWithoutFeedback>
    </View>
  );
}
