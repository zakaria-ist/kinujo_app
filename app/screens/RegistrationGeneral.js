import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Request from "../lib/request";
import AsyncStorage from "@react-native-community/async-storage";
import CustomAlert from "../lib/alert";
import { LinearGradient } from "expo-linear-gradient";
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
import { call } from "react-native-reanimated";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioTripleDot = win.width / 23 / 15;
const ratioKinujo = win.width / 1.6 / 151;
export default function RegistrationGeneral(props) {
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
        {/* <KeyboardAvoidingView
        behavior={Platform.OS=="a"}
        style={{ flex: 1 }}
      > */}
        <ScrollView style={{ flex: 1 }}>
          <WhiteBackArrow onPress={() => props.navigation.pop()} />
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
          <View>
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
              placeholder={Translate.t("password")}
              secureTextEntry={true}
              onChangeText={(text) => onPasswordChanged(text)}
              value={password}
            ></TextInput>
            <TextInput
              style={styles.パスワード確認}
              placeholderTextColor={Colors.white}
              placeholder={Translate.t("passwordConfirmation")}
              secureTextEntry={true}
              onChangeText={(text) => onConfirmPasswordChanged(text)}
              value={confirm_password}
            ></TextInput>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginHorizontal: widthPercentageToDP("10%"),
              }}
            >
              <View
                style={{
                  alignSelf: "flex-end",
                  width: widthPercentageToDP("22%"),
                }}
              >
                <CountryPicker
                  withCallingCode
                  withFilter
                  withFlag
                  placeholder={callingCode ? " + " + callingCode : "Country"}
                  onSelect={(val) => processCountryCode(val)}
                  containerButtonStyle={{
                    borderWidth: 1,
                    borderColor: "white",
                    paddingVertical: heightPercentageToDP("1%"),
                  }}
                />
              </View>
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
                        authority: "general",
                      })
                      .then(function (response) {
                        response = response.data;
                        if (response.success) {
                          // onConfirmPasswordChanged("")
                          // onNicknameChanged("")
                          // onPasswordChanged("")
                          // onPhoneChanged("")
                          AsyncStorage.getItem("referUser", function (item) {
                            props.navigation.navigate("SMSAuthentication", {
                              callingCode: callingCode,
                              nickname: nickname,
                              real_name: nickname,
                              username: phone,
                              password: password,
                              authority: "general",
                              introducer: item,
                            });
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
                        alert.warning(JSON.stringify(error));
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
                }
              }}
            >
              <View style={styles.registerGeneralButton}>
                <Text style={styles.registerGeneralButtonText}>
                  {Translate.t("registerAsGeneralUser")}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("RegistrationStore");
              }}
            >
              <View style={styles.registerBeauticianSalonButton}>
                <Text style={styles.registerBeauticianSalonButtonText}>
                  {Translate.t("registerAsBeauticianOrSalon")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* </KeyboardAvoidingView> */}
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ニックネーム: {
    borderBottomWidth: 1,
    marginHorizontal: widthPercentageToDP("10%"),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    fontSize: RFValue(12),
    borderColor: "white",
  },
  パスワード: {
    borderBottomWidth: 1,
    marginHorizontal: widthPercentageToDP("10%"),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    fontSize: RFValue(12),
    borderBottomColor: Colors.white,
  },
  パスワード確認: {
    borderBottomWidth: 1,
    marginHorizontal: widthPercentageToDP("10%"),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    fontSize: RFValue(12),
    borderBottomColor: Colors.white,
  },
  携帯電話番号: {
    borderBottomWidth: 1,
    marginLeft: widthPercentageToDP("1%"),
    paddingBottom: RFValue(15),
    paddingRight: widthPercentageToDP("10%"),
    paddingTop: RFValue(15),
    fontSize: RFValue(12),
    borderBottomColor: Colors.white,
  },
  registerGeneralButton: {
    marginTop: heightPercentageToDP("7"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    backgroundColor: Colors.deepGrey,
  },
  registerGeneralButtonText: {
    color: "white",
    fontSize: RFValue(12),
    textAlign: "center",
  },
  registerBeauticianSalonButton: {
    marginTop: heightPercentageToDP("5"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    backgroundColor: Colors.deepGrey,
  },
  registerBeauticianSalonButtonText: {
    color: "white",
    fontSize: RFValue(12),
    textAlign: "center",
  },
});
