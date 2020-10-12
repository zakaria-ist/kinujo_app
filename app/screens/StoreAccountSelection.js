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
        <Text style={styles.storeAccountSelectionText}>
          ストアアカウントの選択
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 12,
            alignSelf: "center",
            marginTop: "10%",
          }}
        >
          ご希望のストアアカウントを選択してください。
        </Text>
        <SalonShopButton text="サロン・ショップとして登録"></SalonShopButton>
        <HairDresserButton text="理美容師として登録"></HairDresserButton>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  storeAccountSelectionText: {
    color: "white",
    fontSize: 18,
    alignSelf: "center",
    marginTop: "40%",
  },
});
