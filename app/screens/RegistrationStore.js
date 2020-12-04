import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import { Colors } from "../assets/Colors";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWordWithArrow";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import Translate from "../assets/Translates/Translate";
import WhiteBackArrow from "../assets/CustomComponents/CustomWhiteBackArrow";
import { ScrollView } from "react-native-gesture-handler";
import CountryPicker from "react-native-country-picker-modal";
const request = new Request();
const alert = new CustomAlert();

export default function RegistrationStore(props) {
  const win = Dimensions.get("window");
  const ratio = win.width / 25 / 17;
  const ratioTripleDot = win.width / 23 / 15;
  const ratioKinujo = win.width / 1.6 / 151;
  const [nickname, onNicknameChanged] = React.useState("");
  const [password, onPasswordChanged] = React.useState("");
  const [confirm_password, onConfirmPasswordChanged] = React.useState("");
  const [phone, onPhoneChanged] = React.useState("");
  const [callingCode, onCallingCodeChanged] = React.useState("");
  const [flag, onFlagChanged] = React.useState("");
  function processCountryCode(val) {
    onCallingCodeChanged(val.callingCode);
    onFlagChanged(val.flag);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[Colors.E4DBC0, Colors.C2A059]}
        start={[0, 0]}
        end={[1, 0.6]}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }}>
          <WhiteBackArrow
            onPress={() => props.navigation.navigate("TermsOfCondition")}
          />
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: win.width / 1.6,
                height: 44 * ratioKinujo,
                alignSelf: "center",
                marginTop: heightPercentageToDP("3%"),
              }}
              source={require("../assets/Images/kinujo.png")}
            />
            <Text
              style={{
                marginTop: heightPercentageToDP("8%"),
                color: Colors.white,
                fontSize: RFValue(14),
              }}
            >
              {Translate.t("storeAccount")}
            </Text>
            <Text
              style={{
                marginTop: 5,
                color: Colors.white,
                fontSize: RFValue(16),
              }}
            >
              {Translate.t("newMemberRegistration")}
            </Text>
            <Image
              style={{
                marginTop: heightPercentageToDP("3%"),
                width: win.width / 23,
                height: 52 * ratioTripleDot,
              }}
              source={require("../assets/Images/tripleWhiteDot.png")}
            />
          </View>
          <View style={{ marginHorizontal: widthPercentageToDP("10%") }}>
            <TextInput
              style={styles.ニックネーム}
              placeholderTextColor={Colors.white}
              placeholder={Translate.t("name")}
              onChangeText={(text) => onNicknameChanged(text)}
              value={nickname}
            ></TextInput>
            <TextInput
              style={styles.パスワード}
              placeholderTextColor={Colors.white}
              secureTextEntry={true}
              placeholder={Translate.t("password")}
              onChangeText={(text) => onPasswordChanged(text)}
              value={password}
            ></TextInput>
            <TextInput
              style={styles.パスワード確認}
              placeholderTextColor={Colors.white}
              secureTextEntry={true}
              placeholder={Translate.t("passwordConfirmation")}
              onChangeText={(text) => onConfirmPasswordChanged(text)}
              value={confirm_password}
            ></TextInput>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
              }}
            >
              <CountryPicker
                theme={{
                  fontSize: RFValue(10),
                  itemHeight: heightPercentageToDP("5%"),
                }}
                withCallingCode
                withFilter
                withFlag
                placeholder={callingCode ? " + " + callingCode : "+"}
                onSelect={(val) => processCountryCode(val)}
                containerButtonStyle={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "white",
                  paddingLeft: widthPercentageToDP("1%"),
                  paddingVertical: heightPercentageToDP(".6%"),
                  width: widthPercentageToDP("15%"),
                }}
              />
              <TextInput
                style={styles.携帯電話番号}
                placeholderTextColor={Colors.white}
                placeholder={Translate.t("phoneNumber")}
                onChangeText={(text) => onPhoneChanged(text)}
                value={phone}
              ></TextInput>
            </View>
          </View>
          <View style={{ paddingBottom: heightPercentageToDP("5%") }}>
            <TouchableOpacity
              onPress={() => {
                if (nickname && phone && password && confirm_password) {
                  if (password == confirm_password) {
                    request
                      .post("user/register/check", {
                        nickname: nickname,
                        username: phone,
                        password: password,
                        authority: "store",
                      })
                      .then(function (response) {
                        response = response.data;
                        if (response.success) {
                          // onConfirmPasswordChanged("");
                          // onNicknameChanged("");
                          // onPasswordChanged("");
                          // onPhoneChanged("");
                          AsyncStorage.getItem("referUser")
                            .then((item) => {
                              props.navigation.navigate("SMSAuthentication", {
                                nickname: nickname,
                                real_name: nickname,
                                username: callingCode + phone,
                                password: password,
                                authority: "store",
                                introducer: item,
                              });
                            })
                            .catch(function (error) {
                              alert.warning(JSON.stringify(error));
                            });
                        } else {
                          if (
                            response.errors &&
                            Object.keys(response.errors).length > 0
                          ) {
                            alert.warning(
                              response.errors[
                                Object.keys(response.errors)[0]
                              ][0] +
                                "(" +
                                Object.keys(response.errors)[0] +
                                ")"
                            );
                          }
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
                            ][0]
                          );
                        }
                      });
                  } else {
                    alert.warning(
                      Translate.t("passwordAndConfirmPasswordMustSame")
                    );
                  }
                } else {
                  alert.warning(Translate.t("fieldNotFilled"));
                }
              }}
            >
              <View style={styles.proceedToSMSAuthButton}>
                <Text style={styles.proceedToSMSAuthButtonText}>
                  {Translate.t("proceedToSMSAuthentication")}
                </Text>
              </View>
            </TouchableOpacity>
            <View
              onPress={() => props.navigation.pop()}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: heightPercentageToDP("4%"),
              }}
            >
              <Text
                onPress={() => props.navigation.pop()}
                style={{
                  color: Colors.white,
                  fontSize: RFValue(12),
                  alignSelf: "center",
                }}
              >
                {Translate.t("nonBeautician")}
              </Text>
              <Image
                onPress={() => props.navigation.pop()}
                style={{
                  alignSelf: "center",
                  marginLeft: 5,
                  width: win.width / 25,
                  height: 17 * ratio,
                  alignSelf: "center",
                }}
                source={require("../assets/Images/whiteNextArrow.png")}
              />
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ニックネーム: {
    borderBottomWidth: 1,
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    // marginHorizontal: widthPercentageToDP("10%"),
    borderBottomColor: Colors.white,
    fontSize: RFValue(12),
  },
  パスワード: {
    borderBottomWidth: 1,
    // marginHorizontal: widthPercentageToDP("10%"),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    borderBottomColor: Colors.white,
    fontSize: RFValue(12),
  },
  パスワード確認: {
    borderBottomWidth: 1,
    // marginHorizontal: widthPercentageToDP("10%"),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    fontSize: RFValue(12),
    borderBottomColor: Colors.white,
  },
  携帯電話番号: {
    flex: 1,
    marginLeft: widthPercentageToDP("3%"),
    borderBottomWidth: 1,
    // paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    fontSize: RFValue(12),
    borderBottomColor: Colors.white,
  },
  proceedToSMSAuthButton: {
    marginTop: heightPercentageToDP("5"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    backgroundColor: Colors.deepGrey,
  },
  proceedToSMSAuthButtonText: {
    color: "white",
    fontSize: RFValue(12),
    textAlign: "center",
  },
});
