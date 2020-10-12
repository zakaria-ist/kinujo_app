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
import SMSButton from "../assets/CustomButtons/SMSButton";
import { ScrollView } from "react-native-gesture-handler";
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
        <Text style={styles.SMS認証}>SMS 認証</Text>
        <Text
          style={{
            color: "white",
            fontSize: 14,
            alignSelf: "center",
            marginTop: "10%",
          }}
        >
          08012345678へ認証コードを送信しました。
        </Text>
        <TextInput
          style={styles.verificationCode}
          placeholder="認証コードを入力してください"
          placeholderTextColor="white"
        ></TextInput>
        <SMSButton text="認証する"></SMSButton>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  SMS認証: {
    color: "white",
    fontSize: 22,
    alignSelf: "center",
    marginTop: "40%",
  },
  verificationCode: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    padding: 10,
    marginTop: "20%",
    marginHorizontal: 35,
  },
});
