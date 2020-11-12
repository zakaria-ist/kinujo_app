import React from "react";
import {
  Image,
  View,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";

export default function CustomWhiteBackArrow({ onPress }) {
  const win = Dimensions.get("window");
  const ratio = win.width / 20 / 20;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View>
        <Image
          style={{
            width: win.width / 20,
            height: 20 * ratio,
            marginTop: heightPercentageToDP("3%"),
            marginLeft: widthPercentageToDP("5%"),
          }}
          source={require("../Images/whiteBackArrow.png")}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
