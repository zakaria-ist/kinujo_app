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

function getHeight(height, size){
  if(size == 1) return height;
  if(size <= 2) return 20;
  if(size <= 4) return 15;
  return 10;
}

function getWidth(width, size){
  if(size == 1) return width;
  if(size <= 2) return 20;
  if(size <= 4) return 15;
  return 10;
}

export default function GroupImages({ props, style, width, height, images }) {
  const isFocused = useIsFocused();
  const [countryCode, setCountryCode] = React.useState("");
  const [imageHtml, setImageHtml] = React.useState(<View></View>);
  React.useEffect(() => {
    let tmpHtml = [];
    if (images) {
      images.map((image) => {
        if (tmpHtml.length < 9) {
          if (image) {
            tmpHtml.push(
              <Image
                style={{
                  // width: images.length % 2 == 0 ? width / 2 : width / 3,
                  // height:
                  //   images.length % 2 == 0
                  //     ? height / images.length / 2
                  //     : height / images.length / 3,
                  width: getWidth(width, images.length),
                  height: getHeight(height, images.length),
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
                  width: getWidth(width, images.length),
                  height: getHeight(height, images.length),
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

    if(!isFocused){
      setImageHtml(<Image
        style={{
          // width: images.length % 2 == 0 ? width / 2 : width / 3,
          // height:
          //   images.length % 2 == 0
          //     ? height / images.length / 2
          //     : height / images.length / 3,
          width: getWidth(width, images ? images.length : 0),
          height: getHeight(height, images ? images.length: 0),
          marginLeft: 0,
          borderRadius: win.width / 2,
          margin: 2,
        }}
        source={require("../Images/profileEditingIconLarge.png")}
      />);
    }
  }, [isFocused, images]);

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
        style={ style ? style : {
          alignItems: "center",
          justifyContent: "center",
          width: RFValue(50),
          height: RFValue(50),
          flexWrap: "wrap",
          flexDirection: "row",
          paddingVertical: heightPercentageToDP("1%"),
          borderRadius: images && images.length > 0 ? 5: 0,
          backgroundColor: (images && images.length > 1) ? "#B3B3B3" : "transparent"
          // alignSelf: "center",
        }}
      >
        {imageHtml}
      </View>
    </TouchableWithoutFeedback>
  );
}
