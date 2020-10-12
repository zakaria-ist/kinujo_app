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
import OKButton from "../assets/CustomButtons/OKButton";
import OKButtonInYellow from "../assets/CustomButtons/OKButtonInYellow";
export default function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        style={{
          width: "60%",
          height: "5%",
          marginTop: "35%",
          alignSelf: "center",
        }}
        source={require("../assets/Images/kinujo.png")}
      />
      <Text style={styles.passwordChangeCompleteText}>
        パスワードを変更しました。
      </Text>
      <Text
        style={{
          color: "black",
          fontSize: 12,
          alignSelf: "center",
          marginTop: "10%",
          textAlign: "center",
          paddingHorizontal: "10%",
        }}
      >
        ログイン画面よりログインしてください。
      </Text>
      <OKButtonInYellow text="OK"></OKButtonInYellow>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  passwordChangeCompleteText: {
    color: "black",
    fontSize: 18,
    alignSelf: "center",
    marginTop: "40%",
  },
});
