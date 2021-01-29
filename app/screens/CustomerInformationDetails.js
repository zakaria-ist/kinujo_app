import React, { useState } from "react";
import { InteractionManager } from 'react-native';
import { StyleSheet, Text, Image, View, Dimensions, SafeAreaView } from "react-native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
const win = Dimensions.get("window");
const ratioDownForMore = win.width / 26 / 9;
const ratioNext = win.width / 38 / 8;

export default function CustomerInformationDetails(props) {
  return (
    <SafeAreaView>
      <CustomHeader
        onBack={() => {
          props.navigation.goBack();
        }}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("setting")}
      />
      <CustomSecondaryHeader
        name="髪長絹子 さん"
        accountType={Translate.t("storeAccount")}
      />
      <View style={{ marginTop: heightPercentageToDP("3%") }}>
        <View style={styles.customerInformationContainer}>
          <Text style={styles.customerInformationTitle}>氏名・住所情報</Text>
          <Image
            style={styles.nextIcon}
            source={require("../assets/Images/next.png")}
          />
        </View>
        <View style={styles.customerInformationContainer}>
          <Text style={styles.customerInformationTitle}>送付先アドレス帳</Text>
          <Image
            style={styles.nextIcon}
            source={require("../assets/Images/next.png")}
          />
        </View>
        <View style={styles.customerInformationContainer}>
          <Text style={styles.customerInformationTitle}>
            メールアドレス情報
          </Text>
          <Image
            style={styles.nextIcon}
            source={require("../assets/Images/next.png")}
          />
        </View>
        <View style={styles.customerInformationContainer}>
          <Text style={styles.customerInformationTitle}>電話番号情報</Text>
          <Image
            style={styles.nextIcon}
            source={require("../assets/Images/next.png")}
          />
        </View>
        <View style={styles.customerInformationContainer}>
          <Text style={styles.customerInformationTitle}>ログアウトする</Text>
          <Image
            style={styles.nextIcon}
            source={require("../assets/Images/next.png")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  customerInformationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightPercentageToDP("2%"),
    marginHorizontal: widthPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.F0EEE9,
    paddingBottom: heightPercentageToDP("2%"),
  },
  customerInformationTitle: {
    fontSize: RFValue(12),
  },
  nextIcon: {
    width: win.width / 38,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
  },
});
