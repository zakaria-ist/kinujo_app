import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import { TextInput } from "react-native-paper";
const win = Dimensions.get("window");
const ratioCancelIcon = win.width / 20 / 15;
export default function MemoEdit(props) {
  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        opacity: 0.3,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginHorizontal: widthPercentageToDP("3%"),
          marginTop: heightPercentageToDP("3%"),
          height: heightPercentageToDP("5%"),
        }}
      >
        <Image
          style={{ width: win.width / 20, height: 15 * ratioCancelIcon }}
          source={require("../assets/Images/cancelIcon.png")}
        />
        <Text
          style={{
            fontSize: RFValue(15),
            color: "white",
            alignSelf: "flex-end",
          }}
        >
          0/500
        </Text>
        <TouchableWithoutFeedback>
          <Text style={{ fontSize: RFValue(17), color: "white" }}>保存</Text>
        </TouchableWithoutFeedback>
      </View>
      <View>
        <TextInput
          placeholder="入力してください"
          placeholderTextColor="white"
          backgroundColor="white"
          maxLength={255}
          style={{
            fontSize: RFValue(25),
            color: "white",
            alignSelf: "center",
            width:widthPercentageToDP("80%"),
            height:heightPercentageToDP("80%"),
            marginLeft: widthPercentageToDP("2%"),
            marginTop: heightPercentageToDP("5%"),
          }}
        ></TextInput>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({});
