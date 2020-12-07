import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { Colors } from "../assets/Colors.js";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import CountryPicker from "react-native-country-picker-modal";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratio = win.width / 23 / 15;
const ratioKinujo = win.width / 1.6 / 151;

function findParams(data, param) {
  let tmps = data.split("?");
  if (tmps.length > 0) {
    let tmp = tmps[1];
    let params = tmp.split("&");
    let searchParams = params.filter((tmpParam) => {
      return tmpParam.indexOf(param) >= 0;
    });
    if (searchParams.length > 0) {
      let foundParam = searchParams[0];
      let foundParams = foundParam.split("=");
      if (foundParams.length > 0) {
        return foundParams[1];
      }
    }
  }
  return "";
}

async function saveProduct(props, link){
  let product_id = findParams(link, "product_id");
  await AsyncStorage.setItem("product", product_id);
}

async function performUrl(props, link) {
  let userId = findParams(link, "userId");
  let store = findParams(link, "is_store");
  await AsyncStorage.setItem("referUser", userId);
  if (store) {
    props.navigation.navigate("RegistrationStore");
  } else {
    props.navigation.navigate("RegistrationGeneral");
  }
}

async function init(props, foreground) {
  let url = await AsyncStorage.getItem("user");
  if (url) {
    let link = await dynamicLinks().getInitialLink();
    if (link) {
      await saveProduct(props, link.url)
    }
    request
      .get(url)
      .then(function (response) {
        if (response.data.is_seller) {
          props.navigation.reset({
            index: 0,
            routes: [{ name: "HomeStore" }],
          });
        } else {
          props.navigation.reset({
            index: 0,
            routes: [{ name: "HomeGeneral" }],
          });
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
            error.response.data[Object.keys(error.response.data)[0]][0] +
              "(" +
              Object.keys(error.response.data)[0] +
              ")"
          );
        }
      });
  } else {
    let link = await dynamicLinks().getInitialLink();
    if (link) {
      await saveProduct(props, link.url)
      await performUrl(props, link.url);
    } else {
      if (foreground) {
        foreground();
      }
    }
  }
}

