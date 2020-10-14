import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
  View,
  TouchableWithoutFeedback,
} from "react-native";

import { Colors } from "../assets/Colors";
import SendVerificationCodeButton from "../assets/CustomButtons/SendVerificationCodeButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import CustomKinujoWord from "../CustomComponents/CustomKinujoWordWithArrow";
export default function PasswordReset(props) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <TouchableWithoutFeedback onPress={() => props.navigation.pop()}>
          <Image
            style={{
              marginLeft: "5%",
              marginTop: "10%",
              width: 20,
              height: 20,
            }}
            source={require("../assets/Images/back.png")}
          />
        </TouchableWithoutFeedback>
        <CustomKinujoWord />
        <Text style={styles.passwordResetText}>パスワードの再設定</Text>
        <TextInput
          style={styles.registeredPhoneNumber}
          placeholder=" 登録した携帯電話番号を入力してください。"
          placeholderTextColor={Colors.D7CCA6}
        ></TextInput>
        <SendVerificationCodeButton text="認証コード送信"></SendVerificationCodeButton>
        <Text
          style={{
            alignSelf: "center",
            fontSize: RFValue(14),
            marginTop: heightPercentageToDP("3%"),
            color: Colors.deepGrey,
          }}
        >
          再送信可能まで00s
        </Text>
        <Text
          style={{
            alignSelf: "center",
            fontSize: RFValue(14),
            marginTop: 5,
            color: Colors.deepGrey,
          }}
        >
          認証コードが届かない場合はこちら
        </Text>
        <TextInput
          style={styles.verficationCodeInput}
          placeholder=" 認証コードを入力してください。"
          placeholderTextColor={Colors.D7CCA6}
        ></TextInput>
        <Text
          style={{
            alignSelf: "center",
            marginTop: heightPercentageToDP("3%"),
            color: Colors.deepGrey,
          }}
        >
          新しいパスワード設定
        </Text>
        <TextInput
          style={styles.newPasswordInput}
          placeholder=" 新しいパスワード"
          placeholderTextColor={Colors.D7CCA6}
        ></TextInput>
        <TextInput
          style={styles.newPasswordInput}
          placeholder=" 新しいパスワード（再入力）"
          placeholderTextColor={Colors.D7CCA6}
        ></TextInput>
        <SendVerificationCodeButton
          text="パスワードを変更"
          onPress={() => props.navigation.navigate("PasswordResetCompletion")}
        ></SendVerificationCodeButton>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  passwordResetText: {
    color: Colors.deepGrey,
    fontSize: RFValue(14),
    alignSelf: "center",
    marginTop: heightPercentageToDP("3%"),
  },
  registeredPhoneNumber: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    padding: 10,
    marginTop: heightPercentageToDP("3%"),
    marginHorizontal: 35,
    fontSize: 11,
  },
  verficationCodeInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    padding: 10,
    marginTop: heightPercentageToDP("3%"),
    marginHorizontal: 35,
    fontSize: 11,
  },
  newPasswordInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    padding: 10,
    marginHorizontal: 35,
    fontSize: 11,
  },
});
