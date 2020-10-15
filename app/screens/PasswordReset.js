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

import AsyncStorage from '@react-native-community/async-storage';
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { Colors } from "../assets/Colors";
import SendVerificationCodeButton from "../assets/CustomButtons/SendVerificationCodeButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWordWithArrow";
import Translate from "../assets/Translates/Translate";

const request = new Request();
const alert = new CustomAlert();

export default function PasswordReset(props) {
  const [phone, onPhoneChanged] = React.useState("");
  const [code, onCodeChanged] = React.useState("");
  const [password, onPasswordChanged] = React.useState("");
  const [confirm_password, onConfirmPasswordChanged] = React.useState("");

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
        <Text style={styles.passwordResetText}>
          {Translate.t("passwordReset")}
        </Text>
        <TextInput
          style={styles.registeredPhoneNumber}
          placeholder={Translate.t("phoneNumberForPasswordReset")}
          placeholderTextColor={Colors.D7CCA6}
          onChangeText={(text) => onPhoneChanged(text)}
          value={phone}
        ></TextInput>
        <SendVerificationCodeButton
          text={Translate.t("sendVerificatioCode")}
        ></SendVerificationCodeButton>
        <Text
          style={{
            alignSelf: "center",
            fontSize: RFValue(12),
            marginTop: heightPercentageToDP("3%"),
            color: Colors.deepGrey,
            textAlign: "center",
          }}
        >
          {Translate.t("resendVerificationCodeText")}
        </Text>
        <Text
          style={{
            alignSelf: "center",
            fontSize: RFValue(12),
            marginTop: 5,
            color: Colors.deepGrey,
            textAlign: "center",
            borderBottomWidth: 1,
            borderBottomColor: Colors.black,
          }}
        >
          {Translate.t("clickHereIfNoReceiveVerificationCode")}
        </Text>
        <TextInput
          style={styles.verficationCodeInput}
          placeholder={Translate.t("enterVerificationCode")}
          placeholderTextColor={Colors.D7CCA6}
          onChangeText={(text) => onCodeChanged(text)}
          value={code}
        ></TextInput>
        <Text
          style={{
            alignSelf: "center",
            marginTop: heightPercentageToDP("5%"),
            color: Colors.deepGrey,
            fontSize: RFValue(12),
            textAlign: "center",
          }}
        >
          {Translate.t("newPasswordSetting")}
        </Text>
        <TextInput
          style={styles.newPasswordInput}
          placeholder={Translate.t("newPassword")}
          placeholderTextColor={Colors.D7CCA6}
          secureTextEntry={true}
          onChangeText={(text) => onPasswordChanged(text)}
          value={password}
        ></TextInput>
        <TextInput
          style={styles.newPasswordInputReenter}
          placeholder={Translate.t("newPasswordReenter")}
          placeholderTextColor={Colors.D7CCA6}
          secureTextEntry={true}
          onChangeText={(text) => onConfirmPasswordChanged(text)}
          value={confirm_password}
        ></TextInput>
        <SendVerificationCodeButton
          text={Translate.t("changePassword")}
          onPress={() => {
            if (password && confirm_password) {
              if (password == confirm_password) {
                  request
                  .post("password/reset", {
                    tel: phone,
                    password: password,
                    confirm_password: confirm_password
                  })
                  .then(function (response) {
                    response = response.data;

                    if(response.success){
                      onCodeChanged("");
                      onConfirmPasswordChanged("");
                      onPasswordChanged("");
                      onPhoneChanged("");
                      props.navigation.navigate("PasswordResetCompletion");
                    } else {
                      alert.warning(response.error);
                    }
                    console.log();
                  })
                  .catch(function (error) {
                    console.log(error);
                    alert.warning("unknown_error");
                  });
              } else {
                alert.warning("password_mismatch");
              }
            } else {
              alert.warning("must_filled");
            }
          }}
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
    fontSize: RFValue(11),
  },
  verficationCodeInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    padding: 10,
    marginTop: heightPercentageToDP("3%"),
    marginHorizontal: 35,
    fontSize: RFValue(11),
  },
  newPasswordInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    padding: 10,
    marginTop: heightPercentageToDP("3%"),
    marginHorizontal: 35,
    fontSize: RFValue(11),
  },
  newPasswordInputReenter: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    padding: 10,
    marginHorizontal: 35,
    fontSize: RFValue(11),
  },
});
