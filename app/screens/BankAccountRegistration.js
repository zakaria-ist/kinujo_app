import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import SalonShopButton from "../assets/CustomButtons/SalonShopButton";
import HairDresserButton from "../assets/CustomButtons/HairDresserButton";
import ButtonInBlack from "../assets/CustomButtons/ButtonInBlack";
import BankAccountRegisterButton from "../assets/CustomButtons/BankAccountRegisterButton";
export default function LoginScreen() {
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Image
          style={{ marginLeft: "5%", marginTop: "10%", width: 30, height: 30 }}
          source={require("../assets/Images/whiteBackArrow.png")}
        />
        <Image
          style={{
            width: "60%",
            height: "5%",
            marginTop: "10%",
            alignSelf: "center",
          }}
          source={require("../assets/Images/kinujo.png")}
        />
        <Text style={styles.bankAccountRegistrationText}>銀行口座登録</Text>
        <Text
          style={{
            color: "white",
            fontSize: 12,
            alignSelf: "center",
            marginTop: "10%",
          }}
        >
          売上金の入金をするには、銀行口座登録が必要です。
        </Text>
        <BankAccountRegisterButton text="今すぐ銀行口座を登録する"></BankAccountRegisterButton>
        <Text
          style={{
            alignSelf: "center",
            color: Colors.white,
            marginTop: "8%",
          }}
        >
          後で登録する
          <Image source={require("../assets/Images/whiteNextArrow.png")} />
        </Text>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  bankAccountRegistrationText: {
    color: "white",
    fontSize: 18,
    alignSelf: "center",
    marginTop: "40%",
  },
});
