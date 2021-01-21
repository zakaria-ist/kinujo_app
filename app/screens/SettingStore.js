import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  DevSettings,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import DropDownPicker from "react-native-dropdown-picker";
import { Select } from "react-native-propel-kit";

import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { useIsFocused } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import auth from "@react-native-firebase/auth";
import * as Localization from "expo-localization";
import { Picker } from "@react-native-picker/picker";
import i18n from "i18n-js";
import Format from "../lib/format";
const format = new Format();
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
import NextArrow from "../assets/icons/nextArrow.svg";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioDownForMoreIcon = win.width / 24 / 9;
const ratioNext = win.width / 38 / 8;
const ratioCustomerList = win.width / 14 / 26;
const ratioProductList = win.width / 14 / 24;
const ratioPurchaseHistoryIcon = win.width / 14 / 25;
const ratioNotificationIcon = win.width / 15 / 25;
const ratioProfileEditingIcon = win.width / 16 / 22;
const ratioCreditCardIcon = win.width / 14 / 25;
const ratioOtherIcon = win.width / 14 / 25;
const ratioHelpIcon = win.width / 18 / 18;
const ratioSignOut = win.width / 16 / 512;
const ratioGlobe = win.width / 14 / 128;
let defaultLanguage = Localization.locale;
let controller;
export default function SettingStore(props) {
  const isFocused = useIsFocused();
  const [user, onUserChanged] = React.useState({});
  const [controllerState, onControllerStateChanged] = React.useState(false);
  const [state, setState] = React.useState(false);
  async function onValueChanged(language) {
    switch (language.value) {
      case "ja":
        await AsyncStorage.setItem("language", "ja");
        i18n.locale = "ja";
        setState(!state);
        // DevSettings.reload();
        break;
      case "en":
        AsyncStorage.setItem("language", "en");
        i18n.locale = "en";
        setState(!state);
        // DevSettings.reload();
        break;
    }
  }
  AsyncStorage.getItem("language").then((language) => {
    if (language) {
      defaultLanguage = language;
    } else {
      defaultLanguage = Localization.locale;
    }
  });
  React.useEffect(() => {
    // if (!user.url) {
    AsyncStorage.getItem("user").then(function (url) {
      request
        .get(url)
        .then(function (response) {
          onUserChanged(response.data);
          console.log("1");
          console.log(user.nickname);
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
    });
    // }
  }, [isFocused]);

  if (!isFocused) {
    controller.close();
  }

  return (
    <TouchableWithoutFeedback onPress={() => controller.close()}>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          onFavoritePress={() => props.navigation.navigate("Favorite")}
          onBack={() => {
            props.navigation.goBack();
          }}
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
          text={Translate.t("setting")}
        />
        <CustomSecondaryHeader
          editProfile="editProfile"
          onPress={() => {
            props.navigation.navigate("ProfileEditingStore", {
              is_store: true,
            });
          }}
          name={user.nickname}
          accountType={Translate.t("storeAccount")}
        />
        <ScrollView style={{ marginTop: heightPercentageToDP("1%") }}>
          {/* <View style={styles.totalSalesDateContainer}>
          <Text style={{ fontSize: RFValue(13) }}>2020年0月</Text>
          <Image
            style={{
              width: win.width / 24,
              height: 6 * ratioDownForMoreIcon,
            }}
            source={require("../assets/Images/downForMoreIcon.png")}
          />
        </View> */}
          <TouchableWithoutFeedback
            onPress={() =>
              props.navigation.navigate("SalesManagement", {
                is_store: 1,
              })
            }
          >
            <View style={styles.totalSalesContainer}>
              <Text
                style={{
                  fontSize: RFValue(13),
                  marginLeft: widthPercentageToDP("3%"),
                }}
              >
                {Translate.t("totalSale")} :
              </Text>
              <Text
                style={{
                  fontSize: RFValue(13),
                  marginLeft: widthPercentageToDP("1%"),
                }}
              >
                {format.separator(user.profit)}円
              </Text>
              {/* <Image
                style={{
                  width: win.width / 38,
                  height: 15 * ratioNext,
                  position: "absolute",
                  right: 0,
                  alignSelf: "center",
                  marginRight: widthPercentageToDP("3%"),
                }}
                source={require("../assets/Images/next.png")}
              /> */}
              <NextArrow
                style={{
                  width: RFValue(15),
                  height: RFValue(15),
                  position: "absolute",
                  right: widthPercentageToDP("3%"),
                  alignSelf: "center",
                }}
              />
            </View>
          </TouchableWithoutFeedback>
          {/* ALL TABLS CONTAINER */}
          <View style={{ marginTop: heightPercentageToDP("2%") }}>
            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate("CustomerList", {
                  is_store: true,
                  other_Value: "asdad",
                });
              }}
            >
              <View style={styles.tabContainer}>
                <Image
                  style={{
                    width: win.width / 14,
                    height: 24 * ratioCustomerList,
                  }}
                  source={require("../assets/Images/customerListIcon.png")}
                />
                <Text style={styles.textInLeftContainer}>
                  {Translate.t("customerList")}
                </Text>
                <NextArrow style={styles.nextIcon} />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate("ExhibitedProductList", {
                  is_store: true,
                });
              }}
            >
              <View style={styles.tabContainer}>
                <Image
                  style={{
                    width: win.width / 14,
                    height: 20 * ratioProductList,
                  }}
                  source={require("../assets/Images/productListIcon.png")}
                />
                <Text style={styles.textInLeftContainer}>
                  {Translate.t("productListManagement")}
                </Text>
                <NextArrow style={styles.nextIcon} />
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate("PurchaseHistory", {
                  is_store: true,
                });
              }}
            >
              <View style={styles.tabContainer}>
                <Image
                  style={{
                    width: win.width / 14,
                    height: 25 * ratioPurchaseHistoryIcon,
                  }}
                  source={require("../assets/Images/purchaseHistoryIcon.png")}
                />
                <Text style={styles.textInLeftContainer}>
                  {Translate.t("purchaseHistory")}
                </Text>
                <NextArrow style={styles.nextIcon} />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                props.navigation.navigate("Setting", {
                  is_store: true,
                })
              }
            >
              <View style={styles.tabContainer}>
                <Image
                  style={{
                    width: win.width / 14,
                    height: 25 * ratioOtherIcon,
                  }}
                  source={require("../assets/Images/otherIcon.png")}
                />
                <Text style={styles.textInLeftContainer}>
                  {Translate.t("setting")}
                </Text>
                <NextArrow style={styles.nextIcon} />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                props.navigation.navigate("BankAccountRegistration", {
                  is_store: true,
                })
              }
            >
              <View style={styles.tabContainer}>
                <Image
                  style={{
                    width: win.width / 14,
                    height: 20 * ratioCreditCardIcon,
                  }}
                  source={require("../assets/Images/creditCardIcon.png")}
                />
                <Text style={styles.textInLeftContainer}>
                  {Translate.t("registeredbank/creditcard")}
                </Text>
                <NextArrow style={styles.nextIcon} />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              onPress={() =>
                props.navigation.navigate("ShippingList", {
                  is_store: true,
                })
              }
            >
              <View style={styles.tabContainer}>
                <Image
                  style={{
                    width: win.width / 16,
                    height: 25 * ratioProfileEditingIcon,
                  }}
                  source={require("../assets/Images/profileEditingIcon.png")}
                />
                <Text style={styles.textInLeftContainer}>
                  {Translate.t("shippingList")}
                </Text>
                <NextArrow style={styles.nextIcon} />
              </View>
            </TouchableWithoutFeedback>
            {Platform.OS == "ios" ? (
              <View
                style={{
                  zIndex: 999,
                  flexDirection: "row",
                  height: heightPercentageToDP("7.5%"),
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginHorizontal: widthPercentageToDP("4%"),
                  marginTop: heightPercentageToDP("1%"),
                  // borderBottomWidth: 1,
                  // borderBottomColor: Colors.F0EEE9,
                }}
              >
                <Image
                  source={require("../assets/Images/globe.png")}
                  style={{ width: win.width / 14, height: 128 * ratioGlobe }}
                />

                <DropDownPicker
                  zIndex={1000}
                  elevation={999}
                  controller={(instance) => {
                    controller = instance;
                  }}
                  items={[
                    {
                      label: "English",
                      value: "en",
                    },
                    {
                      label: "Japanese",
                      value: "ja",
                    },
                  ]}
                  defaultValue={defaultLanguage == "ja" ? "ja" : "en"}
                  containerStyle={{
                    height: heightPercentageToDP("6%"),
                    width: widthPercentageToDP("80%"),
                    marginLeft: widthPercentageToDP("4%"),
                  }}
                  style={{
                    backgroundColor: "white",
                  }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  labelStyle={{
                    fontSize: RFValue(9),
                    color: Colors.D7CCA6,
                  }}
                  selectedtLabelStyle={{
                    color: Colors.D7CCA6,
                  }}
                  dropDownStyle={{
                    backgroundColor: "black",
                    color: "white",
                  }}
                  onOpen={() => onControllerStateChanged(true)}
                  onClose={() => onControllerStateChanged(false)}
                  arrowSize={RFValue(17)}
                  onChangeItem={(item) => onValueChanged(item)}
                />
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  height: heightPercentageToDP("7.5%"),
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginHorizontal: widthPercentageToDP("4%"),
                  marginTop: heightPercentageToDP("1%"),
                }}
              >
                <Image
                  source={require("../assets/Images/globe.png")}
                  style={{ width: win.width / 14, height: 128 * ratioGlobe }}
                />

                <DropDownPicker
                  zIndex={1000}
                  elevation={999}
                  controller={(instance) => {
                    controller = instance;
                  }}
                  items={[
                    {
                      label: "English",
                      value: "en",
                    },
                    {
                      label: "Japanese",
                      value: "ja",
                    },
                  ]}
                  defaultValue={defaultLanguage == "ja" ? "ja" : "en"}
                  containerStyle={{
                    height: heightPercentageToDP("6%"),
                    width: widthPercentageToDP("80%"),
                    marginLeft: widthPercentageToDP("4%"),
                  }}
                  style={{
                    backgroundColor: "white",
                  }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  labelStyle={{
                    fontSize: RFValue(9),
                    color: Colors.D7CCA6,
                  }}
                  selectedtLabelStyle={{
                    color: Colors.D7CCA6,
                  }}
                  dropDownStyle={{
                    backgroundColor: "black",
                    color: "white",
                  }}
                  onOpen={() => onControllerStateChanged(true)}
                  onClose={() => onControllerStateChanged(false)}
                  arrowSize={RFValue(17)}
                  onChangeItem={(item) => onValueChanged(item)}
                />
              </View>
            )}

            <View>
              <TouchableWithoutFeedback
                style={{
                  zIndex: -1,
                  elevation: -1,
                }}
                onPress={() => {
                  AsyncStorage.removeItem("user").then(() => {
                    db.collection("users")
                      .doc(String(user.id))
                      .collection("token")
                      .doc(String(user.id))
                      .delete();
                    props.navigation.reset({
                      index: 0,
                      routes: [{ name: "LoginScreen" }],
                    });
                  });
                  AsyncStorage.removeItem("defaultAddress");
                }}
              >
                <View
                  style={{
                    zIndex: -1,
                    flexDirection: "row",
                    height: heightPercentageToDP("7%"),
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginTop:
                      controllerState == true ? heightPercentageToDP("10%") : 0,
                    marginHorizontal: widthPercentageToDP("5.2%"),
                  }}
                >
                  <Image
                    source={require("../assets/Images/signout.png")}
                    style={{
                      width: win.width / 16,
                      height: 512 * ratioSignOut,
                    }}
                  />
                  <Text style={styles.textInLeftContainer}>
                    {Translate.t("logout")}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  totalSalesDateContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: heightPercentageToDP("2%"),
    marginLeft: widthPercentageToDP("5%"),
  },
  totalSalesContainer: {
    height: heightPercentageToDP("4%"),
    backgroundColor: Colors.F6F6F6,
    borderColor: "#d8cda7",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: heightPercentageToDP("1%"),
    marginHorizontal: widthPercentageToDP("5%"),
    borderWidth: 1,
  },
  tabContainer: {
    flexDirection: "row",
    height: heightPercentageToDP("7%"),
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: widthPercentageToDP("4%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.F0EEE9,
  },
  nextIcon: {
    // width: win.width / 38,
    // height: 15 * ratioNext,
    width: RFValue(15),
    height: RFValue(15),
    position: "absolute",
    right: widthPercentageToDP("1%"),
  },
  textInLeftContainer: {
    marginLeft: widthPercentageToDP("12%"),
    fontSize: RFValue(13),
    position: "absolute",
    left: 0,
  },
  none: {
    display: "none",
  },
});
