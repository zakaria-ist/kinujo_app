import React, { useState } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
// import { useStateIfMounted } from "use-state-if-mounted";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../Colors.js";
// const { width } = Dimensions.get("window");
// const { height } = Dimensions.get("window");
// const win = Dimensions.get("window");

export default function ProductCreateButton({ onPress, icon }) {
  const insets = useSafeAreaInsets();
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          height: heightPercentageToDP("5%"),
          width: widthPercentageToDP("80%"),
          backgroundColor: Colors.D7CCA6,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          bottom: insets.bottom + insets.top + 20,
          right: widthPercentageToDP("10%"),
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
        <Text style={{ fontSize: RFValue(12), color: "white" }}>
          + {Translate.t("productCreate")}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
