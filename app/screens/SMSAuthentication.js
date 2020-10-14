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
import CustomKinujoWord from "../CustomComponents/CustomKinujoWord";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
export default function SMSAuthentication(props) {
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CustomKinujoWord />
        <Text style={styles.SMS認証}>SMS 認証</Text>
        <Text
          style={{
            color: "white",
            fontSize: RFValue(16),
            alignSelf: "center",
            marginTop: heightPercentageToDP("3%"),
            textAlign: "center",
          }}
        >
          08012345678へ認証コードを送信しました。
        </Text>
        <TextInput
          style={styles.verificationCode}
          placeholder="認証コードを入力してください"
          placeholderTextColor="white"
        ></TextInput>
        <SMSButton
          text="認証する"
          onPress={() => props.navigation.navigate("AccountExamination")}
        ></SMSButton>
      </SafeAreaView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  SMS認証: {
    color: "white",
    fontSize: RFValue(22),
    alignSelf: "center",
    marginTop: heightPercentageToDP("10%"),
  },
  verificationCode: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    padding: 10,
    fontSize: RFValue(14),
    marginTop: heightPercentageToDP("8%"),
    marginHorizontal: 35,
  },
});
