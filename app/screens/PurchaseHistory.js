import React, { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  Dimensions,
  DrawerLayoutAndroid,
  ScrollView,
  TouchableWithoutFeedback,
  Button,
  Animated,
  SafeAreaView,
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
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
const db = firebase.firestore();
var kanjidate = require("kanjidate");
import Format from "../lib/format";
const format = new Format();
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioStoreIcon = win.width / 12 / 20;
const ratioNext = win.width / 38 / 8;
const ratioSearch = win.width / 24 / 19;
const ratioCancel = win.width / 42 / 15;
let userId;
export default function PurchaseHistory(props) {
  const [orders, onOrdersChanged] = React.useState({});
  const [orderHtml, onOrderHtmlChanged] = React.useState([]);
  const [user, onUserChanged] = React.useState({});
  const [loaded, onLoaded] = React.useState(false);
  const [yearHtml, onYearHtmlChanged] = React.useState(<View></View>);
  const [years, onYearChanged] = React.useState(<View></View>);
  const right = useRef(new Animated.Value(widthPercentageToDP("-80%"))).current;

  function processOrderHtml(props, orders, status = "") {
    let tmpOrderHtml = [];
    for (var i = 0; i < orders.length; i++) {
      let order = orders[i];
      console.log(order);
      tmpOrderHtml.push(
        <TouchableWithoutFeedback key={i}>
          <View>
            <Text
              style={{
                fontSize: RFValue(12),
                marginTop: heightPercentageToDP("1.5%"),
              }}
            >
              {kanjidate.format(
                "{Y:4}年{M:2}月{D:2}日 ({G:1}) {h:2}:{M:2}",
                new Date(order.order.created)
              )}
            </Text>
            <View style={styles.purchaseHistoryProductContainer}>
              <View style={styles.productInformationContainer}>
                <Image
                  style={{
                    height: RFValue(45),
                    width: RFValue(45),
                  }}
                  source={require("../assets/Images/profileEditingIcon.png")}
                />
                <View
                  style={{
                    marginLeft: widthPercentageToDP("3%"),

                    width: widthPercentageToDP("57%"),
                  }}
                >
                  <Text style={styles.productInformationText}>
                    {order.product_jan_code.horizontal
                      ? order.product_jan_code.horizontal.product_variety
                          .product.name
                      : order.product_jan_code.vertical.product_variety.product
                          .name}
                  </Text>
                  <Text>{format.separator(order.unit_price)} 円</Text>
                </View>
                <Image
                  style={styles.nextIcon}
                  source={require("../assets/Images/next.png")}
                />
              </View>

              <TouchableWithoutFeedback
                onPress={() => {
                  lastId = 0;
                  lastOrderReceipt = {};
                  props.navigation.navigate("PurchaseHistoryDetails", {
                    url: order.url,
                  });
                }}
              >
                <View style={styles.productInformationContainer}>
                  <Text style={styles.productInformationText}>
                    {Translate.t("detail")}
                  </Text>
                  <Image
                    style={styles.nextIcon}
                    source={require("../assets/Images/next.png")}
                  />
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() =>
                  redirectToChat(order.id, order.order.seller.shop_name)
                }
              >
                <View style={styles.productInformationContainer}>
                  <Text style={styles.productInformationText}>
                    {Translate.t("inquiry")}
                  </Text>
                  <Image
                    style={styles.nextIcon}
                    source={require("../assets/Images/next.png")}
                  />
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.productInformationContainer}>
                <Image
                  style={{
                    width: win.width / 12,
                    height: 17 * ratioStoreIcon,
                  }}
                  source={require("../assets/Images/purchaseHistoryProductStoreIcon.png")}
                />
                <Text
                  style={{
                    fontSize: RFValue(12),
                    marginLeft: widthPercentageToDP("3%"),
                  }}
                >
                  {order.order.seller.shop_name
                    ? order.order.seller.shop_name
                    : order.order.seller.nickname}
                </Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return tmpOrderHtml;
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
          props.navigation.push("ChatScreen", {
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
              props.navigation.push("ChatScreen", {
                groupID: docRef.id,
                groupName: orderName,
              });
            });
        }
      });
  }
  function loadOrder(userId, type) {
    request
      .get("orderProducts/" + userId + "/")
      .then((response) => {
        let tmpYears = [];
        response.data.orderProducts.map((order) => {
          let year = kanjidate.format("{Y:4}", new Date(order.created));
          if (!tmpYears.includes(year)) {
            tmpYears.push(year);
          }
        });
        let tmpOrderProducts = response.data.orderProducts.filter((order) => {
          let year = kanjidate.format("{Y:4}", new Date(order.created));
          return year == type || type == "all";
        });
        onOrdersChanged(tmpOrderProducts);
        onYearHtmlChanged(processYearHtml(tmpYears));
        onOrderHtmlChanged(processOrderHtml(props, tmpOrderProducts, ""));
        onLoaded(true);
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
        onLoaded(true);
      });
  }
  function load() {
    AsyncStorage.getItem("user").then(function (url) {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      userId = urls[urls.length - 1];

      if (!user.url) {
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
      }

      if (!loaded) {
        loadOrder(userId, "all");
      }
    });
  }

  function processYearHtml(years) {
    let tmpYearHtml = [];
    years.map((year) => {
      tmpYearHtml.push(
        <TouchableWithoutFeedback
          key={year}
          onPress={() => {
            AsyncStorage.getItem("user").then(function (url) {
              let urls = url.split("/");
              urls = urls.filter((url) => {
                return url;
              });
              let userId = urls[urls.length - 1];

              Animated.timing(right, {
                toValue: widthPercentageToDP("-80%"),
                duration: 500,
                useNativeDriver: false,
              }).start();
              loadOrder(userId, year);
            });
          }}
        >
          <View style={styles.dateTabContainer}>
            <Text style={styles.dateTabText}>{year}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    });
    return tmpYearHtml;
  }

  React.useEffect(() => {
    load();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableWithoutFeedback
        onPress={() =>
          Animated.timing(right, {
            toValue: widthPercentageToDP("-80%"),
            duration: 500,
            useNativeDriver: false,
          }).start()
        }
      >
        <View>
          <CustomHeader
            onFavoriteChanged="noFavorite"
            onBack={() => {
              props.navigation.pop();
            }}
            onPress={() => {
              props.navigation.navigate("Cart");
            }}
            text={Translate.t("purchaseHistory")}
          />
          <CustomSecondaryHeader
            name={user.nickname}
            accountType={
              props.route.params.is_store ? Translate.t("storeAccount") : ""
            }
          />
          <Animated.View
            style={{
              zIndex: 1,
              height: heightPercentageToDP("100%"),
              alignSelf: "center",
              width: widthPercentageToDP("80%"),
              position: "absolute",
              right: right,
              backgroundColor: "white",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                borderBottomWidth: 1,
                borderBottomColor: Colors.D7CCA6,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: RFValue(14),
                  paddingTop: heightPercentageToDP("2%"),
                  paddingBottom: heightPercentageToDP("2%"),
                }}
              >
                {Translate.t("narrowDown")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                paddingVertical: heightPercentageToDP("2%"),
                backgroundColor: "white",
                borderBottomWidth: 1,
                borderBottomColor: Colors.D7CCA6,
                marginHorizontal: widthPercentageToDP("1.5%"),
              }}
            >
              <Image
                style={{
                  width: win.width / 24,
                  height: ratioSearch * 19,
                  position: "absolute",
                  left: 0,
                  marginLeft: widthPercentageToDP("4%"),
                  alignSelf: "center",
                }}
                source={require("../assets/Images/searchIcon.png")}
              />
              <TextInput
                placeholder="Product Name"
                style={{
                  paddingVertical: heightPercentageToDP("1%"),
                  width: "100%",
                  backgroundColor: Colors.F6F6F6,
                  fontSize: RFValue(14),
                  borderWidth: 1,
                  paddingLeft: widthPercentageToDP("10%"),
                  borderRadius: 5,
                  borderColor: "transparent",
                }}
              />
              <Image
                style={{
                  width: win.width / 24,
                  height: ratioSearch * 19,
                  position: "absolute",
                  right: 0,
                  marginRight: widthPercentageToDP("4%"),
                  alignSelf: "center",
                }}
                source={require("../assets/Images/cancelIcon.png")}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: heightPercentageToDP("2%"),
                marginHorizontal: widthPercentageToDP("1.5%"),
                borderBottomWidth: 1,
                borderBottomColor: Colors.D7CCA6,
              }}
            >
              <Text style={styles.dateTabText}>Release Date</Text>
              <Image
                style={{
                  width: win.width / 24,
                  height: ratioSearch * 8,
                  position: "absolute",
                  right: 0,
                  marginRight: widthPercentageToDP("4%"),
                  alignSelf: "center",
                }}
                source={require("../assets/Images/upIcon.png")}
              />
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                onLoaded(false);

                AsyncStorage.getItem("user").then(function (url) {
                  let urls = url.split("/");
                  urls = urls.filter((url) => {
                    return url;
                  });
                  let userId = urls[urls.length - 1];
                  Animated.timing(right, {
                    toValue: widthPercentageToDP("-80%"),
                    duration: 500,
                    useNativeDriver: false,
                  }).start();
                  loadOrder(userId, "past_6_months");
                });
              }}
            >
              <View style={styles.dateTabContainer}>
                <Text style={styles.dateTabText}>Past 6 Month</Text>
              </View>
            </TouchableWithoutFeedback>
            {yearHtml}
            <View
              style={{
                alignItems: "flex-start",
                borderBottomWidth: 1,
                borderBottomColor: Colors.D7CCA6,
                paddingVertical: heightPercentageToDP("1.5%"),
              }}
            >
              {/* <Text
              style={{
                marginLeft: widthPercentageToDP("8%"),
                borderBottomWidth: 1,
                borderBottomColor: "blue",
                color: "blue",
                fontSize: RFValue(14),
                marginRight: widthPercentageToDP("18%"),
              }}
            >
              2015 年 3月以前
            </Text> */}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                marginTop: heightPercentageToDP("30%"),
                marginHorizontal: widthPercentageToDP("1%"),
                justifyContent: "space-between",
                backgroundColor: "white",
              }}
            >
              {/* <Image
              style={{
                width: win.width / 42,
                height: ratioCancel * 15,
                position: "absolute",
                left: 0,
                marginLeft: widthPercentageToDP("3%"),
              }}
              source={require("../assets/Images/blackCancelIcon.png")}
            /> */}
              {/* <Text
              style={{
                fontSize: RFValue(14),
                marginLeft: widthPercentageToDP("8%"),
                marginBottom: heightPercentageToDP(".3%"),
              }}
            >
              Cancel all conditions
            </Text>
            <TouchableOpacity>
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  borderColor: Colors.CECECE,
                  padding: widthPercentageToDP("2%"),
                  paddingHorizontal: widthPercentageToDP("3%"),
                  marginRight: widthPercentageToDP("3%"),
                }}
              >
                <Text style={styles.dateTabText}>Done</Text>
              </View>
            </TouchableOpacity> */}
            </View>
          </Animated.View>
          <ScrollView
          // style={{ flexGrow: 1, marginBottom: heightPercentageToDP("25%") }}
          >
            <View
              style={{
                marginHorizontal: widthPercentageToDP("5%"),
                marginBottom: heightPercentageToDP("25%"),
              }}
            >
              <TouchableWithoutFeedback
                onPress={() =>
                  Animated.timing(right, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: false,
                  }).start()
                }
              >
                <View style={styles.narrowDownContainer}>
                  <Text
                    style={{
                      fontSize: RFValue(12),
                      marginLeft: widthPercentageToDP("3%"),
                    }}
                  >
                    {Translate.t("narrowDown")}
                  </Text>
                  <Image
                    style={{
                      width: win.width / 50,
                      height: 15 * ratioNext,
                      position: "absolute",
                      right: 0,
                      marginRight: widthPercentageToDP("3%"),
                    }}
                    source={require("../assets/Images/next.png")}
                  />
                </View>
              </TouchableWithoutFeedback>
              {orderHtml}
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  narrowDownContainer: {
    flexDirection: "row",
    borderWidth: 1,
    height: heightPercentageToDP("4%"),
    alignItems: "center",
    backgroundColor: Colors.F6F6F6,
    borderColor: Colors.D7CCA6,
    marginTop: heightPercentageToDP("3%"),
  },
  nextIcon: {
    paddingBottom: heightPercentageToDP("3%"),
    width: win.width / 50,
    height: 15 * ratioNext,
    position: "absolute",
    right: 0,
  },
  purchaseHistoryProductContainer: {
    // backgroundColor: "orange",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.D7CCA6,
    backgroundColor: Colors.F6F6F6,
    paddingBottom: widthPercentageToDP("3%"),
    marginTop: heightPercentageToDP("1%"),
  },
  productInformationContainer: {
    // backgroundColor: "orange",
    flexDirection: "row",
    alignItems: "center",
    marginTop: heightPercentageToDP("2%"),
    marginHorizontal: widthPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.CECECE,
    paddingBottom: heightPercentageToDP("2%"),
  },
  productInformationText: {
    fontSize: RFValue(12),
  },
  navigationContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
    padding: 8,
  },
  dateTabContainer: {
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.D7CCA6,
    paddingVertical: heightPercentageToDP("1.5%"),
    marginHorizontal: widthPercentageToDP("8%"),
  },
  dateTabText: {
    fontSize: RFValue(14),
  },
});