export default function LoginScreen(props) {
  const [password, onPasswordChanged] = React.useState("");
  const [phone, onPhoneChanged] = React.useState("");
  const [callingCode, onCallingCodeChanged] = React.useState("");
  const [flag, onFlagChanged] = React.useState("");
  React.useEffect(() => {
    let unsubscribe;
    init(props, () => {
      unsubscribe = dynamicLinks().onLink((link) => {
        saveProduct(props, link.url);
        performUrl(props, link.url);
      });
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);
  function processCountryCode(val) {
    onCallingCodeChanged(val.callingCode);
    console.log(callingCode);
    onFlagChanged(val.flag);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, backgroundColor: Colors.white }}>
        <ImageBackground
          style={styles.backgroundImageContainer}
          source={require("../assets/Images/LoginPageLogo.png")}
        >
          <Image
            style={{
              width: win.width / 1.6,
              height: 44 * ratioKinujo,
              alignSelf: "center",
              marginTop: heightPercentageToDP("6%"),
            }}
            source={require("../assets/Images/kinujo.png")}
          />
        </ImageBackground>
        <Image
          style={{
            alignSelf: "center",
            width: win.width / 23,
            height: 52 * ratio,
            marginTop: heightPercentageToDP("3%"),
          }}
          source={require("../assets/Images/tripleDot.png")}
        />
        <View
          style={{
            marginHorizontal: widthPercentageToDP("10%"),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              // backgroundColor: "orange",
              alignItems: "center",
            }}
          >
            <CountryPicker
              theme={{
                fontSize: RFValue(12),
              }}
              withCallingCode
              withFilter
              withFlag
              placeholder={callingCode ? " + " + callingCode : "+"}
              onSelect={(val) => processCountryCode(val)}
              containerButtonStyle={{
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "black",
                paddingVertical: heightPercentageToDP("1%"),
                alignItems: "flex-start",
                paddingLeft: widthPercentageToDP("3%"),
                alignSelf: "center",
                width: widthPercentageToDP("20%"),
              }}
            />
            <TextInput
              onChangeText={(text) => onPhoneChanged(text)}
              value={phone}
              placeholder={Translate.t("phoneNumber")}
              placeholderTextColor={Colors.D7CCA6}
              style={styles.携帯電話番号}
            ></TextInput>
          </View>
          <TextInput
            placeholder={Translate.t("password")}
            placeholderTextColor={Colors.D7CCA6}
            secureTextEntry={true}
            onChangeText={(text) => onPasswordChanged(text)}
            value={password}
            style={styles.パスワード}
          ></TextInput>
        </View>
        <View style={{ paddingBottom: heightPercentageToDP("5%") }}>
          <TouchableWithoutFeedback
            onPress={() => {
              if (phone && password) {
                console.log(callingCode + phone);
                console.log(password);
                request
                  .post("user/login", {
                    tel: callingCode + phone,
                    password: password,
                  })
                  .then(function (response) {
                    onPasswordChanged("");
                    onPhoneChanged("");
                    response = response.data;
                    if (response.success) {
                      let user = response.data.user;
                      if (user.payload) {
                        user.payload = JSON.parse(user.payload);
                      } else {
                        user.payload = {};
                      }
                      if (user.is_hidden != 1) {
                        AsyncStorage.setItem(
                          "user",
                          user.url,
                          function (response) {
                            if (
                              user.is_seller &&
                              !user.is_master &&
                              !user.payload.account_selected
                            ) {
                              props.navigation.navigate(
                                "StoreAccountSelection",
                                {
                                  authority: "store",
                                }
                              );
                            } else if (
                              user.is_seller &&
                              !user.is_master &&
                              !user.payload.bank_skipped
                            ) {
                              props.navigation.navigate(
                                "BankAccountRegistrationOption",
                                {
                                  authority: "store",
                                }
                              );
                            } else if (
                              user.is_seller &&
                              !user.is_master &&
                              !user.is_approved
                            ) {
                              props.navigation.navigate("AccountExamination", {
                                authority: "store",
                              });
                            } else if (
                              user.is_seller &&
                              !user.is_master &&
                              !user.payload.register_completed
                            ) {
                              props.navigation.navigate("RegisterCompletion", {
                                authority: "store",
                              });
                            } else if (!user.is_seller && !user.is_master) {
                              props.navigation.reset({
                                index: 0,
                                routes: [{ name: "HomeGeneral" }],
                              });
                            } else if (user.is_seller) {
                              props.navigation.reset({
                                index: 0,
                                routes: [{ name: "HomeStore" }],
                              });
                            }
                          }
                        );
                      } else {
                        alert.warning(Translate.t("invalidUser"));
                        onCallingCodeChanged("");
                      }
                    } else {
                      alert.warning(Translate.t("wrongLoginDetails"));
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
                alert.warning(Translate.t("fieldNotFilled"));
              }
            }}
          >
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>{Translate.t("login")}</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text
            onPress={() => props.navigation.navigate("PasswordReset")}
            style={{
              alignSelf: "center",
              marginTop: heightPercentageToDP("3%"),
              fontSize: RFValue(12),
              borderBottomColor: Colors.black,
              borderBottomWidth: 1,
            }}
          >
            {Translate.t("forgetPasswordText")}
          </Text>
          <TouchableWithoutFeedback
            onPress={() => {
              // props.navigation.navigate("AdvanceSetting");
              // props.navigation.navigate("ProductInformationAddNew");
              props.navigation.navigate("TermsOfCondition");
            }}
          >
            <View style={styles.registerButton}>
              <Text style={styles.registerButtonText}>
                {Translate.t("newRegistration")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImageContainer: {
    height: heightPercentageToDP("35%"),
    width: "100%",
  },
  携帯電話番号: {
    flex: 1,
    fontSize: RFValue(12),
    // paddingBottom: RFValue(15),
    // paddingTop: RFValue(15),
    borderBottomWidth: 1,
    marginLeft: widthPercentageToDP("2%"),
    // marginHorizontal: widthPercentageToDP("10%"),
    // marginTop: heightPercentageToDP("3%"),
    borderBottomColor: Colors.D7CCA6,
  },
  パスワード: {
    fontSize: RFValue(14),
    paddingBottom: RFValue(15),
    paddingTop: RFValue(15),
    // marginHorizontal: widthPercentageToDP("10%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
  },
  loginButton: {
    marginTop: heightPercentageToDP("5"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    backgroundColor: Colors.D7CCA6,
  },
  loginButtonText: {
    color: "white",
    fontSize: RFValue(14),
    textAlign: "center",
  },
  registerButton: {
    marginTop: heightPercentageToDP("5"),
    borderRadius: 5,
    paddingVertical: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("10%"),
    backgroundColor: Colors.deepGrey,
  },
  registerButtonText: {
    color: "white",
    fontSize: RFValue(14),
    textAlign: "center",
  },
});
