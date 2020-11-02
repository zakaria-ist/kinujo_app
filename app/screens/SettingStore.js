import React from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeader";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";

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
export default function SettingStore(props) {
  const [user, onUserChanged] = React.useState({});

  if (!user.url) {
    AsyncStorage.getItem("user").then(function (url) {
      request
        .get(url)
        .then(function (response) {
          onUserChanged(response.data);
        })
        .catch(function (error) {
          if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
            alert.warning(error.response.data[Object.keys(error.response.data)[0]][0]);
          }
        });
    });
  }
  return (
    <SafeAreaView>
      <CustomHeader
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onBack={() => {
          props.navigation.pop();
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
        name={user.real_name ? user.real_name : user.nickname}
        accountType={Translate.t("storeAccount")}
      />
      <View style={{ marginTop: heightPercentageToDP("1%") }}>
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
          onPress={() => props.navigation.navigate("SalesManagement", {
            is_store: 1
          })}
        >
          <View style={styles.totalSalesContainer}>
            <Text
              style={{
                fontSize: RFValue(13),
                marginLeft: widthPercentageToDP("3%"),
              }}
            >
              売上合計 :
            </Text>
            <Text
              style={{
                fontSize: RFValue(13),
                marginLeft: widthPercentageToDP("1%"),
              }}
            >
              {user.profit}円
            </Text>
            <Image
              style={{
                width: win.width / 38,
                height: 15 * ratioNext,
                position: "absolute",
                right: 0,
                alignSelf: "center",
                marginRight: widthPercentageToDP("3%"),
              }}
              source={require("../assets/Images/next.png")}
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
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
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
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
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
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
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
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
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
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
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
              <Image
                style={styles.nextIcon}
                source={require("../assets/Images/next.png")}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </SafeAreaView>
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
    width: win.width / 38,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
  },
  textInLeftContainer: {
    marginLeft: widthPercentageToDP("12%"),
    fontSize: RFValue(13),
    position: "absolute",
    left: 0,
  },
});
