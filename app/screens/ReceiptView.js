import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Colors } from "../assets/Colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomSecondaryHeader from "../assets/CustomComponents/CustomSecondaryHeader";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import Format from "../lib/format";
const format = new Format();
var kanjidate = require("kanjidate");
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioKinujo = win.width / 4 / 151;

export default function ReceiptView(props) {
  const [user, onUserChanged] = React.useState({});
  const [order, onOrderChanged] = React.useState({});
  const [loaded, onLoaded] = React.useState(false);
  const [orderReceipt, onOrderReceiptChanged] = React.useState({});
  const issueName = props.route.params.issueName;
  if (!loaded) {
    request
      .get(props.route.params.url)
      .then(function (response) {
        onOrderChanged(response.data);

        lastId = 0;
        lastOrderReceipt = {};
        response.data.order.orderReceipts.map((tmpOrderReceipt) => {
          if (tmpOrderReceipt.id > lastId) {
            lastOrderReceipt = tmpOrderReceipt;
            lastId = tmpOrderReceipt.id;
          }
        });
        onOrderReceiptChanged(lastOrderReceipt);

        onLoaded(true);
      })
      .catch(function (error) {
        onLoaded(true);
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
  }

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
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ paddingBottom: heightPercentageToDP("5%") }}>
        <CustomHeader
          onFavoriteChanged="noFavorite"
          text={Translate.t("invoiceIssue")}
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
          onBack={() => props.navigation.goBack()}
        />
        <CustomSecondaryHeader
          name={user.nickname}
          accountType={Translate.t("storeAccount")}
        />
        <View style={styles.receiptEditingContainer}>
          <Text style={{ fontSize: RFValue(16) }}>
            {Translate.t("invoice")}
            {lastOrderReceipt.is_copy ? Translate.t("reissue") : ""}
          </Text>
          <View style={styles.invoiceInputContainer}>
            <Text style={{ fontSize: RFValue(24) }}>{issueName}</Text>
            <Text
              style={{
                fontSize: RFValue(14),
                marginLeft: widthPercentageToDP("3%"),
              }}
            >
              {Translate.t("nameTitle")}
            </Text>
          </View>
          <Text style={styles.receivedMoneyText}>
            {format.separator(order.total_price)} 円
          </Text>
          <Text
            style={{
              fontSize: RFValue(12),
              paddingVertical: heightPercentageToDP("1%"),
            }}
          >
            {Translate.t("justReceivedAbove")}
          </Text>
          <View
            style={{ width: "100%", marginTop: heightPercentageToDP("5%") }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.receiptEditingDetailsText}>
                {Translate.t("issueDate")} :{" "}
              </Text>
              <Text style={styles.receiptEditingDetailsText}>
                {kanjidate.format(
                  "{Y:4}"+Translate.t("年")+"{M:2}"+Translate.t("月")+"{D:2}"+Translate.t("日")+"",
                  new Date(order.created)
                )}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.receiptEditingDetailsText}>
                {Translate.t("orderDate")} :{" "}
              </Text>
              <Text style={styles.receiptEditingDetailsText}>
                {kanjidate.format(
                  "{Y:4}"+Translate.t("年")+"{M:2}"+Translate.t("月")+"{D:2}"+Translate.t("日")+"",
                  new Date(order.created)
                )}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.receiptEditingDetailsText}>
                {Translate.t("orderNumber")} :{" "}
              </Text>
              <Text style={styles.receiptEditingDetailsText}>
                {order ? order.id : ""}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                // backgroundColor: "orange",
                width: widthPercentageToDP("80%"),
              }}
            >
              <Text numberOfLines={1} style={styles.receiptEditingDetailsText}>
                {Translate.t("productName")} :{" "}
              </Text>
              <Text numberOfLines={1} style={styles.receiptEditingProductText}>
                {order && order.product_jan_code
                  ? order.product_jan_code.horizontal
                    ? order.product_jan_code.horizontal.product_variety.product
                        .name
                    : order.product_jan_code.vertical.product_variety.product
                        .name
                  : ""}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.receiptEditingDetailsText}>
                {Translate.t("seller")} :{" "}
              </Text>
              <Text style={styles.receiptEditingDetailsText}>
                {order && order.order ? order.order.seller.nickname : ""}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.receiptEditingDetailsText}>
                {Translate.t("deliveryAddress")} :{" "}
              </Text>
              <Text style={styles.receiptEditingDetailsText}>
                {order && order.order ? order.order.name : ""}
              </Text>
            </View>
            <Text style={styles.receiptEditingDetailsText}>
              {order && order.order ? order.order.tel : ""}
            </Text>
            <Text style={styles.receiptEditingDetailsText}>
              {order && order.order ? order.order.address1 : ""}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.receiptEditingDetailsText}>
                {Translate.t("paymentMethod")} :{" "}
              </Text>
              <Text style={styles.receiptEditingDetailsText}>
                {order && order.order ? order.order.payment : ""}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.receiptEditingDetailsText}>
                {Translate.t("partOfTheCardNumber")} :
              </Text>
              <Text style={styles.receiptEditingDetailsText}>****</Text>
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              marginRight: widthPercentageToDP("5%"),
              marginTop: heightPercentageToDP("19%"),
            }}
          >
            <Image
              style={{ width: win.width / 4, height: 44 * ratioKinujo }}
              source={require("../assets/Images/kinujo.png")}
            />
            <Text style={styles.receiptEditingDetailsText}>
              東京都〇〇区△△0-0-0
            </Text>
            <Text style={styles.receiptEditingDetailsText}>03-0000-0000</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  invoiceInputContainer: {
    flexDirection: "row",
    marginTop: heightPercentageToDP("2%"),
    justifyContent: "center",
    alignItems: "center",
  },
  invoiceTextInput: {
    fontSize: RFValue(11),
    // marginLeft: widthPercentageToDP("5%"),
    borderWidth: 2,
    borderColor: "#dddddd",
    backgroundColor: "white",
    paddingLeft: widthPercentageToDP("3%"),
    width: widthPercentageToDP("55%"),
    // backgroundColor: "orange",
    // paddingHorizontal: widthPercentageToDP("10%"),
    height: heightPercentageToDP("6%"),
  },
  receivedMoneyText: {
    fontSize: RFValue(16),
    marginTop: heightPercentageToDP("1%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.deepGrey,
    paddingHorizontal: widthPercentageToDP("15%"),
    paddingVertical: heightPercentageToDP("1%"),
  },

  issueButtonContainer: {
    backgroundColor: Colors.E6DADE,
    marginHorizontal: widthPercentageToDP("30%"),
    paddingVertical: heightPercentageToDP("1.5%"),
    alignItems: "center",
    borderRadius: 5,
    marginTop: heightPercentageToDP("3%"),
  },
  issueButtonText: {
    color: "white",
    fontSize: RFValue(12),
  },
  issueInvoiceWarningText: {
    fontSize: RFValue(10),
    alignSelf: "center",
    marginTop: heightPercentageToDP("2%"),
  },
  receiptEditingContainer: {
    marginTop: heightPercentageToDP("1.5%"),
    borderWidth: 1,
    borderColor: Colors.grey,
    padding: widthPercentageToDP("3%"),
    paddingBottom: heightPercentageToDP("15%"),
    marginHorizontal: widthPercentageToDP("3%"),
    paddingTop: widthPercentageToDP("3%"),
    alignItems: "center",
  },
  receiptEditingDetailsText: {
    fontSize: RFValue(12),
  },
  receiptEditingProductText: {
    // backgroundColor: "orange",
    fontSize: RFValue(12),
    width: widthPercentageToDP("65%"),
  },
});
