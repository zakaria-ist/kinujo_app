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
import SendVerificationCodeButton from "../assets/CustomButtons/SendVerificationCodeButton";
export default function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        style={{ marginLeft: "5%", marginTop: "10%", width: 30, height: 30 }}
        source={require("../assets/Images/back.png")}
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
      <Text style={styles.passwordResetText}>パスワードの再設定</Text>
      <TextInput
        style={styles.registeredPhoneNumber}
        placeholder=" 登録した携帯電話番号を入力してください。"
        placeholderTextColor={Colors.D7CCA6}
      ></TextInput>
      <SendVerificationCodeButton text="認証コード送信"></SendVerificationCodeButton>
      <Text
        style={{ alignSelf: "center", marginTop: "5%", color: Colors.deepGrey }}
      >
        再送信可能まで00s
      </Text>
      <Text
        style={{ alignSelf: "center", marginTop: 5, color: Colors.deepGrey }}
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
          marginTop: "10%",
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
      <SendVerificationCodeButton text="パスワードを変更"></SendVerificationCodeButton>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  passwordResetText: {
    color: Colors.deepGrey,
    fontSize: 18,
    alignSelf: "center",
    marginTop: "15%",
  },
  registeredPhoneNumber: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    padding: 10,
    marginTop: "10%",
    marginHorizontal: 35,
    fontSize: 11,
  },
  verficationCodeInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    padding: 10,
    marginTop: "10%",
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
