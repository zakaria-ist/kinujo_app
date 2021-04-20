import React, { useRef, useState } from "react";
import { InteractionManager } from 'react-native';
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
  TextInput,
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import Spinner from "react-native-loading-spinner-overlay";
import { useIsFocused } from "@react-navigation/native";
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
import firebase from "firebase/app";
import Next from "../assets/icons/nextArrow.svg";
import Search from "../assets/icons/search.svg";
import "firebase/firestore";
import { firebaseConfig } from "../../firebaseConfig.js";
import Shop from "../assets/icons/shop.svg";
const db = firebase.firestore();
var kanjidate = require("kanjidate");
import Format from "../lib/format";
import { search } from "react-native-country-picker-modal/lib/CountryService";
const format = new Format();
const request = new Request();
const alert = new CustomAlert();
const win = Dimensions.get("window");
const ratioStoreIcon = win.width / 12 / 20;
const ratioNext = win.width / 38 / 8;
const ratioSearch = win.width / 24 / 19;
const ratioCancel = win.width / 25 / 15;
let userId;
export default function PurchaseHistory(props) {
  const isFocused = useIsFocused();
  const [orders, onOrdersChanged] = useStateIfMounted({});
  const [orderHtml, onOrderHtmlChanged] = useStateIfMounted([]);
  const [user, onUserChanged] = useStateIfMounted({});
  const [loaded, onLoaded] = useStateIfMounted(false);
  const [showYears, onshowYears] = useStateIfMounted(true);
  const [yearHtml, onYearHtmlChanged] = useStateIfMounted(<View></View>);
  const [years, onYearChanged] = useStateIfMounted(<View></View>);
  const [searchText, onSearchTextChanged] = useStateIfMounted("");
  const right = useRef(new Animated.Value(widthPercentageToDP("-80%"))).current;
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);
  function getProductImages(order) {
    return order.product_jan_code.horizontal.product_variety.product
      .productImages
      ? order.product_jan_code.horizontal.product_variety.product.productImages
      : order.product_jan_code.vertical.product_variety.product.productImages;
  }
  function processOrderHtml(props, orders, searchTxt, status = "") {
    if (searchTxt != "") {
      orders = orders.filter((order) => {
        if (order.product_jan_code.horizontal) {
          return (
            order.product_jan_code.horizontal.product_variety.product.name
              .toLowerCase()
              .indexOf(searchTxt.toLowerCase()) >= 0
          );
        } else if (order.product_jan_code.vertical) {
          return (
            order.product_jan_code.vertical.product_variety.product.name
              .toLowerCase()
              .indexOf(searchTxt.toLowerCase()) >= 0
          );
        }
        return false;
      });
    }

    let tmpOrderHtml = [];
    for (var i = 0; i < orders.length; i++) {
      let order = orders[i];
      // if (getProductImages(order).length > 0) {
      //   console.log(getProductImages(order)[0].image.image);
      // }

      tmpOrderHtml.push(
        <TouchableWithoutFeedback key={i}>
          <View>
            <Text
              style={{
                fontSize: RFValue(12),
                marginTop: heightPercentageToDP("1.5%"),
              }}
            >
              {kanjidate.format(kanjidate.f10,
                // "{Y:4}" +
                //   Translate.t("年") +
                //   "{M:2}" +
                //   Translate.t("月") +
                //   "{D:2}" +
                //   Translate.t("日") +
                //   " ",
                new Date(order.order.created)
              )}
              {/* (
              {Translate.t(
                kanjidate.format("{W:2}", new Date(order.order.created))
              )}
              ){kanjidate.format(" {h:2}:{M:2}", new Date(order.order.created))
              } */}
            </Text>
            <View style={styles.purchaseHistoryProductContainer}>
              <View style={styles.productInformationContainer}>
                {getProductImages(order).length > 0 ? (
                  <Image
                    style={{
                      height: RFValue(45),
                      width: RFValue(45),
                    }}
                    source={{ uri: getProductImages(order)[0].image.image }}
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
                  <Text>{format.separator(order.order.total_amount)} 円</Text>
                  {/* <Text>{format.separator(order.total_price)} 円</Text> */}
                </View>
                <View
                  style={{
                    position: "absolute",
                    right: 0,
                    marginRight: widthPercentageToDP("3%"),
                  }}
                >
                  <Next style={styles.nextIcon} />
                </View>
              </View>

              <TouchableWithoutFeedback
                onPress={() => {
                  lastId = 0;
                  lastOrderReceipt = {};
                  props.navigation.navigate("PurchaseHistoryDetails", {
                    url: order.url,
                    order: order,
                    image: getProductImages(order)[0].image.image
                  });
                }}
              >
                <View style={styles.productInformationContainer}>
                  <Text style={styles.productInformationText}>
                    {Translate.t("detail")}
                  </Text>
                  <View
                    style={{
                      position: "absolute",
                      right: 0,
                      marginRight: widthPercentageToDP("3%"),
                    }}
                  >
                    <Next style={styles.nextIcon} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() =>
                  redirectToChat(
                    order.order.seller.id,
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
                  <View
                    style={{
                      position: "absolute",
                      // paddingVertical: heightPercentageToDP("2%"),
                      right: 0,
                      marginRight: widthPercentageToDP("3%"),
                    }}
                  >
                    <Next style={styles.nextIcon} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <View style={styles.productInformationContainer}>
                <Shop
                  style={{
                    width: win.width / 12,
                    height: 17 * ratioStoreIcon,
                  }}
                  // source={require("../assets/Images/purchaseHistoryProductStoreIcon.png")}
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
        let tmpOrderProducts = response.data.orderProducts
          .reverse()
          .filter((order) => {
            if (type == 'past_6_months') {
              let today = new Date();
              let past_6_months = today.setMonth(today.getMonth() - 6);
              if (new Date(order.created) >= past_6_months) {
                return true;
              }
            } else {
              let year = kanjidate.format("{Y:4}", new Date(order.created));
              return year == type || type == "all";
            }
          });
        onOrdersChanged(tmpOrderProducts);
        onYearHtmlChanged(processYearHtml(tmpYears));
        onOrderHtmlChanged(processOrderHtml(props, tmpOrderProducts, searchText, ""));
        onSpinnerChanged(false);
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
        if (isFocused) {
          onSpinnerChanged(true);
        }
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
              onSpinnerChanged(true);
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
    InteractionManager.runAfterInteractions(() => {
      if(!isFocused) {
        onSpinnerChanged(false);
      }
      load();
    });
  }, [isFocused]);

  // React.useEffect(() => {
  //   InteractionManager.runAfterInteractions(() => {
  //     onSpinnerChanged(false);
  //   });
  // }, [!isFocused]);

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
              props.navigation.goBack();
            }}
            onPress={() => {
              props.navigation.navigate("Cart");
            }}
            text={Translate.t("purchaseHistory")}
          />
          <CustomSecondaryHeader outUser={user} props={props}
            name={user.nickname}
            accountType={
              props.route.params.is_store ? Translate.t("storeAccount") : ""
            }
          />
          <Spinner
            visible={spinner}
            textContent={"Loading..."}
            textStyle={styles.spinnerTextStyle}
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
              <Search
                style={{
                  width: win.width / 24,
                  height: ratioSearch * 19,
                  position: "absolute",
                  left: 0,
                  marginLeft: widthPercentageToDP("3%"),
                  alignSelf: "center",
                  zIndex: 1,
                }}
              />
              <TextInput
                placeholder={Translate.t("filterProductName")}
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
                value={searchText}
                onChangeText={(value) => {
                  onSearchTextChanged(value);
                  onOrderHtmlChanged(processOrderHtml(props, orders, value, ""));
                }}
              />
              <TouchableWithoutFeedback onPress={() => {
                onSearchTextChanged(""); 
                onOrderHtmlChanged(processOrderHtml(props, orders, "", ""));
              }}>
              <Image
                style={{
                  width: win.width / 14,
                  height: ratioSearch * 19,
                  position: "absolute",
                  right: 0,
                  marginTop: heightPercentageToDP("2%"),
                  marginRight: widthPercentageToDP("4%"),
                  alignSelf: "center",
                  zIndex: 2,
                }}
                source={require("../assets/Images/cancelIcon.png")}
              />
              </TouchableWithoutFeedback>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                onshowYears(!showYears);
              }}>
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
                <Text style={styles.dateTabText}>{Translate.t("releaseDate")}</Text>
                <Image
                  style={{
                    width: win.width / 24,
                    height: ratioSearch * 8,
                    position: "absolute",
                    right: 0,
                    marginRight: widthPercentageToDP("4%"),
                    alignSelf: "center",
                  }}
                  source={showYears ? (require("../assets/Images/upIcon.png")) : (require("../assets/Images/downArrow.png"))}
                />
            </View>
            </TouchableWithoutFeedback>
            {showYears ? (<View>
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
                  onSpinnerChanged(true);
                  loadOrder(userId, "past_6_months");
                });
              }}
            >
              <View style={styles.dateTabContainer}>
                <Text style={styles.dateTabText}>{Translate.t("pastSixMonth")}</Text>
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
            </View></View>) : (<View></View>)}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                // marginTop: heightPercentageToDP("30%"),
                bottom: 0,
                position: "absolute",
                marginHorizontal: widthPercentageToDP("1%"),
                marginBottom: heightPercentageToDP("20%"),
                justifyContent: "space-evenly",
                // backgroundColor: "orange",
                width: "100%",
              }}
            >
              <Image
                style={{
                  width: win.width / 25,
                  height: ratioCancel * 15,
                  position: "absolute",
                  left: 0,
                  borderRadius: win.width / 2,
                  backgroundColor: "black",
                  marginLeft: widthPercentageToDP("3%"),
                }}
                source={require("../assets/Images/cancelIcon.png")}
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  onSearchTextChanged("");
                  onOrderHtmlChanged(processOrderHtml(props, orders, "", ""));
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(14),
                    marginLeft: widthPercentageToDP("3%"),
                    marginBottom: heightPercentageToDP(".3%"),
                    padding: widthPercentageToDP("2%"),
                  }}
                >
                  {Translate.t("cancelCondition")}
                </Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback
                onPress={() => {
                  Animated.timing(right, {
                    toValue: widthPercentageToDP("-80%"),
                    duration: 500,
                    useNativeDriver: false,
                  }).start()}
                }
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: Colors.CECECE,
                    padding: widthPercentageToDP("1%"),
                    paddingHorizontal: widthPercentageToDP("3%"),
                    // marginRight: widthPercentageToDP("2%"),
                  }}
                >
                  <Text style={styles.dateTabText}>{Translate.t("done")}</Text>
                </View>
              </TouchableWithoutFeedback>
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
                  <Next
                    style={{
                      width: RFValue(12),
                      height: RFValue(12),
                      position: "absolute",
                      right: 0,
                      marginRight: widthPercentageToDP("3%"),
                    }}
                    // source={require("../assets/Images/next.png")}
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
    // paddingBottom: heightPercentageToDP("3%"),
    width: RFValue(15),
    height: RFValue(15),
    // position: "absolute",
    // right: 0,
    // marginRight: widthPercentageToDP("3%"),
  },
  purchaseHistoryProductContainer: {
    // backgroundColor: "orange",
    justifyContent: "center",
    borderWidth: 1,
    flex: 1,
    borderColor: Colors.D7CCA6,
    backgroundColor: Colors.F6F6F6,
    paddingBottom: widthPercentageToDP("3%"),
    marginTop: heightPercentageToDP("1%"),
    // backgroundColor: "orange",
  },
  productInformationContainer: {
    // backgroundColor: "orange",
    flexDirection: "row",
    alignItems: "center",
    // marginTop: heightPercentageToDP("2%"),
    marginHorizontal: widthPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.CECECE,
    paddingVertical: heightPercentageToDP("2%"),
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
    fontSize: RFValue(12),
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});
