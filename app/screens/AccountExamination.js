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
        <Text style={styles.thanksForRegistration}>
          ご登録ありがとうございます！
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
          現在、ご登録いただきましたストアアカウントを 審査しております。
          審査完了までは機能を限定して、ご利用いただけます。
          審査状況につきましては、 アプリ内メッセージにてお問い合わせください。
        </Text>
        <OKButton text="OK"></OKButton>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  thanksForRegistration: {
    color: "white",
    fontSize: 18,
    alignSelf: "center",
    marginTop: "40%",
  },
});
