import React from "react";
import { Image, View } from "react-native";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
export default function CustomKinujoWord() {
  const win = Dimensions.get("window");
  const ratio = win.width / 1.6 / 151;
  return (
    <View style={{ flex: 1 }}>
      <Image
        style={{
          width: win.width / 1.6,
          height: 44 * ratio,
          top: 0,
          alignSelf: "center",
        }}
        source={require("../assets/Images/kinujo.png")}
      />
    </View>
  );
}
