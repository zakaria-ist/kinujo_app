import React from "react";
import { InteractionManager } from 'react-native';

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
  Platform,
  Linking
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { Colors } from "../assets/Colors.js";
import CustomKinujoWord from "../assets/CustomComponents/CustomKinujoWord";
import CountrySearch from "../assets/CustomComponents/CountrySearch";
import dynamicLinks from "@react-native-firebase/dynamic-links";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import { useIsFocused } from "@react-navigation/native";
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratio = win.width / 23 / 15;
const ratioKinujo = win.width / 1.6 / 151;

function findParams(data, param) {
  let tmps = data.split("?");
  console.log('tmps', tmps);
  if (tmps.length > 0) {
    let tmp = tmps[1];
    let params = tmp.split("&");
    let searchParams = params.filter((tmpParam) => {
      return tmpParam.indexOf(param) >= 0;
    });
    console.log('searchParams', searchParams);
    if (!searchParams.lemgth && param == "store") {
      if (tmps[0].indexOf('asia1store') >= 0) {
        return "1";
      }
      if (tmps[0].indexOf('asia0store') >= 0) {
        return "0";
      }
    } else {
      if (searchParams.length > 0) {
        let foundParam = searchParams[0];
        let foundParams = foundParam.split("=");
        console.log('foundParams', foundParams);
        if (foundParams.length > 0) {
          return foundParams[1];
        }
      }
    }

  }
  return "";
}

async function saveProduct(props, link) {
  let product_id = findParams(link, "product_id");
  await AsyncStorage.setItem("product", product_id);
}
function get_user_id(link) {
  let user_params = link.split('&')[0];
  return user_params.split('=')[1]
}
async function performUrl(props, link) {
  let userId = findParams(link, "userId");
  let store = findParams(link, "store");
  console.log('link', link);
  console.log('userId', userId);
  console.log('store', store);
  let links = [];
  if (store == "" || store == undefined) {
    if (link.indexOf('asia1store%3F') >= 0) {
      store = "1";
      links = link.split('asia1store%3F');
    }
    else if (link.indexOf('asia1store?') >= 0) {
      store = "1";
      links = link.split('asia1store?');
    }
    else if (link.indexOf('asia0store%3F') >= 0) {
      store = "0";
      links = link.split('asia0store%3F');
    }
    else if (link.indexOf('asia0store?') >= 0) {
      store = "0";
      links = link.split('asia0store?');
    }
    if (links) {
      userId = get_user_id(links[1]);
    }
    console.log('userId', userId);
    console.log('store', store);
  }
  await AsyncStorage.setItem("referUser", userId);
  if (store && store != "" && store != "0" ) {
    // props.navigation.navigate("RegistrationStore", {"referUser": userId});
    props.navigation.navigate("TermsOfCondition", {"referUser": userId, "store": 1});
  } else if(store && store != "" && store == "0") {
    // props.navigation.navigate("RegistrationGeneral", {"referUser": userId});
    props.navigation.navigate("TermsOfCondition", {"referUser": userId, "store": 0});
  }
}

