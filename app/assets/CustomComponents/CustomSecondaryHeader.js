import React from "react";
import {
  Image,
  View,
  Dimensions,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "../Colors";
import Translate from "../Translates/Translate";
import PersonIcon from "../icons/person.svg";
export default function CustomKinujoWord({
  onPress,
  name,
  accountType,
  editProfile,
}) {
  const win = Dimensions.get("window");
  const ratioNext = win.width / 38 / 8;
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <SafeAreaView
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.F0EEE9,
          height: heightPercentageToDP("10%"),
        }}
      >
        <PersonIcon
          style={{
            borderRadius: win.width / 2,
            marginLeft: widthPercentageToDP("8%"),
          }}
          width={RFValue(40)}
          height={RFValue(40)}
        />

        <View style={{ marginLeft: widthPercentageToDP("3%") }}>
          <Text
            style={{
              fontSize: RFValue(12),
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: RFValue(12),
            }}
          >
            {accountType}
          </Text>

          {editProfile == "editProfile" ? (
            <Text
              style={{
                fontSize: RFValue(12),
              }}
            >
              {Translate.t("profileEdit")}
            </Text>
          ) : null}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({});
