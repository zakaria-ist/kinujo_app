import React from "react";
import { InteractionManager } from 'react-native';

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
  ScrollView,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import Request from "../lib/request";
import AsyncStorage from "@react-native-community/async-storage";
import CustomAlert from "../lib/alert";
import { LinearGradient } from "expo-linear-gradient";
import CountrySearch from "../assets/CustomComponents/CountrySearch";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors } from "../assets/Colors";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWordWithArrow";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { Alert } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import SplashScreen from "react-native-splash-screen";
import Translate from "../assets/Translates/Translate";
import WhiteBackArrow from "../assets/CustomComponents/CustomWhiteBackArrow";
import CountryPicker from "react-native-country-picker-modal";
import { call } from "react-native-reanimated";
import * as Localization from "expo-localization";
import DropDownPicker from "react-native-dropdown-picker";
import { useIsFocused } from "@react-navigation/native";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioTripleDot = win.width / 23 / 15;
const ratioKinujo = win.width / 1.6 / 151;
export default function RegistrationGeneral(props) {
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
        console.log('props.route.params.referUser', props.route.params.referUser);
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
    // console.log(tmpItem);
    onCallingCodeChanged(tmpItem[1]);
  }

  function register(type){
    if (
      callingCode &&
      nickname &&
      phone &&
      password &&
      confirm_password
    ) {
      if (password == confirm_password) {
        // console.log({
        //   nickname: nickname,
        //   username: callingCode + phone,
        //   password: password,
        //   authority: "general",
        // });
        request
          .post("user/register/check", {
            nickname: nickname,
            username: callingCode + phone,
            password: password,
            authority: type,
          })
          .then(function (response) {
            // console.log(response);
            response = response.data;
            if (response.success) {
              // onConfirmPasswordChanged("")
              // onNicknameChanged("")
              // onPasswordChanged("")
              // onPhoneChanged("")
              AsyncStorage.getItem("referUser", function (item) {
                if (item == null || item == "" || item == "0") {
                  item = refUser;
                }
                props.navigation.navigate("SMSAuthentication", {
                  nickname: nickname,
                  real_name: nickname,
                  username: callingCode + phone,
                  password: password,
                  authority: type,
                  introducer: item,
                  callingCode: callingCode,
                });
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
            alert.warning(JSON.stringify(error));
            if (
              error &&
              error.response &&
              error.response.data &&
              Object.keys(error.response.data).length > 0
            ) {
              let tmpErrorMessage =
                error.response.data[
                  Object.keys(error.response.data)[0]
                ][0] +
                "(" +
                Object.keys(error.response.data)[0] +
                ")";
              // alert.warning(tmpErrorMessage);
              let errorMessage = String(
                tmpErrorMessage.split("(").pop()
              );
              alert.warning(Translate.t("(" + errorMessage));
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
              placeholder={Translate.t("password")}
              secureTextEntry={true}
              textContentType="password"
              onChangeText={(text) => onPasswordChanged(text)}
              value={password}
            ></TextInput>
            <TextInput
              style={styles.パスワード確認}
              placeholderTextColor={Colors.white}
              placeholder={Translate.t("passwordConfirmation")}
              secureTextEntry={true}
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
            <TouchableOpacity
              onPress={() => {
                register("general")
              }}
            >
              <View style={styles.registerGeneralButton}>
                <Text style={styles.registerGeneralButtonText}>
                  {Translate.t("registerAsGeneralUser")}
                </Text>
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => {
                register("store")
              }}
            >
              <View style={styles.registerBeauticianSalonButton}>
                <Text style={styles.registerBeauticianSalonButtonText}>
                  {Translate.t("registerAsBeauticianOrSalon")}
                </Text>
              </View>
            </TouchableOpacity> */}
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ニックネーム: {
    borderBottomWidth: 1,
    // marginHorizontal: widthPercentageToDP("10%"),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    fontSize: RFValue(12),
    borderColor: "white",
  },
  パスワード: {
    borderBottomWidth: 1,
    // marginHorizontal: widthPercentageToDP("10%"),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    fontSize: RFValue(12),
    borderBottomColor: Colors.white,
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
