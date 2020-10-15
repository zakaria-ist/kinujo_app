import React from "react";
import { StyleSheet, SafeAreaView, Text, View } from "react-native";
import OKButtonInYellow from "../assets/CustomButtons/OKButtonInYellow";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
export default function PasswordResetCompletion(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <CustomKinujoWord />
        <Text style={styles.passwordChangeCompleteText}>
          {Translate.t("passwordChanged")}
        </Text>
        <Text
          style={{
            color: "black",
            fontSize: RFValue(18),
            alignSelf: "center",
            marginTop: heightPercentageToDP("5%"),
            textAlign: "center",
            paddingHorizontal: widthPercentageToDP("3%"),
          }}
        >
          {Translate.t("pleaseLoginFromLoginScreen")}
        </Text>
        <OKButtonInYellow
          text="OK"
          onPress={() => props.navigation.popToTop()}
        ></OKButtonInYellow>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  passwordChangeCompleteText: {
    color: "black",
    fontSize: RFValue(26),
    alignSelf: "center",
    marginTop: heightPercentageToDP("20%"),
    textAlign: "center",
  },
});
