import React, { useState } from "react";
import { InteractionManager } from 'react-native';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import { Colors } from "../assets/Colors.js";
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
import Format from "../lib/format";
import Next from "../assets/icons/nextArrow.svg";
import Shop from "../assets/icons/shop.svg";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
const db = firebase.firestore();
const format = new Format();
let userId;
var kanjidate = require("kanjidate");

const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioStoreIcon = win.width / 12 / 20;
const ratioNext = win.width / 38 / 8;

export default function PurchaseHistoryDetails(props) {
  let initImage = props.route.params.image || [];
  let orderDate = props.route.params.orderDate || "";
  const [order, onOrderChanged] = useStateIfMounted({});
  const [loaded, onLoaded] = useStateIfMounted(false);

  Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    var H = this.getHours();
    var M = this.getMinutes();
  
    return [this.getFullYear(), '-',
            (mm>9 ? '' : '0') + mm, '-',
            (dd>9 ? '' : '0') + dd, ' ', H, ':', M
           ].join('');
  };

  // if (!loaded) {
    React.useEffect(() => {
      InteractionManager.runAfterInteractions(() => {
        AsyncStorage.getItem("user").then(function (url) {
          let urls = url.split("/");
          urls = urls.filter((url) => {
            return url;
          });
          userId = urls[urls.length - 1];
        });
        request
          .get(props.route.params.url)
          .then(function (response) {
            onOrderChanged(response.data);
            onLoaded(true);
            if (orderDate == "") {
              orderDate = new Date(response.data.order.created).yyyymmdd();
              let year = new Date(response.data.order.created).getFullYear();
              if (defaultLanguage == 'ja') {
                jOrderDate = kanjidate.format(kanjidate.f10, new Date(response.data.order.created));
                jOrderDate = jOrderDate.split('');
                jOrderDate.splice(0, 4);
                orderDate = year + jOrderDate.join('');
              }
            }
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
      });
    });
  // }

  function getProductImages(order) {
    return order.product_jan_code.horizontal.product_variety.product
      .productImages
      ? order.product_jan_code.horizontal.product_variety.product.productImages
      : order.product_jan_code.vertical.product_variety.product.productImages;
  }

  function redirectToChat(orderID, orderName) {
    let groupID;
    let groupName;
    let deleted = "delete_" + userId;
    db.collection("chat")
      .where("users", "array-contains", userId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docChanges().forEach((snapShot) => {
          let users = snapShot.doc.data().users;
          for (var i = 0; i < users.length; i++) {
            if (users[i] == orderID) {
              groupID = snapShot.doc.id;
            }
          }
        });
        if (groupID != null) {
          db.collection("chat")
            .doc(groupID)
            .set(
              {
                [deleted]: false,
              },
              {
                merge: true,
              }
            );
          console.log(orderName);
          console.log(groupID);
          props.navigation.navigate("ChatScreen", {
            groupID: groupID,
            groupName: orderName,
          });
        } else {
          let ownMessageUnseenField = "unseenMessageCount_" + userId;
          let friendMessageUnseenField = "unseenMessageCount_" + orderID;
          let ownTotalMessageReadField = "totalMessageRead_" + userId;
          let friendTotalMessageReadField = "totalMessageRead_" + orderID;
          db.collection("chat")
            .add({
              groupName: orderName,
              users: [userId, orderID],
              totalMessage: 0,
              [ownMessageUnseenField]: 0,
              [friendMessageUnseenField]: 0,
              [ownTotalMessageReadField]: 0,
              [friendTotalMessageReadField]: 0,
            })
            .then(function (docRef) {
              props.navigation.navigate("ChatScreen", {
                groupID: docRef.id,
                groupName: orderName,
              });
            });
        }
      });
  }
  return (
    <SafeAreaView>
      <CustomHeader
        text={Translate.t("purchaseHistory")}
        onFavoriteChanged="noFavorite"
        onBack={() => props.navigation.goBack()}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
      />
      <CustomSecondaryHeader props={props}
        name={
          order && order.order
            ? order.order.purchaser.real_name
              ? order.order.purchaser.real_name
              : order.order.purchaser.nickname
            : ""
        }
        accountType={
          order && order.order
            ? order.order.purchaser.is_seller
              ? Translate.t("storeAccount")
              : ""
            : ""
        }
      />
      <View>
        <View style={styles.productInformationContainer}>
          {initImage.length > 0 ? (
            <Image
              style={{
                height: RFValue(45),
                width: RFValue(45),
              }}
              source={{ uri: initImage ? initImage : getProductImages(order)[0].image.image }}
            />
          ) : (
            <Image
              style={{
                height: RFValue(45),
                width: RFValue(45),
              }}
              source={require("../assets/Images/cover_img.jpg")}
            />
          )}
          {/* <Image
            style={{
              height: RFValue(45),
              width: RFValue(45),
            }}
            source={require("../assets/Images/cover_img.jpg")}
          /> */}
          <View
            style={{
              marginLeft: widthPercentageToDP("3%"),
              // backgroundColor: "orange",
              width: widthPercentageToDP("75%"),
            }}
          >
            <Text style={styles.productInformationText}>
              {order && order.order
                ? order.product_jan_code.horizontal
                  ? order.product_jan_code.horizontal.product_variety.product
                      .name
                  : order.product_jan_code.vertical.product_variety.product.name
                : ""}
            </Text>
            <Text style={styles.productInformationText}>
              {order && order.order ? format.separator(order.order.total_amount) : 0} 円
            </Text>
          </View>
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationText}>
            {Translate.t("storeName")}
          </Text>
          <Text style={styles.productSourceText}>
            {order && order.order
              ? order.order.seller.store_name
                ? order.order.seller.store_name
                : order.order.seller.nickname
              : ""}
          </Text>
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationText}>
            {Translate.t("orderDate")}
          </Text>
          <Text style={styles.productSourceText}>
            {order && order.order ? orderDate : ""}
            {/* {order && order.order
              ? kanjidate.format(kanjidate.f10,
                  // "{Y:4}" +
                  //   Translate.t("年") +
                  //   "{M:2}" +
                  //   Translate.t("月") +
                  //   "{D:2}" +
                  //   Translate.t("日") +
                  //   " {h:2}:{M:2}",
                  new Date(order.order.created)
                )
              : ""} */}
          </Text>
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationText}>
            {Translate.t("orderNumber")}
          </Text>
          <Text style={styles.productSourceText}>
            {order && order.order ? order.order.id : ""}
          </Text>
        </View>
        <TouchableWithoutFeedback
          onPress={() =>
            redirectToChat(
              order.id,
              order.order.seller.store_name
                ? order.order.seller.store_name
                : order.order.seller.nickname
            )
          }
        >
          <View style={styles.productInformationContainer}>
            <Text style={styles.productInformationText}>
              {Translate.t("inquiry")}
            </Text>
            <Next
              style={styles.nextIcon}
              // source={require("../assets/Images/next.png")}
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate("ReceiptEditing", {
              url: props.route.params.url,
            });
          }}
        >
          <View style={styles.productInformationContainer}>
            <Text style={styles.productInformationText}>
              {Translate.t("invoiceIssue")}
            </Text>
            <Next
              style={styles.nextIcon}
              // source={require("../assets/Images/next.png")}
            />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationText}>
            {Translate.t("shippingStatus")}
          </Text>
          <Text
            style={{ position: "absolute", right: widthPercentageToDP("3%"), fontSize: RFValue(12) }}
          >
            {order && order.order ? (order.order.status == 1 ? Translate.t("shippingProcess") : Translate.t("shippingComplete")) : ""}
          </Text>
        </View>
        <View style={styles.productInformationContainer}>
          <Text style={styles.productInformationText}>
            {Translate.t("cancel")}
          </Text>
          <Text
            style={{ position: "absolute", right: widthPercentageToDP("3%"), fontSize: RFValue(12) }}
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
    // backgroundColor: "orange",
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
    paddingBottom: heightPercentageToDP("2%"),
    width: widthPercentageToDP("55%"),
    // backgroundColor: "blue",
    fontSize: RFValue(12),
    left: 0,
    marginLeft: widthPercentageToDP("35%"),
    position: "absolute",
  },
  nextIcon: {
    width: RFValue(15),
    height: RFValue(15),
    position: "absolute",
    right: widthPercentageToDP("3%"),
  },
});
