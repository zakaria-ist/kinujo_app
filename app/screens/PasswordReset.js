import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  ScrollView,
  Linking
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import DropDownPicker from "react-native-dropdown-picker";
import CountrySearch from "../assets/CustomComponents/CountrySearch";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { Colors } from "../assets/Colors";
import Spinner from "react-native-loading-spinner-overlay";
import Kinujo from "../assets/icons/kinujo.svg";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWordWithArrow";
import Translate from "../assets/Translates/Translate";
import auth from "@react-native-firebase/auth";
import CountryPicker from "react-native-country-picker-modal";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioKinujo = win.width / 1.6 / 151;
import BlackBackArrow from "../assets/CustomComponents/CustomBlackBackArrow";
import { call } from "react-native-reanimated";
import i18n from "i18n-js";
export default function PasswordReset(props) {
  const [phone, onPhoneChanged] = useStateIfMounted("");
  const [code, onCodeChanged] = useStateIfMounted("");
  const [password, onPasswordChanged] = useStateIfMounted("");
  const [confirm_password, onConfirmPasswordChanged] = useStateIfMounted("");
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  const [confirm, setConfirm] = useStateIfMounted(null);
  const [verficaitonButtonClicked, onVerficaitonButtonClicked] = useStateIfMounted(
    false
  );
  const [callingCode, onCallingCodeChanged] = useStateIfMounted("");
  const [flag, onFlagChanged] = useStateIfMounted("");
  const [triggerTimer, onTriggerTimer] = useStateIfMounted(false);
  const [timer, setTimer] = useStateIfMounted(30);
  const [showResend, onResendShow] = useStateIfMounted(false);
  const [resend, triggerResend] = useStateIfMounted(false);
  const [countryCodeHtml, onCountryCodeHtmlChanged] = useStateIfMounted([]);
  const [loaded, onLoaded] = useStateIfMounted(false);
  if (!loaded) {
    request.get("country_codes/").then(function (response) {
      let tmpCountry = response.data.map((country) => {
        return {
          id: country.tel_code,
          name: country.tel_code,
        };
      });
      onCountryCodeHtmlChanged(tmpCountry);
    });
    onLoaded(true);
  }
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (triggerTimer == true && timer > 0) {
        setTimeout(() => setTimer(timer - 1), 1000);
        onResendShow(true);
      } else if (timer == 0) {
        triggerResend(true);
        onVerficaitonButtonClicked(false);
      }
    });
  });

  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await auth().verifyPhoneNumber(phoneNumber);
    setConfirm(confirmation);
  }

  function processCountryCode(val) {
    let tmpItem = val.split("+");
    // alert.warning(tmpItem[1]);
    onCallingCodeChanged(tmpItem[1]);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Spinner
        visible={spinner}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled={true}
      >
        <View>
          <BlackBackArrow onPress={() => props.navigation.goBack()} />
          {/* <Image
            style={{
              width: win.width / 1.6,
              height: 44 * ratioKinujo,
              alignSelf: "center",
              marginTop: heightPercentageToDP("6%"),
            }}
            source={require("../assets/Images/kinujo.png")}
          /> */}
          <Kinujo
            style={{
              width: win.width / 1.6,
              height: 44 * ratioKinujo,
              alignSelf: "center",
              marginTop: heightPercentageToDP("6%"),
            }}
          />
          <Text style={styles.passwordResetText}>
            {Translate.t("passwordReset")}
          </Text>
          <View style={{ marginHorizontal: widthPercentageToDP("7%") }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: heightPercentageToDP("2%"),
              }}
            >
              
              <CountrySearch props={props} onCountryChanged={(val)=>{
                    if(val){
                      processCountryCode(val);
                    }
                  }}></CountrySearch>
              {/* <DropDownPicker
                // controller={(instance) => (controller = instance)}
                style={styles.textInput}
                items={countryCodeHtml ? countryCodeHtml : []}
                // defaultValue={countryCodeHtml ? countryCodeHtml : ""}
                containerStyle={{ height: heightPercentageToDP("5.5%") }}
                labelStyle={{
                  fontSize: RFValue(10),
                  color: Colors.D7CCA6,
                }}
                itemStyle={{
                  justifyContent: "flex-start",
                }}
                selectedtLabelStyle={{
                  color: Colors.D7CCA6,
                }}
                placeholder={"+"}
                dropDownStyle={{ backgroundColor: "#000000" }}
                onChangeItem={(item) => {
                  if (item) {
                    processCountryCode(item.value);
                  }
                }}
              /> */}
              <TextInput
                style={styles.registeredPhoneNumber}
                placeholder={Translate.t("phoneNumberForPasswordReset")}
                placeholderTextColor={Colors.D7CCA6}
                onChangeText={(text) => onPhoneChanged(String(text).replace(/[^0-9]/g, ""))}
                value={phone}
              ></TextInput>
            </View>
          </View>
          <TouchableWithoutFeedback
            disabled={verficaitonButtonClicked ? true : false}
            onPress={() => {
              if (phone != "") {
                console.log(callingCode, phone)
                request.post("user/check-phone", {
                  tel: phone,
                  tel_code: "+" + callingCode,
                }).then(function(response) {
                  if (!response.data.success) {
                    onVerficaitonButtonClicked(true);
                    setTimer(30);
                    signInWithPhoneNumber("+" + callingCode + phone)
                      .then(() => {})
                      .catch((error) => {
                        alert.warning(error.code);
                      });
                    onTriggerTimer(true);
                  } else {
                    alert.warning(Translate.t("unregisteredPhone"));
                  }
                })
              } else {
                alert.warning(Translate.t("fieldNotFilled"));
              }
            }}
          >
            <View style={styles.sendVerificationCodeButton}>
              <Text style={styles.sendVerificationCodeButtonText}>
                {resend == true ? Translate.t("reSendVerificatioCode") : Translate.t("sendVerificatioCode")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {showResend == true ? (
            <Text
              style={{
                alignSelf: "center",
                fontSize: RFValue(10),
                marginTop: heightPercentageToDP("3%"),
                color: Colors.deepGrey,
                textAlign: "center",
              }}
            >
              {i18n.locale.includes('ja') || i18n.locale.includes('JP')
                            ? Translate.t("resendVerificationCodeText") + timer + "s"
                            : timer + "s " + Translate.t("resendVerificationCodeText")}
            </Text>
          ) : (
            <View></View>
          )}
          {resend == true ? (
            <TouchableWithoutFeedback
              disabled={timer == 0 ? false : true}
              onPress={() => {
                Linking.openURL('mailto:info@kinujo.jp');
                // if(timer == 0){
                //   if (phone != "") {
                //     setTimer(30);
                //     signInWithPhoneNumber("+" + callingCode + phone);
                //   } else {
                //     alert.warning(Translate.t("fieldNotFilled"));
                //   }
                // }
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: RFValue(10),
                  marginTop: heightPercentageToDP("2%"),
                  marginHorizontal: widthPercentageToDP("10%"),
                  color: Colors.deepGrey,
                  textAlign: "center",
                  textDecorationLine: "underline",
                  borderBottomColor: Colors.black,
                }}
              >
                {Translate.t("clickHereIfNoReceiveVerificationCode")}
              </Text>
            </TouchableWithoutFeedback>
          ) : (
            <View></View>
          )}
          <TextInput
            style={styles.verficationCodeInput}
            placeholder={Translate.t("enterVerificationCode")}
            placeholderTextColor={Colors.D7CCA6}
            onChangeText={(text) => onCodeChanged(String(text).replace(/[^0-9]/g, ""))}
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
            textContentType="password"
            onChangeText={(text) => onPasswordChanged(text)}
            value={password}
          ></TextInput>
          <TextInput
            style={styles.newPasswordInputReenter}
            placeholder={Translate.t("newPasswordReenter")}
            placeholderTextColor={Colors.D7CCA6}
            secureTextEntry={true}
            textContentType="password"
            onChangeText={(text) => onConfirmPasswordChanged(text)}
            value={confirm_password}
          ></TextInput>
          <View style={{ paddingBottom: heightPercentageToDP("5%") }}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (confirm && code) {
                  const credential = auth.PhoneAuthProvider.credential(
                    confirm.verificationId,
                    code
                  );
                  onSpinnerChanged(true);
                  let userData = auth()
                    .signInWithCredential(credential)
                    .then(() => {
                      if (password && confirm_password) {
                        if (password == confirm_password) {
                          request
                            .post("password/reset", {
                              tel: phone,
                              tel_code: callingCode,
                              password: password,
                              confirm_password: confirm_password,
                            })
                            .then(function (response) {
                              response = response.data;
                              
                              if (response.success) {
                                alert.warning(
                                  Translate.t("pass_reset_success"),
                                  function () {
                                    onSpinnerChanged(false)
                                    onCodeChanged("");
                                    onConfirmPasswordChanged("");
                                    onPasswordChanged("");
                                    onPhoneChanged("");
                                    props.navigation.reset({
                                      index: 0,
                                      routes: [{ name: "LoginScreen" }],
                                    });
                                  }
                                );
                              } else {
                                alert.warning(Translate.t(response.error), ()=>{
                                  onSpinnerChanged(false);
                                });
                              }
                            })
                            .catch(function (error) {
                              onSpinnerChanged(false);
                              if (
                                error &&
                                error.response &&
                                error.response.data &&
                                Object.keys(error.response.data).length > 0
                              ) {
                                alert.warning(
                                  error.response.data[
                                    Object.keys(error.response.data)[0]
                                  ][0] +
                                    "(" +
                                    Object.keys(error.response.data)[0] +
                                    ")", ()=>{
                                      onSpinnerChanged(false);
                                    }
                                );
                              }
                            });
                        } else {
                          onSpinnerChanged(false);
                          alert.warning(
                            Translate.t('passwordAndConfirmPasswordMustSame'), ()=>{
                              onSpinnerChanged(false);
                            }
                          );
                        }
                      } else {
                        alert.warning(
                          Translate.t('fillPass'), ()=>{
                            onSpinnerChanged(false);
                          }
                        );
                      }
                    })
                    .catch((error) => {
                      console.log(error)
                      alert.warning(Translate.t("invalidValidationCode"), ()=>{
                        onSpinnerChanged(false);
                      });
                    });
                }
              }}
            >
              <View style={styles.sendVerificationCodeButton}>
                <Text style={styles.sendVerificationCodeButtonText}>
                  {Translate.t("changePassword")}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  passwordResetText: {
    color: Colors.deepGrey,
    fontSize: RFValue(12),
    alignSelf: "center",
    marginTop: heightPercentageToDP("3%"),
  },
  registeredPhoneNumber: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    flex: 1,
    paddingVertical: heightPercentageToDP("1%"),
    // marginHorizontal: widthPercentageToDP("10%"),
    // marginTop: heightPercentageToDP("3%"),
    // marginHorizontal: widthPercentageToDP("10%"),
    marginLeft: widthPercentageToDP("2%"),
    fontSize: RFValue(12),
  },
  verficationCodeInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    paddingVertical: heightPercentageToDP("1%"),
    marginTop: heightPercentageToDP("3%"),
    marginHorizontal: widthPercentageToDP("7%"),
    fontSize: RFValue(11),
  },
  newPasswordInput: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    paddingVertical: heightPercentageToDP("1%"),
    marginTop: heightPercentageToDP("3%"),
    marginHorizontal: widthPercentageToDP("7%"),
    fontSize: RFValue(11),
  },
  newPasswordInputReenter: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("7%"),
    fontSize: RFValue(11),
  },
  sendVerificationCodeButton: {
    borderRadius: 5,
    paddingVertical: 8,
    marginHorizontal: widthPercentageToDP("20%"),
    marginTop: heightPercentageToDP("4%"),
    backgroundColor: Colors.D7CCA6,
  },
  sendVerificationCodeButtonText: {
    color: "white",
    fontSize: RFValue(12),
    textAlign: "center",
  },
  textInput: {
    borderWidth: 1,
    backgroundColor: "transparent",
    // borderColor: "black",
    borderRadius: 0,
    fontSize: RFValue(10),
    // height: heightPercentageToDP("5.8%"),
    // paddingLeft: widthPercentageToDP("2%"),
    width: widthPercentageToDP("25%"),
    // marginVertical: heightPercentageToDP("1%"),
  },
});
