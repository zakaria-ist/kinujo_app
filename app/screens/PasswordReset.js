import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { Colors } from "../assets/Colors";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWordWithArrow";
import Translate from "../assets/Translates/Translate";

const request = new Request();
const alert = new CustomAlert();

import BlackBackArrow from "../assets/CustomComponents/CustomBlackBackArrow";
export default function PasswordReset(props) {
  const [phone, onPhoneChanged] = React.useState("");
  const [code, onCodeChanged] = React.useState("");
  const [password, onPasswordChanged] = React.useState("");
  const [confirm_password, onConfirmPasswordChanged] = React.useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <BlackBackArrow onPress={() => props.navigation.pop()} />
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
        <TouchableOpacity>
          <View style={styles.sendVerificationCodeButton}>
            <Text style={styles.sendVerificationCodeButtonText}>
              {Translate.t("sendVerificatioCode")}
            </Text>
          </View>
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: "center",
            fontSize: RFValue(10),
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
            fontSize: RFValue(10),
            marginTop: heightPercentageToDP("2%"),
            marginHorizontal: widthPercentageToDP("10%"),
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
        <TouchableOpacity
          onPress={() => {
            if (password && confirm_password) {
              if (password == confirm_password) {
                request
                  .post("password/reset", {
                    tel: phone,
                    password: password,
                    confirm_password: confirm_password,
                  })
                  .then(function (response) {
                    response = response.data;

                    if (response.success) {
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
        >
          <View style={styles.sendVerificationCodeButton}>
            <Text style={styles.sendVerificationCodeButtonText}>
              {Translate.t("changePassword")}
            </Text>
          </View>
        </TouchableOpacity>
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
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    marginTop: heightPercentageToDP("3%"),
    marginHorizontal: widthPercentageToDP("10%"),
    fontSize: RFValue(11),
  },
  verficationCodeInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    marginTop: heightPercentageToDP("3%"),
    marginHorizontal: widthPercentageToDP("10%"),
    fontSize: RFValue(11),
  },
  newPasswordInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    marginTop: heightPercentageToDP("3%"),
    marginHorizontal: widthPercentageToDP("10%"),
    fontSize: RFValue(11),
  },
  newPasswordInputReenter: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    marginHorizontal: widthPercentageToDP("10%"),
    fontSize: RFValue(11),
  },
  sendVerificationCodeButton: {
    borderRadius: 5,
    paddingVertical: 8,
    marginHorizontal: widthPercentageToDP("28%"),
    marginTop: heightPercentageToDP("5%"),
    backgroundColor: Colors.D7CCA6,
  },
  sendVerificationCodeButtonText: {
    color: "white",
    fontSize: RFValue(12),
    textAlign: "center",
  },
});
