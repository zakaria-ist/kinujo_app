import React, { useState } from "react";
import { StyleSheet, Text, Image, View, Dimensions, TouchableWithoutFeedback} from "react-native";
import { Colors } from "../assets/Colors.js";
import { SafeAreaView } from "react-navigation";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
var kanjidate = require("kanjidate");

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioStoreIcon = win.width / 12 / 20;
const ratioNext = win.width / 38 / 8;

export default function PurchaseHistoryDetails(props) {
  const [order, onOrderChanged] = React.useState({});
  const [loaded, onLoaded] = React.useState(false);
  if(!loaded){
    request
    .get(props.route.params.url)
    .then(function (response) {
      onOrderChanged(response.data);
      onLoaded(true);
    })
    .catch(function (error) {
      onLoaded(true);
      if(error && error.response && error.response.data && Object.keys(error.response.data).length > 0){
        alert.warning(error.response.data[Object.keys(error.response.data)[0]][0] + "(" + Object.keys(error.response.data)[0] + ")");
      }
    });
  }
  return (
    <SafeAreaView>
      <CustomHeader
        text={Translate.t("purchaseHistory")}
        onFavoriteChanged="noFavorite"
        onBack={() => props.navigation.pop()}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
      />
      <CustomSecondaryHeader
        name=
        {order && order.order ? (order.order.purchaser.real_name ? 
        order.order.purchaser.real_name :
        order.order.purchaser.nickname) : ""}
        accountType={
          order && order.order  ? (
            order.order.purchaser.is_seller ? Translate.t("storeAccount") : ""
          ) : ""
        }
      />
      <View>
        <View style={styles.productInformationContainer}>
          <Image
            style={{
              height: RFValue(45),
              width: RFValue(45),
            }}
            source={require("../assets/Images/profileEditingIcon.png")}
          />
          <View style={{ marginLeft: widthPercentageToDP("3%") }}>
            <Text style={styles.productInformationText}>
                  {order && order.order ? (order.product_jan_code.horizontal ? 
                  order.product_jan_code.horizontal.product_variety.product.name :
                  order.product_jan_code.vertical.product_variety.product.name) : ""
                }
            </Text>
            <Text style={styles.productInformationText}>{order.unit_price}円</Text>
          </View>
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationText}>
            {Translate.t("storeName")}
          </Text>
          <Text style={styles.productSourceText}>
          {order && order.order ? (order.order.seller.store_name ? 
            order.order.seller.store_name :
            order.order.seller.nickname) : ""}
          </Text>
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationText}>
            {Translate.t("orderDate")}
          </Text>
          <Text style={styles.productSourceText}>
            {order && order.order ? (order.order.created) : ""}
          </Text>
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationText}>
            {Translate.t("orderNumber")}
          </Text>
          <Text style={styles.productSourceText}>
            {order && order.order ? (order.id) : ""}</Text>
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationText}>
            {Translate.t("inquiry")}
          </Text>
          <Image
            style={styles.nextIcon}
            source={require("../assets/Images/next.png")}
          />
        </View>
        <TouchableWithoutFeedback onPress = {
          () => {
            props.navigation.navigate("ReceiptView", {
              "url" : props.route.params.url
            })
          }
        }>
          <View style={styles.productInformationContainer}>
            <Text style={styles.productInformationText}>
              {Translate.t("invoiceIssue")}
            </Text>
            <Image
              style={styles.nextIcon}
              source={require("../assets/Images/next.png")}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationText}>
            {Translate.t("shippingStatus")}
          </Text>
          <Text
            style={{ position: "absolute", right: 0, fontSize: RFValue(12) }}
          >
            {order && order.order ? (order.status) : ""}
          </Text>
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationText}>
            {Translate.t("cancel")}
          </Text>
          <Text
            style={{ position: "absolute", right: 0, fontSize: RFValue(12) }}
          >
            {Translate.t("no")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  productInformationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightPercentageToDP("2%"),
    marginHorizontal: widthPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.F0EEE9,
    paddingBottom: heightPercentageToDP("2%"),
  },
  productInformationText: {
    fontSize: RFValue(12),
  },
  productSourceText: {
    fontSize: RFValue(12),
    marginLeft: widthPercentageToDP("35%"),
    position: "absolute",
  },
  nextIcon: {
    width: win.width / 38,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
  },
});
