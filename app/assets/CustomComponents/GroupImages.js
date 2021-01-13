import React, { useState } from "react";
import {
  Text,
  Image,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
const win = Dimensions.get("window");
export default function GroupImages({ props, width, height, images }) {
  const isFocused = useIsFocused();
  const [countryCode, setCountryCode] = React.useState("");
  const [imageHtml, setImageHtml] = React.useState(<View></View>);
  React.useEffect(() => {
    let tmpHtml = [];
    if (images) {
      images.map((image) => {
        if (tmpHtml.length <= 9) {
          if (image) {
            tmpHtml.push(
              <Image
                style={{
                  // width: images.length % 2 == 0 ? width / 2 : width / 3,
                  // height:
                  //   images.length % 2 == 0
                  //     ? height / images.length / 2
                  //     : height / images.length / 3,
                  width: images.length == 1 ? RFValue(30) : RFValue(15),
                  height: images.length == 1 ? RFValue(30) : RFValue(15),
                  marginLeft: 0,
                  borderRadius: images.length == 1 ? win.width / 2 : 0,
                  margin: 2,
                }}
                source={{ uri: image }}
              />
            );
          } else {
            tmpHtml.push(
              <Image
                style={{
                  // width: images.length % 2 == 0 ? width / 2 : width / 3,
                  // height:
                  //   images.length % 2 == 0
                  //     ? height / images.length / 2
                  //     : height / images.length / 3,
                  width: images.length == 1 ? RFValue(30) : RFValue(15),
                  height: images.length == 1 ? RFValue(30) : RFValue(15),
                  marginLeft: 0,
                  borderRadius: images.length == 1 ? win.width / 2 : 0,
                  margin: 2,
                }}
                source={require("../Images/profileEditingIconLarge.png")}
              />
            );
          }
        }
      });
    }
    setImageHtml(tmpHtml);
  }, [images]);

  return (
    <TouchableWithoutFeedback
    // onPress={() => {
    //   if (onNavigate) {
    //     onNavigate();
    //   }
    //   props.navigation.navigate("CountrySearch");
    // }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: RFValue(50),
          height: RFValue(50),
          flexWrap: "wrap",
          flexDirection: "row",
          paddingVertical: heightPercentageToDP("1%"),
          backgroundColor: "#B3B3B3"
          // alignSelf: "center",
        }}
      >
        {imageHtml}
      </View>
    </TouchableWithoutFeedback>
  );
}
