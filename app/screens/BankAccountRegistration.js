import React from "react";
import { StyleSheet, SafeAreaView, Text, Image, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import { Colors } from "../assets/Colors";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BankAccountRegisterButton from "../assets/CustomButtons/BankAccountRegisterButton";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import CustomKinujoWord from "../CustomComponents/CustomKinujoWordWithArrow";
export default function BankAccountRegisterButton() {
  const win = Dimensions.get("window");
  const ratio = win.width / 1.6 / 151;
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View>
          <Image
            style={{
              marginLeft: "5%",
              marginTop: "10%",
              width: 20,
              height: 20,
            }}
            source={require("../assets/Images/whiteBackArrow.png")}
          />
          <CustomKinujoWord />
          <Text style={styles.bankAccountRegistrationText}>銀行口座登録</Text>
          <Text
            style={{
              color: "white",
              fontSize: RFValue(14),
              alignSelf: "center",
              marginTop: "10%",
              textAlign: "center",
            }}
          >
            売上金の入金をするには、銀行口座登録が必要です。
          </Text>
          <BankAccountRegisterButton text="今すぐ銀行口座を登録する"></BankAccountRegisterButton>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Text
              style={{
                alignSelf: "center",
                color: Colors.white,
                textAlign: "center",
              }}
            >
              後で登録する
            </Text>
            <Image
              style={{
                marginLeft: 5,
                width: 15,
                height: 15,
                alignSelf: "center",
              }}
              source={require("../assets/Images/whiteNextArrow.png")}
            />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  bankAccountRegistrationText: {
    color: "white",
    textAlign: "center",
    fontSize: RFValue(18),
    alignSelf: "center",
    marginTop: hp("14%"),
  },
});
