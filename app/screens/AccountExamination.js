import React from "react";
import { StyleSheet, Text, Image, View } from "react-native";
import { Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "../assets/Colors";
import OKButton from "../assets/CustomButtons/OKButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import CustomKinujoWord from "../CustomComponents/CustomKinujoWord";
export default function AccountExamination() {
  const win = Dimensions.get("window");
  const ratio = win.width / 1.6 / 151;
  return (
    <LinearGradient
      colors={[Colors.E4DBC0, Colors.C2A059]}
      start={[0, 0]}
      end={[1, 0.6]}
      style={{ flex: 1 }}
    >
      <CustomKinujoWord />
      <View>
        <Text style={styles.thanksForRegistration}>
          ご登録ありがとうございます！
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: RFValue(12),
            alignSelf: "center",
            textAlign: "center",
            paddingHorizontal: "10%",
            marginTop: 10,
          }}
        >
          現在、ご登録いただきましたストアアカウントを 審査しております。
          審査完了までは機能を限定して、ご利用いただけます。
          審査状況につきましては、 アプリ内メッセージにてお問い合わせください。
        </Text>
        <OKButton text="OK"></OKButton>
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  thanksForRegistration: {
    color: "white",
    fontSize: RFValue(16),
    alignSelf: "center",
    marginTop: hp("14%"),
  },
});
