import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
  View,
} from "react-native";
import OKButtonInYellow from "../assets/CustomButtons/OKButtonInYellow";
import CustomKinujoWord from "../CustomComponents/CustomKinujoWord";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
export default function PasswordResetCompletion(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <CustomKinujoWord />
        <Text style={styles.passwordChangeCompleteText}>
          パスワードを変更しました。
        </Text>
        <Text
          style={{
            color: "black",
            fontSize: RFValue(14),
            alignSelf: "center",
            marginTop: heightPercentageToDP("3%"),
            textAlign: "center",
            paddingHorizontal: widthPercentageToDP("10%"),
          }}
        >
          ログイン画面よりログインしてください。
        </Text>
        <OKButtonInYellow
          text="OK"
          onPress={() => props.navigation.popToTop()}
        ></OKButtonInYellow>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  passwordChangeCompleteText: {
    color: "black",
    fontSize: RFValue(22),
    alignSelf: "center",
    marginTop: heightPercentageToDP("15%"),
    textAlign: "center",
  },
});
