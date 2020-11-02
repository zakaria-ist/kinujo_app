import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
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
const win = Dimensions.get("window");
const ratioKinujo = win.width / 4 / 151;

export default function ReceiptView(props) {
  return (
    <SafeAreaView>
      <CustomHeader
        onFavoriteChanged="noFavorite"
        text={Translate.t("invoiceIssue")}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        onBack={() => props.navigation.pop()}
      />
      <CustomSecondaryHeader
        name="髪長絹子 さん"
        accountType={Translate.t("storeAccount")}
      />
      <View style={styles.receiptEditingContainer}>
        <Text style={{ fontSize: RFValue(16) }}>領収証</Text>
        <View style={styles.invoiceInputContainer}>
          <Text style={{ fontSize: RFValue(24) }}>髪長絹子</Text>
          <Text
            style={{
              fontSize: RFValue(18),
              marginLeft: widthPercentageToDP("3%"),
            }}
          >
            様
          </Text>
        </View>
        <Text style={styles.receivedMoneyText}>￥18,000 ー</Text>
        <Text
          style={{
            fontSize: RFValue(12),
            paddingVertical: heightPercentageToDP("1%"),
          }}
        >
          上記正に領収いたしました
        </Text>
        <View style={{ width: "100%", marginTop: heightPercentageToDP("5%") }}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.receiptEditingDetailsText}>
              {Translate.t("issueDate")} :{" "}
            </Text>
            <Text style={styles.receiptEditingDetailsText}>0000年00月00日</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.receiptEditingDetailsText}>
              {Translate.t("orderDate")} :{" "}
            </Text>
            <Text style={styles.receiptEditingDetailsText}>0000年00月00日</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.receiptEditingDetailsText}>
              {Translate.t("orderNumber")} :{" "}
            </Text>
            <Text style={styles.receiptEditingDetailsText}>A-0000000A</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.receiptEditingDetailsText}>
              {Translate.t("productName")} :{" "}
            </Text>
            <Text style={styles.receiptEditingDetailsText}>
              KINUJO W-world widemodel-
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.receiptEditingDetailsText}>
              {Translate.t("seller")} :{" "}
            </Text>
            <Text style={styles.receiptEditingDetailsText}>
              KINUJO ONLINE STORE
            </Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.receiptEditingDetailsText}>
              {Translate.t("deliveryAddress")} :{" "}
            </Text>
            <Text style={styles.receiptEditingDetailsText}>髪長絹子</Text>
          </View>
          <Text style={styles.receiptEditingDetailsText}>000-0000</Text>
          <Text style={styles.receiptEditingDetailsText}>
            東京都〇〇区△△0-0-0
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.receiptEditingDetailsText}>
              {Translate.t("paymentMethod")} :{" "}
            </Text>
            <Text style={styles.receiptEditingDetailsText}>
              AmericanExpress
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
            paddingBottom: heightPercentageToDP("1%"),
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
    borderWidth: 2,
    borderColor: "#dddddd",
    backgroundColor: "white",
    paddingHorizontal: widthPercentageToDP("10%"),
    height: heightPercentageToDP("5%"),
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
    paddingBottom: heightPercentageToDP("9%"),
    marginHorizontal: widthPercentageToDP("3%"),
    paddingTop: widthPercentageToDP("3%"),
    alignItems: "center",
  },
  receiptEditingDetailsText: {
    fontSize: RFValue(12),
  },
});
