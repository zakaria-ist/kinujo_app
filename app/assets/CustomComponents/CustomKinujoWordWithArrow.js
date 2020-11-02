import React from "react";
import { Image, View } from "react-native";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from "react-native-responsive-screen";
export default function CustomKinujoWord() {
  const win = Dimensions.get("window");
  const ratio = win.width / 1.6 / 151;
  return (
    <View>
      <Image
        style={{
          width: win.width / 1.6,
          height: 44 * ratio,
          alignSelf: "center",
        }}
        source={require("../Images/kinujo.png")}
      />
    </View>
  );
}
