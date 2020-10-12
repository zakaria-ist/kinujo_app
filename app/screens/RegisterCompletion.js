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
import OKButton from "../assets/CustomButtons/OKButton";
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
          style={{
            width: "60%",
            height: "5%",
            marginTop: "35%",
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
            textAlign: "center",
            paddingHorizontal: "10%",
          }}
        >
          ご登録が完了いたしました。
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 12,
            alignSelf: "center",
            marginTop: 8,
            textAlign: "center",
            paddingHorizontal: "10%",
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
    fontSize: 18,
    alignSelf: "center",
    marginTop: "40%",
  },
});
