import React from "react";
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
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { Colors } from "../assets/Colors";
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
import SearchableDropdown from "react-native-searchable-dropdown";
import BlackBackArrow from "../assets/CustomComponents/CustomBlackBackArrow";
import { call } from "react-native-reanimated";
export default function PasswordReset(props) {
  const [phone, onPhoneChanged] = React.useState("");
  const [code, onCodeChanged] = React.useState("");
  const [password, onPasswordChanged] = React.useState("");
  const [confirm_password, onConfirmPasswordChanged] = React.useState("");
  const [confirm, setConfirm] = React.useState(null);
  const [verficaitonButtonClicked, onVerficaitonButtonClicked] = React.useState(
    false
  );
  const [callingCode, onCallingCodeChanged] = React.useState("");
  const [flag, onFlagChanged] = React.useState("");
  const [triggerTimer, onTriggerTimer] = React.useState(false);
  const [timer, setTimer] = React.useState(30);
  const [showResend, onResendShow] = React.useState(false);
  const [resend, triggerResend] = React.useState(false);
  const [countryCodeHtml, onCountryCodeHtmlChanged] = React.useState([]);
  const [loaded, onLoaded] = React.useState(false);
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
    if (triggerTimer == true && timer > 0) {
      setTimeout(() => setTimer(timer - 1), 1000);
      onResendShow(true);
    } else if (timer == 0) {
      triggerResend(true);
    }
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
      <ScrollView keyboardShouldPersistTaps="always" style={{ flex: 1 }}>
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
              <SearchableDropdown
                onItemSelect={(item) => {
                  processCountryCode(item.id);
                }}
                containerStyle={{ padding: 5 }}
                itemStyle={{
                  padding: 10,
                  marginTop: 2,
                  borderColor: "#bbb",
                  borderWidth: 1,
                  borderRadius: 5,
                }}
                itemTextStyle={{ color: "black" }}
                itemsContainerStyle={{ maxHeight: heightPercentageToDP("15%") }}
                items={countryCodeHtml ? countryCodeHtml : []}
                textInputProps={{
                  placeholder: "+",
                  style: {
                    borderWidth: 1,
                    // backgroundColor: "white",
                    borderRadius: 5,
                    fontSize: RFValue(10),
                    width: widthPercentageToDP("23%"),
                    paddingLeft: widthPercentageToDP("3%"),
                    height: heightPercentageToDP("6%"),
                  },
                }}
                listProps={{
                  nestedScrollEnabled: true,
                }}
              />
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
                onVerficaitonButtonClicked(true);
                console.log(callingCode + phone);
                signInWithPhoneNumber("+" + callingCode + phone)
                  .then(() => {})
                  .catch((error) => {
                    alert.warning(error.code);
                  });
                onTriggerTimer(true);
              } else {
                alert.warning(Translate.t("fieldNotFilled"));
              }
            }}
          >
            <View style={styles.sendVerificationCodeButton}>
              <Text style={styles.sendVerificationCodeButtonText}>
                {Translate.t("sendVerificatioCode")}
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
              {timer}s {Translate.t("resendVerificationCodeText")}
            </Text>
          ) : (
            <View></View>
          )}
          {resend == true ? (
            <TouchableWithoutFeedback
              disabled={timer == 0 ? false : true}
              onPress={() => {
                if (phone != "") {
                  setTimer(30);
                  signInWithPhoneNumber(callingCode + phone);
                } else {
                  alert.warning(Translate.t("fieldNotFilled"));
                }
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
                  borderBottomWidth: 1,
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
          <View style={{ paddingBottom: heightPercentageToDP("5%") }}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (confirm && code) {
                  const credential = auth.PhoneAuthProvider.credential(
                    confirm.verificationId,
                    code
                  );
                  let userData = auth()
                    .signInWithCredential(credential)
                    .then(() => {
                      if (password && confirm_password) {
                        if (password == confirm_password) {
                          console.log({
                            tel: phone,
                            password: password,
                            confirm_password: confirm_password,
                            confirm_password: confirm_password,
                          });
                          request
                            .post("password/reset", {
                              tel: phone,
                              password: password,
                              confirm_password: confirm_password,
                              confirm_password: confirm_password,
                            })
                            .then(function (response) {
                              response = response.data;
                              if (response.success) {
                                alert.warning(
                                  Translate.t("pass_reset_success"),
                                  function () {
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
                                alert.warning(response.error);
                              }
                            })
                            .catch(function (error) {
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
                                    ")"
                                );
                              }
                            });
                        } else {
                          alert.warning(
                            "Password and confirm password mismatch."
                          );
                        }
                      } else {
                        alert.warning(
                          "Please fill in the password and confirm password"
                        );
                      }
                    })
                    .catch((error) => {
                      alert.warning(Translate.t("invalidValidationCode"));
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
      </ScrollView>
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
