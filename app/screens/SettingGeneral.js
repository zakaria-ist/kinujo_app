import React from "react";
import { InteractionManager } from 'react-native';

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
} from "react-native";

import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { Colors } from "../assets/Colors.js";
import DropDownPicker from "react-native-dropdown-picker";
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
import i18n from "i18n-js";
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
const ratioNext = win.width / 38 / 8;
const ratioPurchaseHistoryIcon = win.width / 14 / 25;
const ratioOtherIcon = win.width / 14 / 25;
const ratioHelpIcon = win.width / 18 / 18;
const ratioSignOut = win.width / 14 / 512;
const ratioGlobe = win.width / 12 / 128;
let defaultLanguage = Localization.locale;
let controller;
export default function SettingGeneral(props) {
  const isFocused = useIsFocused();
  const [user, onUserChanged] = useStateIfMounted({});
  const [state, setState] = useStateIfMounted(false);
  const [controllerState, onControllerStateChanged] = useStateIfMounted(false);
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
    }
  });
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      if (!user.url) {
        AsyncStorage.getItem("user").then(function (url) {
          request
            .get(url)
            .then(function (response) {
              onUserChanged(response.data);
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
      }
    });
  }, [isFocused]);
  if (!isFocused) {
    controller.close();
  }
  return (
    <TouchableWithoutFeedback onPress={() => controller.close()}>
      <SafeAreaView style={{ flex: 1 }}>
        <CustomHeader
          onFavoritePress={() => {
            props.navigation.navigate("Favorite");
          }}
          onBack={() => {
            props.navigation.goBack();
          }}
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
          text={Translate.t("setting")}
        ></CustomHeader>
        <CustomSecondaryHeader
          editProfile="editProfile"
          onPress={() => {
            props.navigation.navigate("ProfileEditingGeneral", {
              is_store: false,
            });
          }}
          name={user.nickname}
        />
        <ScrollView style={{ marginTop: heightPercentageToDP("3%") }}>
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.navigate("PurchaseHistory", {
                is_store: false,
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
              {/* <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              /> */}
            </View>
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback
            onPress={() =>
              props.navigation.navigate("Setting", {
                is_store: false,
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
              props.navigation.navigate("ShippingList", {
                is_store: false,
              })
            }
          >
            <View style={styles.tabContainer}>
              <Image
                style={{
                  width: win.width / 18,
                  height: 25 * ratioHelpIcon,
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

          <TouchableWithoutFeedback
            onPress={() => {
              alert.ask(Translate.t("confirm_logout"), ()=>{
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
              })
            }}
          >
            <View
              style={{
                flexDirection: "row",
                zIndex: 1,
                marginTop:
                  controllerState == true ? heightPercentageToDP("10%") : 0,
                height: heightPercentageToDP("7%"),
                justifyContent: "flex-start",
                alignItems: "center",
                marginHorizontal: widthPercentageToDP("5.2%"),
              }}
            >
              <Image
                source={require("../assets/Images/signout.png")}
                style={{ width: win.width / 14, height: 512 * ratioSignOut }}
              />
              <Text style={styles.textInLeftContainer}>
                {Translate.t("logout")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    height: heightPercentageToDP("7.5%"),
    justifyContent: "flex-start",
    alignItems: "center",
    marginHorizontal: widthPercentageToDP("4%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.F0EEE9,
    zIndex: 2,
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
    position: "absolute",
    fontSize: RFValue(14),
    left: 0,
  },
  none: {
    display: "none",
  },
});