async function init(props, foreground) {
  let url = await AsyncStorage.getItem("user");
  if (url) {
    if (Platform.OS === 'ios') {
      Linking.getInitialURL().then((url) => {
        if (url) {
          url = decodeURI(url);
          url = url.replace("https://kinujo-link.c2sg.asia/?link=", "")
          url = url.replaceAll("%3D", '=');
          url = url.replaceAll("%26", '&');
          saveProduct(props, url);
        }
      }).catch(err => {console.log('Linking ERROR', err)})
    } else {
      let link = await dynamicLinks().getInitialLink();
      if (link) {
        await saveProduct(props, link.url);
      }
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
    SplashScreen.hide();
    let link = "";
    if (Platform.OS === 'ios') {
      Linking.getInitialURL().then((url) => {
        if (url) {
          url = decodeURI(url);
          console.log('url', url);
          url = url.replace("https://kinujo-link.c2sg.asia/?link=", "")
          url = url.replaceAll("%3D", '=');
          url = url.replaceAll("%26", '&');
          saveProduct(props, url);
          performUrl(props, url);
        }
        else {
          if (foreground) {
            foreground();
          }
        }
      }).catch(err => {console.log('Linking ERROR', err)})
    } else {
      link = await dynamicLinks().getInitialLink();
    }
    if (link) {
      console.log('url', link.url);
      await saveProduct(props, link.url);
      await performUrl(props, link.url);
    } else {
      if (foreground) {
        foreground();
      }
    }
  }
}

export default function LoginScreen(props) {
  const [password, onPasswordChanged] = useStateIfMounted("");
  const [phone, onPhoneChanged] = useStateIfMounted("");
  const [callingCode, onCallingCodeChanged] = useStateIfMounted("");
  const [countryCodeHtml, onCountryCodeHtmlChanged] = useStateIfMounted([]);
  const [loaded, onLoaded] = useStateIfMounted(false);
  const isFocused = useIsFocused();
  if (!loaded) {
    request.get("country_codes/").then(function (response) {
      let tmpCountry = response.data.map((country) => {
        // console.log(country);
        return {
          id: country.tel_code,
          name: country.tel_code,
        };
      });
      onCountryCodeHtmlChanged(tmpCountry);
    });
    onLoaded(true);
  }

  // let tmpPrefectures = response.data.map((prefecture) => {
  //   return {
  //     label: prefecture.name,
  //     value: prefecture.url,
  //   };
  // });
  // onPrefecturesChanged(tmpPrefectures);
  // onPrefectureLoadedChanged(true);
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
    let tmpItem = val.split("+");
    // alert.warning(tmpItem[1]);
    onCallingCodeChanged(tmpItem[1]);
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
        scrollEnabled={true}
      >
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
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate("TermsOfCondition");
            }}
          >
            <View style={styles.registerButton}>
              <Text style={styles.registerButtonText}>
                {Translate.t("newRegistration")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <View style={{width:widthPercentageToDP("80%"), alignContent:"center", alignSelf:"center"}}>
            <Text style={{marginTop:10,fontSize: RFValue(12), textAlign:"center"}}>
              {Translate.t("askLogin")}
            </Text>
          </View>
        </View>
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
            <CountrySearch
              props={props}
              onCountryChanged={(val) => {
                if (val) {
                  processCountryCode(val);
                }
              }}
            ></CountrySearch>
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
            {/* <CountryPicker
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
            /> */}
            <TextInput
              onChangeText={(text) =>
                onPhoneChanged(String(text).replace(/[^0-9]/g, ""))
              }
              value={phone}
              placeholder={Translate.t("phoneNumber")}
              placeholderTextColor={Colors.D7CCA6}
              style={styles.携帯電話番号}
              keyboardType={"numeric"}
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
                console.log({
                  tel: callingCode + phone,
                  password: password,
                });
                request
                  .post("user/login", {
                    tel: callingCode + phone,
                    password: password,
                  })
                  .then(function (response) {
                    onPasswordChanged("");
                    //onPhoneChanged("");
                    response = response.data;
                    console.log(response);
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
                            if (user.authority.id == 2 || user.authority.id == 3) {
                              if (
                                user.is_seller &&
                                !user.is_master &&
                                !user.payload.bank_skipped &&
                                !user.bank
                              ) {
                                props.navigation.navigate(
                                  "BankAccountRegistrationOption",
                                  {
                                    authority: user.authority.id == 2 ? "special" : "ambassador",
                                  }
                                );
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
                            } else if (
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
          <View
            style={{
              // borderBottomColor: Colors.black,
              // borderBottomWidth: 1,
              marginHorizontal: widthPercentageToDP("10%"),
              paddingBottom: heightPercentageToDP("1%"),
            }}
          >
            <Text
              onPress={() => props.navigation.navigate("PasswordReset")}
              style={{
                alignSelf: "center",
                marginTop: heightPercentageToDP("3%"),
                fontSize: RFValue(12),
                textDecorationLine: "underline",
              }}
            >
              {Translate.t("forgetPasswordText")}
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
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
  textInput: {
    borderWidth: 1,
    backgroundColor: "white",
    // borderColor: "black",
    borderRadius: 0,
    fontSize: RFValue(10),
    // height: heightPercentageToDP("5.8%"),
    // paddingLeft: widthPercentageToDP("2%"),
    width: widthPercentageToDP("25%"),
    // marginVertical: heightPercentageToDP("1%"),
  },
});
