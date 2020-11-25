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
  SafeAreaView
} from "react-native";
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
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import auth from "@react-native-firebase/auth";
import * as Localization from "expo-localization";
import i18n from "i18n-js";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioNext = win.width / 38 / 8;
const ratioPurchaseHistoryIcon = win.width / 14 / 25;
const ratioOtherIcon = win.width / 14 / 25;
const ratioHelpIcon = win.width / 18 / 18;
const ratioSignOut = win.width / 14 / 512;
const ratioGlobe = win.width / 13 / 112;
let defaultLanguage = Localization.locale;
let controller;
export default function SettingGeneral(props) {
  const isFocused = useIsFocused();
  const [user, onUserChanged] = React.useState({});
  const [state, setState] = React.useState(false);
  async function onValueChanged(language) {
    switch (language.value) {
      case "ja":
        await AsyncStorage.setItem("language", "ja");
        i18n.locale = "ja";
        setState(!state);
        DevSettings.reload();
        break;
      case "en":
        AsyncStorage.setItem("language", "en");
        i18n.locale = "en";
        setState(!state);
        DevSettings.reload();
        break;
    }
  }
  AsyncStorage.getItem("language").then((language) => {
    if (language) {
      defaultLanguage = language;
    }
  });
  React.useEffect(() => {
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
  }, [isFocused]);
  return (
    <SafeAreaView>
      <CustomHeader
        onFavoritePress={() => {
          props.navigation.navigate("Favorite");
        }}
        onBack={() => {
          props.navigation.pop();
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
      <View style={{ marginTop: heightPercentageToDP("3%") }}>
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
            <Image
              style={styles.nextIcon}
              source={require("../assets/Images/next.png")}
            />
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
            <Image
              style={styles.nextIcon}
              source={require("../assets/Images/next.png")}
            />
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
            <Image
              style={styles.nextIcon}
              source={require("../assets/Images/next.png")}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={{
            flexDirection: "row",
            height: heightPercentageToDP("7.5%"),
            justifyContent: "flex-start",
            alignItems: "center",
            marginHorizontal: widthPercentageToDP("4%"),
          }}>
          <Image
            source={require("../assets/Images/globe.png")}
            style={{ width: win.width / 13, height: 107 * ratioGlobe }}
          />
          <DropDownPicker
            controller={(instance) => (controller = instance)}
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
              height: heightPercentageToDP("5%"),
              width: widthPercentageToDP("80%"),
              marginLeft: widthPercentageToDP("4%"),
            }}
            style={{
              backgroundColor: "#fafafa",
            }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            labelStyle={{
              fontSize: RFValue(12),
              color: Colors.D7CCA6,
            }}
            selectedtLabelStyle={{
              color: Colors.D7CCA6,
            }}
            dropDownStyle={{ backgroundColor: "#000000" }}
            onChangeItem={(item) => onValueChanged(item)}
          />
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            if(!controller.isOpen()){
              AsyncStorage.removeItem("user").then(() => {
                props.navigation.navigate("LoginScreen");
              });
            }
          }}
        >
          <View
            style={{
              flexDirection: "row",
              zIndex: 1,
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
      </View>
    </SafeAreaView>
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
    zIndex: 2
  },
  nextIcon: {
    width: win.width / 38,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
  },
  textInLeftContainer: {
    marginLeft: widthPercentageToDP("12%"),
    position: "absolute",
    fontSize: RFValue(14),
    left: 0,
  },
});
