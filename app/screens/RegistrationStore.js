import React from "react";
import { InteractionManager } from 'react-native';

import {
  StyleSheet,
  SafeAreaView,
  Text,
  TextInput,
  Image,
  View,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-community/async-storage";
import CountrySearch from "../assets/CustomComponents/CountrySearch";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors } from "../assets/Colors";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWordWithArrow";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Alert } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { RFValue } from "react-native-responsive-fontsize";
import Translate from "../assets/Translates/Translate";
import WhiteBackArrow from "../assets/CustomComponents/CustomWhiteBackArrow";
import { useIsFocused } from "@react-navigation/native";
const request = new Request();
const alert = new CustomAlert();

export default function RegistrationStore(props) {
  const win = Dimensions.get("window");
  const ratio = win.width / 25 / 17;
  const ratioTripleDot = win.width / 23 / 15;
  const ratioKinujo = win.width / 1.6 / 151;
  const [nickname, onNicknameChanged] = useStateIfMounted("");
  const [password, onPasswordChanged] = useStateIfMounted("");
  const [confirm_password, onConfirmPasswordChanged] = useStateIfMounted("");
  const [phone, onPhoneChanged] = useStateIfMounted("");
  const [callingCode, onCallingCodeChanged] = useStateIfMounted("");
  const [countryCodeHtml, onCountryCodeHtmlChanged] = useStateIfMounted([]);
  const [loaded, onLoaded] = useStateIfMounted(false);
  const [refUser, onReferUser] = useStateIfMounted(null);
  const isFocused = useIsFocused();

  setTimeout(function () {
    SplashScreen.hide();
  }, 1000);
  React.useEffect(()=>{
    InteractionManager.runAfterInteractions(() => {
      request.get("country_codes/").then(function (response) {
          let tmpCountry = response.data.map((country) => {
            return {
              id: country.tel_code,
              name: country.tel_code,
            };
          });
          onCountryCodeHtmlChanged(tmpCountry);
          if(!callingCode){
            onCallingCodeChanged(81);
          }
        });
        onLoaded(true);
        try {
          onReferUser(props.route.params.referUser);
          AsyncStorage.setItem("referUser", props.route.params.referUser);
        } catch (e) {
          console.log(e);
        }
    });
    
  }, [isFocused])

  function processCountryCode(val) {
    let tmpItem = val.split("+");
    // alert.warning(tmpItem[1]);
    onCallingCodeChanged(tmpItem[1]);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[Colors.E4DBC0, Colors.C2A059]}
        start={[0, 0]}
        end={[1, 0.6]}
        style={{ flex: 1 }}
      >
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
          scrollEnabled={true}
        >
          <WhiteBackArrow onPress={() => props.navigation.goBack()} />
          <View
            style={{
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: win.width - widthPercentageToDP("10%"),
                height: 38 * ratioKinujo,
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
              textContentType="password"
              onChangeText={(text) => onPasswordChanged(text)}
              value={password}
            ></TextInput>
            <TextInput
              style={styles.パスワード確認}
              placeholderTextColor={Colors.white}
              secureTextEntry={true}
              placeholder={Translate.t("passwordConfirmation")}
              textContentType="password"
              onChangeText={(text) => onConfirmPasswordChanged(text)}
              value={confirm_password}
            ></TextInput>
            <View
              style={{
                flexDirection: "row",
                // backgroundColor: "orange",
                alignItems: "center",
              }}
            >
              <CountrySearch
                defaultCountry={"+" + callingCode}
                props={props}
                onCountryChanged={(val) => {
                  if (val) {
                    processCountryCode(val);
                  }
                }}
              ></CountrySearch>
              {/* <CountrySearch
                props={props}
                defaultCountry={"+" + callingCode}
                onCountryChanged={(val) => {
                  if (val) {
                    processCountryCode(val);
                  }
                }}
              ></CountrySearch> */}
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
                style={styles.携帯電話番号}
                placeholderTextColor={Colors.white}
                placeholder={Translate.t("phoneNumber")}
                onChangeText={(text) =>
                  onPhoneChanged(String(text).replace(/[^0-9]/g, ""))
                }
                value={phone}
              ></TextInput>
            </View>
          </View>
          <View style={{ paddingBottom: heightPercentageToDP("5%") }}>
            <TouchableWithoutFeedback
              onPress={() => {
                if (
                  callingCode &&
                  nickname &&
                  phone &&
                  password &&
                  confirm_password
                ) {
                  if (password == confirm_password) {
                    request
                      .post("user/register/check", {
                        nickname: nickname,
                        username: callingCode + phone,
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
                              if (item == null || item == "" || item == "0") {
                                item = refUser;
                              }
                              props.navigation.navigate("SMSAuthentication", {
                                nickname: nickname,
                                real_name: nickname,
                                username: callingCode + phone,
                                password: password,
                                authority: "store",
                                introducer: item,
                                callingCode: callingCode,
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
                            let tmpErrorMessage =
                              response.errors[
                                Object.keys(response.errors)[0]
                              ][0] +
                              "(" +
                              Object.keys(response.errors)[0] +
                              ")";
                            // alert.warning(tmpErrorMessage);
                            let errorMessage = String(
                              tmpErrorMessage.split("(").pop()
                            );
                            // alert.warning(
                            //   Translate.t("register-(" + errorMessage)
                            // );
                            Alert.alert(
                              "",
                              // Translate.t("registerWarning"),
                              Translate.t("register-(" + errorMessage),
                              [
                                {
                                  text: "OK",
                                  onPress: () => {},
                                },
                              ],
                              { cancelable: false }
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
            </TouchableWithoutFeedback>
            <View
              onPress={() => props.navigation.navigate("TermsOfCondition", {"referUser": refUser, "store": 0})}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: heightPercentageToDP("4%"),
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => props.navigation.navigate("TermsOfCondition", {"referUser": refUser, "store": 0})}
              >
                <View style={{flexDirection:"row"}}>
                  <Text
                    style={{
                      color: Colors.white,
                      fontSize: RFValue(12),
                      alignSelf: "center",
                    }}
                  >
                    {Translate.t("nonBeautician")}
                  </Text>
                  <Image
                    onPress={() => props.navigation.navigate("TermsOfCondition", {"referUser": refUser, "store": 0})}
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
              </TouchableWithoutFeedback>
            </View>
          </View>
        </KeyboardAwareScrollView>
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
