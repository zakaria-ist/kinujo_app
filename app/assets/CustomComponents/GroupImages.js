import React, { useState } from "react";
import {
  Text,
  Image,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import AsyncStorage from "@react-native-community/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import CachedImage from 'react-native-expo-cached-image';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
const win = Dimensions.get("window");

function getHeight(height, size){
  if(size >= 7) return (height)/3;
  if(size >= 5) return (height)/2;
  if(size >= 2) return (height)/2;
  return height;
}

function getWidth(width, size){
  if(size >= 5) return (width)/3;
  if(size >= 2) return (width)/2;
  return width;
}

export default function GroupImages({ props, style, width, height, images }) {
  const isFocused = useIsFocused();
  const [countryCode, setCountryCode] = useStateIfMounted("");
  const [imageHtml, setImageHtml] = useStateIfMounted(<View></View>);
  React.useEffect(() => {
    let tmpHtml = [];
    if (images) {
      images.map((image) => {
        if (tmpHtml.length < 9) {
          if (image) {
            tmpHtml.push(
              <View style={{
                width: getWidth(width, images.length),
                height: getWidth(width, images.length),
                padding: getWidth(width, images.length) * 0.1,
              }}>
                <CachedImage
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: images.length == 1 ? win.width / 2 : 0,
                    resizeMode: images.length == 1 ? "cover" : 'contain',
                  }}
                  source={{ uri: image }}
                />
              </View>
            );
          } else {
            tmpHtml.push(
              <View style={{
                width: getWidth(width, images.length),
                height: getWidth(width, images.length),
                padding: getWidth(width, images.length) * 0.1,
              }}>
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: images.length == 1 ? win.width / 2 : 0,
                    resizeMode: 'contain',
                  }}
                  source={require("../Images/profileEditingIconLarge.png")}
                />
              </View>
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
          width: width,
          height: height,
          flexWrap: "wrap",
          flexDirection: "row",
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
