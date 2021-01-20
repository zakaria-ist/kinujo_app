import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  Button,
  Image,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  Animated,
  ScrollView,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Alert } from "react-native";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import { Colors } from "../assets/Colors.js";
import { Picker } from "react-native-propel-kit";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import CustomAlert from "../lib/alert";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";
import RemoveLogo from "../assets/icons/removeIcon.svg";
import UpArrowLogo from "../assets/icons/up_whiteArrow.svg";
import CheckBox from "@react-native-community/checkbox";
import Format from "../lib/format";
import ArrowDownLogo from "../assets/icons/arrowDownWhite.svg";
const format = new Format();
const request = new Request();
const alert = new CustomAlert();
const { width } = Dimensions.get("window");
const ratioUpWhiteArrow = width / 24 / 15;
const ratioDownWhiteArrow = width / 24 / 10;
const ratioRemoveIcon = width / 19 / 16;
let firebaseProducts = [];
let djangoProducts = [];
let ids = [];
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const win = Dimensions.get("window");
const ratioAdd = win.width / 21 / 14;
const ratioRemove = win.width / 20 / 16;
let taxObj = {};
let productLoaded = false;
let controller;
export default function Cart(props) {
  const [cartItemShow, onCartItemShowChanged] = React.useState(true);
  const [paymentMethodShow, onPaymentMethodShow] = React.useState(true);
  const [cartCount, onCartCountChanged] = React.useState(0);
  const cartItemHeight = useRef(new Animated.Value(heightPercentageToDP("50%")))
    .current;
  const cartItemOpacity = useRef(
    new Animated.Value(heightPercentageToDP("100%"))
  ).current;

  const paymentItemHeight = useRef(
    new Animated.Value(heightPercentageToDP("28%"))
  ).current;
  const paymentItemOpacity = useRef(
    new Animated.Value(heightPercentageToDP("100%"))
  ).current;
  const [picker, onPickerChanged] = React.useState(1);
  const [cartHtml, onCartHtmlChanged] = React.useState(<View></View>);
  const [loaded, onLoaded] = React.useState(false);
  const [subtotal, onSubTotalChanged] = React.useState(0);
  const [shipping, onShippingChanged] = React.useState(0);
  const [tax, onTaxChanged] = React.useState(0);

  let userId = 0;
  const isFocused = useIsFocused();
  const [selected, onSelectedChanged] = React.useState("");
  const [addressHtml, onAddressHtmlChanged] = React.useState([]);
  const [dropDownPickerOpen, onDropDownPickerOpen] = React.useState(false);
  const cartItems = [];
  // if (this.controller.isOpen()) {
  //   onDropDownPickerOpen(true);
  // }
  // this.controller.isOpen();
  function getAddressHtml(pAddresses, pSelected) {
    let tmpAddresses = [];
    // pAddresses.map((address) => {
    // console.log(pAddresses.name);

    if (!pAddresses) {
      tmpAddresses.push(
        <View style={styles.deliveryTabContainer} key={pAddresses.id}>
          <View
            style={{
              marginLeft: widthPercentageToDP("4%"),
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: RFValue(12) }}>No Address</Text>
            <TouchableWithoutFeedback
              onPress={() =>
                props.navigation.navigate("ShippingList", {
                  type: "cart",
                })
              }
            >
              <View style={styles.buttonContainer}>
                <Text style={{ fontSize: RFValue(11), color: "white" }}>
                  Add Address
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    } else {
      tmpAddresses.push(
        <View style={styles.deliveryTabContainer} key={pAddresses.id}>
          <View
            style={{
              position: "absolute",
              marginLeft: widthPercentageToDP("4%"),
            }}
          >
            <Text style={{ fontSize: RFValue(12) }}>
              {Translate.t("destination")}
            </Text>
            <TouchableWithoutFeedback
              onPress={() =>
                props.navigation.navigate("ShippingList", {
                  type: "cart",
                })
              }
            >
              <View style={styles.buttonContainer}>
                <Text style={{ fontSize: RFValue(11), color: "white" }}>
                  {Translate.t("change")}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View
            style={{
              // marginRight: widthPercentageToDP("4%"),
              position: "absolute",
              right: 0,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: RFValue(12),
                // backgroundColor: "orange",
                width: widthPercentageToDP("45%"),
              }}
            >
              {pAddresses.name}
            </Text>
            <Text style={styles.textInTabContainer}>{pAddresses.zip1}</Text>
            <Text style={styles.textInTabContainer}>{pAddresses.address1}</Text>

            <Text style={styles.textInTabContainer}>
              {pAddresses.prefecture.name}
            </Text>
          </View>
        </View>
      );
    }
    return tmpAddresses[0];
  }

  function onValueChanged(id, itemValue, is_store) {
    firebaseProducts = firebaseProducts.map((product) => {
      if (product.id == id) {
        product.quantity = itemValue;
      }
      return product;
    });
    onUpdate(ids, firebaseProducts, is_store);
  }
  function processCartHtml(props, products, maps, is_store = false) {
    productLoaded = false;
    let tmpCartHtml = [];
    let isVis = [];
    for (i = 0; i < maps.length; i++) {
      let item = maps[i];
      let tmpProducts = products.filter((product) => {
        console.log(product.id + " = " + item.product_id);
        return product.id == item.product_id;
      });
      if (tmpProducts.length > 0) {
        let product = tmpProducts[0];
        let quantity = item.quantity;
        let realIndex = 1000 - i;
        let idx = i;
        isVis[idx] = false;
        // onShippingChanged(product.shipping_fee);
        // if (cartItemShow == true) {
        //   for (let j = 0; j < isVis.length; j++) {
        //     if (idx !== j) {
        //       isVis[j].close();
        //     }
        //   }
        // }
        tmpCartHtml.push(
          // <TouchableWithoutFeedback onPress={() => controller.close()}>
          <TouchableWithoutFeedback>
            <View
              key={i}
              style={{
                flexDirection: "row",
                backgroundColor: Colors.F0EEE9,
                height: heightPercentageToDP("20%"),
                marginTop: heightPercentageToDP("2%"),
                paddingHorizontal: widthPercentageToDP("4%"),
                paddingBottom: heightPercentageToDP("14%"),
                zIndex: realIndex,
              }}
            >
              <View
                style={{
                  width: widthPercentageToDP("60%"),
                }}
              >
                <Text style={styles.cartTabText}>{product.name}</Text>
                <Text style={styles.cartTabText}>
                  {is_store
                    ? format.separator(product.store_price)
                    : format.separator(product.price)}
                  円
                </Text>
                <Text style={styles.cartTabText}>{item.name}</Text>
              </View>
              <View style={styles.tabRightContainer}>
                <Text style={styles.cartTabText}>{Translate.t("unit")}</Text>
                <DropDownPicker
                  controller={(instance) => {
                    controller = instance;
                  }}
                  // zIndex={9999}
                  style={{
                    borderWidth: 1,
                    backgroundColor: "white",
                    borderColor: "transparent",
                    color: "black",
                    fontSize: RFValue(11),
                    paddingLeft: widthPercentageToDP("2%"),
                  }}
                  items={cartItems}
                  controller={(instance) => (isVis[idx] = instance)}
                  defaultValue={quantity ? quantity + "" : ""}
                  containerStyle={{
                    height: RFValue(40),
                    width: widthPercentageToDP("20%"),
                  }}
                  labelStyle={{
                    fontSize: RFValue(10),
                    color: "gray",
                  }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  selectedtLabelStyle={{
                    color: Colors.F0EEE9,
                  }}
                  placeholder={Translate.t("unit")}
                  dropDownStyle={{
                    width: widthPercentageToDP("20%"),
                    backgroundColor: "white",
                    color: "black",
                    height: heightPercentageToDP("10.5%"),
                    zIndex: realIndex,
                  }}
                  onOpen={() => {
                    for (let j = 0; j < isVis.length; j++) {
                      if (idx !== j) {
                        isVis[j].close();
                      }
                    }
                  }}
                  onChangeItem={(ci) => {
                    if (ci) {
                      db.collection("users")
                        .doc(userId.toString())
                        .collection("carts")
                        .doc(item.id.toString())
                        .set(
                          {
                            quantity: ci.value,
                          },
                          {
                            merge: true,
                          }
                        );
                      onValueChanged(item.id, ci.value, is_store);
                    }
                  }}
                />

                <View
                  style={{
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableWithoutFeedback
                    onPress={() => {
                      // let tmpFd
                    }}
                  >
                    <View style={styles.buttonContainer}>
                      <Text style={styles.buttonText}>
                        {Translate.t("change")}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => {
                      Alert.alert(
                        Translate.t("warning"),
                        Translate.t("deleteItem"),
                        [
                          {
                            text: Translate.t("dialogYes"),
                            onPress: () => {
                              firebaseProducts = firebaseProducts.filter(
                                (firebaseProduct) => {
                                  console.log(firebaseProduct);
                                  console.log(item);
                                  return firebaseProduct.id != item.id;
                                }
                              );
                              let tmpIds = ids.filter((id) => {
                                return id != product.id;
                              });
                              ids = tmpIds;
                              onUpdate(tmpIds, firebaseProducts, false);
                              db.collection("users")
                                .doc(userId.toString())
                                .collection("carts")
                                .doc(product.id.toString())
                                .delete().then(()=>{
                                  const subscriber = db
                                  .collection("users")
                                  .doc(userId.toString())
                                  .collection("carts")
                                  .get()
                                  .then((querySnapShot) => {
                                    console.log(querySnapShot.size)
                                    onCartCountChanged(querySnapShot.size ? "clear" : querySnapShot.size);
                                  });
                                })
                            },
                          },
                          {
                            text: Translate.t("dialogNo"),
                            onPress: () => {},
                          },
                        ],
                        { cancelable: false }
                      );
                    }}
                  >
                    <RemoveLogo
                      source={require("../assets/icons/removeIcon.svg")}
                      style={styles.removeIcon}
                    />
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        );
      }
    }

    console.log(tmpCartHtml);
    return tmpCartHtml;
  }

  function onUpdate(ids, items, is_store) {
    request
      .get("product/byIds/", {
        ids: ids,
      })
      .then(function (response) {
        djangoProducts = response.data.products;
        onCartHtmlChanged(
          processCartHtml(props, djangoProducts, items, is_store)
        );
        productLoaded = true;
        let tmpProducts = response.data.products;

        total = 0;
        firebaseProducts.filter((fbProduct) => {
          let quantity = fbProduct.quantity;
          let tmpProduct = tmpProducts.filter((product) => {
            return (product.id = fbProduct.id);
          });
          tmpProduct = tmpProduct[0];

          total +=
            (is_store ? tmpProduct.store_price : tmpProduct.price) * quantity;
        });

        onSubTotalChanged(total);
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
  React.useEffect(() => {
    for (var i = 1; i < 100; i++) {
      if (
        cartItems.filter((item) => {
          return item.value == i;
        }).length == 0
      ) {
        cartItems.push({
          value: i + "",
          label: i + "",
        });
      }
    }
    AsyncStorage.getItem("user").then((url) => {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      userId = urls[urls.length - 1];

      db.collection("users")
        .doc(userId)
        .collection("carts")
        .get()
        .then((querySnapshot) => {
          let tmpIds = [];
          let items = [];
          querySnapshot.forEach((documentSnapshot) => {
            tmpIds = tmpIds.concat(documentSnapshot.data().id);
            items.push({
              product_id: documentSnapshot.data().id.toString(),
              id: documentSnapshot.id.toString(),
              quantity: documentSnapshot.data().quantity,
              varietyId: documentSnapshot.data().url,
              name: documentSnapshot.data().name,
            });
          });
          ids = tmpIds;
          firebaseProducts = items;
          onUpdate(tmpIds, items, false);
        });
      AsyncStorage.getItem("defaultAddress").then((address) => {
        if (address != null) {
          request.get(address).then((response) => {
            onAddressHtmlChanged(getAddressHtml(response.data, ""));
            onSelectedChanged(response.data.id);
          });
        } else {
          request
            .get("addressList/" + userId + "/")
            .then((response) => {
              if (response.data.addresses.length > 0) {
                onAddressHtmlChanged(
                  getAddressHtml(response.data.addresses[0], "")
                );
                onSelectedChanged(response.data.addresses[0].id);
              } else {
                let tmpAddresses = [];
                tmpAddresses.push(
                  <View style={styles.deliveryTabContainer}>
                    <View
                      style={{
                        position: "absolute",
                        marginLeft: widthPercentageToDP("4%"),
                      }}
                    >
                      <Text style={{ fontSize: RFValue(12) }}>
                        {Translate.t("destination")}
                      </Text>
                      <TouchableWithoutFeedback
                        onPress={() =>
                          props.navigation.navigate("ShippingList", {
                            type: "cart",
                          })
                        }
                      >
                        <View style={styles.buttonContainer}>
                          <Text
                            style={{ fontSize: RFValue(11), color: "white" }}
                          >
                            {Translate.t("change")}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                    <View
                      style={{
                        // marginRight: widthPercentageToDP("5%"),
                        position: "absolute",
                        right: 0,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: RFValue(12),
                          // backgroundColor: "orange",
                          width: widthPercentageToDP("45%"),
                        }}
                      ></Text>
                      <Text style={styles.textInTabContainer}></Text>
                      <Text style={styles.textInTabContainer}></Text>
                      <Text style={styles.textInTabContainer}></Text>
                    </View>
                  </View>
                );
                onAddressHtmlChanged(tmpAddresses);
              }
            })
            .catch((error) => {
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
      });

      request
        .get("tax_rates/")
        .then((response) => {
          let taxes = response.data.filter((item) => {
            let nowDate = new Date();
            if (item.start_date && item.end_date) {
              if (
                nowDate >= new Date(item.start_date) &&
                nowDate <= new Date(item.end_date)
              ) {
                return true;
              }
            } else if (item.start_date) {
              if (nowDate >= new Date(item.start_date)) {
                return true;
              }
            }
            return false;
          });

          if (taxes.length > 0) {
            taxObj = taxes[0];
          }
        })
        .catch((error) => {
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
  }, [isFocused]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ paddingBottom: heightPercentageToDP("10%"), flexGrow: 1 }}>
        <CustomHeader
          text={Translate.t("cart")}
          onBack={() => {
            props.navigation.goBack();
          }}
          onPress={() => {
            props.navigation.navigate("Cart");
          }}
          onCartCount={(count) => {
            onCartCountChanged(count);
          }}
          overrideCartCount={cartCount}
          onFavoritePress={() => props.navigation.navigate("Favorite")}
        />
        <ScrollView>
          <TouchableWithoutFeedback
            onPress={() => {
              cartItemShow == true
                ? Animated.parallel([
                    Animated.timing(cartItemOpacity, {
                      toValue: heightPercentageToDP("0%"),
                      duration: 100,
                      useNativeDriver: false,
                    }),
                  ]).start(() => {}, onCartItemShowChanged(false))
                : Animated.parallel([
                    Animated.timing(cartItemOpacity, {
                      toValue: heightPercentageToDP("100%"),
                      duration: 30000,
                      useNativeDriver: false,
                    }),
                  ]).start(() => {}, onCartItemShowChanged(true));
            }}
          >
            <View
              style={{
                flexDirection: "row",
                // height:
                backgroundColor: Colors.D7CCA6,
                height: heightPercentageToDP("6%"),
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "white",
                  marginLeft: widthPercentageToDP("4%"),
                }}
              >
                KINUJO official shop
              </Text>
              {cartItemShow == true ? (
                <UpArrowLogo
                  width={18}
                  height={18}
                  style={styles.upWhiteArrow}
                />
              ) : (
                <ArrowDownLogo
                  width={18}
                  height={18}
                  style={styles.upWhiteArrow}
                />
              )}
            </View>
          </TouchableWithoutFeedback>

          <View
            style={{
              marginHorizontal: widthPercentageToDP("5%"),
            }}
          >
            <Animated.View
              style={cartItemShow == true ? styles.cartAnimation : styles.none}
            >
              {cartHtml}
            </Animated.View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  marginTop: heightPercentageToDP("2%"),
                }}
              >
                <View
                  style={{
                    marginRight: widthPercentageToDP("10%"),
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={styles.totalText}>
                    {Translate.t("Subtotal")}
                  </Text>
                  <Text style={styles.totalText}>{Translate.t("gst")}</Text>
                  <Text style={styles.totalText}>
                    {Translate.t("shippingFee")}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={styles.totalText}>
                    {format.separator(subtotal)}円
                  </Text>
                  <Text style={styles.totalText}>
                    {taxObj
                      ? format.separator(parseInt(taxObj.tax_rate * subtotal))
                      : 0}
                    円
                  </Text>
                  <Text style={styles.totalText}>
                    {format.separator(shipping)}円
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: heightPercentageToDP("2%"),
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  marginRight: widthPercentageToDP("15%"),
                }}
              >
                {Translate.t("total")}
              </Text>
              <Text style={{ fontSize: RFValue(14) }}>
                {format.separator(
                  subtotal +
                    (taxObj ? parseInt(taxObj.tax_rate * subtotal) : 0) +
                    shipping
                )}
                円
              </Text>
            </View>

            <View style={styles.allTabsContainer}>
              <TouchableWithoutFeedback
                onPress={() => onPaymentMethodShow(!paymentMethodShow)}
              >
                <View
                  style={{
                    backgroundColor: Colors.D7CCA6,
                    justifyContent: "center",
                    height: heightPercentageToDP("5%"),
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(14),
                      color: "white",
                      marginLeft: widthPercentageToDP("3%"),
                    }}
                  >
                    {Translate.t("deliveryAddressCart")}
                  </Text>

                  {/* <UpArrowLogo
                    width={18}
                    height={18}
                    style={styles.upWhiteArrow}
                  /> */}
                </View>
              </TouchableWithoutFeedback>
              <Animated.View
                style={paymentMethodShow == false ? styles.none : ""}
              >
                {addressHtml}
                {/* //////Payment/////////////////////////////////////////////////////////// */}
                {/* <View style={styles.deliveryTabContainer}>
                  <View
                    style={{
                      position: "absolute",
                      marginLeft: widthPercentageToDP("4%"),
                    }}
                  >
                    <Text style={{ fontSize: RFValue(12) }}>
                      Payment Method
                    </Text>
                    <TouchableWithoutFeedback
                      onPress={() => props.navigation.navigate("ShippingList")}
                    >
                      <View style={styles.buttonContainer}>
                        <Text style={{ fontSize: RFValue(11), color: "white" }}>
                          Change
                        </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <View
                    style={{
                      // marginRight: widthPercentageToDP("5%"),
                      // backgroundColor: "orange",
                      position: "absolute",
                      right: 0,
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        width: widthPercentageToDP("45%"),
                      }}
                    >
                      {"creditcard"}
                    </Text>
                    <Text style={styles.textInTabContainer}>{"AMEX"}</Text>
                    <Text style={styles.textInTabContainer}>{"00/00"}</Text>

                    <Text style={styles.textInTabContainer}>
                      {"TanakaTaro"}
                    </Text>
                  </View>
                </View> */}
                {/* //////Payment/////////////////////////////////////////////////////////// */}
              </Animated.View>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                if (firebaseProducts.length > 0 && selected) {
                  props.navigation.navigate("Payment", {
                    products: firebaseProducts,
                    address: selected,
                    tax: taxObj.id,
                  });
                } else {
                  alert.warning(
                    "You must have items in cart and select an address."
                  );
                }
              }}
            >
              <View style={{ paddingBottom: heightPercentageToDP("10%") }}>
                <View style={styles.orderConfirmButtonContainer}>
                  <Text style={styles.orderConfirmButtonText}>
                    {Translate.t("confirmOrder")}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  orderConfirmButtonContainer: {
    backgroundColor: Colors.E6DADE,
    borderRadius: 5,
    marginTop: heightPercentageToDP("7%"),
    width: widthPercentageToDP("48%"),
    height: heightPercentageToDP("6%"),
    justifyContent: "center",
    alignSelf: "center",
  },
  orderConfirmButtonText: {
    fontSize: RFValue(12),
    color: "white",
    paddingVertical: heightPercentageToDP(".3%"),
    paddingHorizontal: widthPercentageToDP("2%"),
    alignSelf: "center",
  },
  paymentButtonText: {
    alignSelf: "center",
    fontSize: RFValue(11),
    color: "white",
    paddingVertical: heightPercentageToDP(".3%"),
    paddingHorizontal: widthPercentageToDP("2%"),
  },
  paymentButtonContainer: {
    marginTop: heightPercentageToDP("1.2%"),
    backgroundColor: Colors.deepGrey,
    width: widthPercentageToDP("12%"),
    alignItems: "center",
    borderRadius: 5,
  },
  paymentTabContainer: {
    backgroundColor: Colors.F0EEE9,
    height: heightPercentageToDP("14%"),
    paddingLeft: widthPercentageToDP("3%"),
    paddingBottom: widthPercentageToDP("3%"),
  },
  paymentRightTab: {
    width: widthPercentageToDP("45%"),
    position: "absolute",
    right: 0,
    alignItems: "flex-start",
    marginTop: heightPercentageToDP("1%"),
  },
  paymentTabText: {
    fontSize: RFValue(11),
    marginTop: heightPercentageToDP(".5%"),
  },

  deliveryTabContainer: {
    justifyContent: "center",
    backgroundColor: Colors.F0EEE9,
    height: heightPercentageToDP("18%"),
    paddingLeft: widthPercentageToDP("3%"),
    borderBottomWidth: 1,
    borderBottomColor: Colors.CECECE,
    paddingBottom: widthPercentageToDP("3%"),
  },
  deliveryRightTab: {
    width: widthPercentageToDP("45%"),
    position: "absolute",
    right: 0,
    alignItems: "flex-start",
    marginTop: heightPercentageToDP("1%"),
  },
  deliveryTabText: {
    fontSize: RFValue(11),
    marginTop: heightPercentageToDP(".5%"),
  },
  paymentMethodHeader: {
    backgroundColor: Colors.D7CCA6,
    height: heightPercentageToDP("5%"),
    marginTop: heightPercentageToDP("3%"),
    justifyContent: "center",
    paddingHorizontal: widthPercentageToDP("3%"),
  },
  totalText: {
    fontSize: RFValue(11),
    marginTop: heightPercentageToDP(".5%"),
  },
  tabRightContainer: {
    justifyContent: "space-between",
    position: "absolute",
    height: heightPercentageToDP("17%"),
    // flex: 1,
    marginTop: heightPercentageToDP(".5%"),
    height: heightPercentageToDP("18%"),
    right: 0,
    paddingRight: widthPercentageToDP("4%"),
    alignItems: "flex-end",
    // zIndex: 1000,
  },
  upWhiteArrow: {
    width: win.width / 24,
    height: 10 * ratioUpWhiteArrow,
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("4%"),
  },
  downWhiteArrow: {
    position: "absolute",
    right: 0,
    marginRight: widthPercentageToDP("4%"),
  },
  cartTabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.F0EEE9,
    height: heightPercentageToDP("14%"),
    marginTop: heightPercentageToDP("1%"),
    paddingHorizontal: widthPercentageToDP("4%"),
    paddingBottom: heightPercentageToDP("14%"),
  },
  cartFirstTabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.F0EEE9,
    height: heightPercentageToDP("18%"),
    marginTop: heightPercentageToDP("2%"),
    paddingHorizontal: widthPercentageToDP("4%"),
    paddingBottom: heightPercentageToDP("14%"),
  },
  cartTabText: {
    fontSize: RFValue(11),
    marginTop: heightPercentageToDP("1"),
  },
  removeIcon: {
    width: width / 19,
    height: 19 * ratioRemoveIcon,
    marginRight: widthPercentageToDP("4%"),
  },
  buttonContainer: {
    alignSelf: "flex-start",
    fontSize: RFValue(11),
    color: "white",
    backgroundColor: Colors.deepGrey,
    paddingHorizontal: widthPercentageToDP("2%"),
    paddingVertical: heightPercentageToDP(".5%"),
    borderRadius: 5,
    marginTop: heightPercentageToDP("1%"),
  },
  picker: {
    width: widthPercentageToDP("20%"),
    height: heightPercentageToDP("5%"),
    fontSize: RFValue(12),
    backgroundColor: "white",
    marginTop: heightPercentageToDP("1%"),
    borderColor: "transparent",
  },

  textInTabContainer: {
    width: widthPercentageToDP("45%"),
    fontSize: RFValue(12),
    marginTop: heightPercentageToDP(".5%"),
  },
  allTabsContainer: {
    marginTop: heightPercentageToDP("3%"),
  },
  tabContainer: {
    backgroundColor: Colors.F0EEE9,
    padding: widthPercentageToDP("3%"),
    marginRight: widthPercentageToDP("10%"),
    marginTop: heightPercentageToDP("1%"),
  },
  buttonText: {
    fontSize: RFValue(12),
    color: "white",
  },
  removeIcon: {
    width: win.width / 20,
    height: 19 * ratioRemove,
    marginRight: widthPercentageToDP("3%"),
  },
  checkBoxContainer: {
    position: "absolute",
    right: 0,
    alignSelf: "center",
  },
  cartAnimation: {
    borderBottomWidth: 1,
    paddingBottom: heightPercentageToDP("5%"),
    borderColor: Colors.deepGrey,
  },
  none: {
    display: "none",
  },
});
