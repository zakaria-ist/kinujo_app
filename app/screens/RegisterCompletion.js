import React from "react";
import { StyleSheet, SafeAreaView, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import OKButton from "../assets/CustomButtons/OKButton";
import CustomKinujoWord from "../CustomComponents/CustomKinujoWord";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
export default function RegisterCompletion() {
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CustomKinujoWord />
        <Text style={styles.bankAccountRegistrationText}>
          ご登録ありがとうございます！
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: RFValue(14),
            alignSelf: "center",
            marginTop: heightPercentageToDP("5%"),
            textAlign: "center",
            paddingHorizontal: widthPercentageToDP("10%"),
          }}
        >
          ご登録が完了いたしました。
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: RFValue(14),
            alignSelf: "center",
            marginTop: 8,
            textAlign: "center",
            paddingHorizontal: widthPercentageToDP("10%"),
          }}
        >
          KINUJOアプリをお楽しみください。
        </Text>
        <OKButton text="OK"></OKButton>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  bankAccountRegistrationText: {
    color: "white",
    fontSize: RFValue(22),
    alignSelf: "center",
    textAlign: "center",
    marginTop: heightPercentageToDP("12%"),
  },
});
