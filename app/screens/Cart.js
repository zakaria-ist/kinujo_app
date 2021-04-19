import React, { useState, useRef } from "react";
import { InteractionManager } from 'react-native';
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
  Linking
} from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
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
// let shopProducts = [];
let ids = [];
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const paymentUrl = request.getPaymentUrl();
const win = Dimensions.get("window");
const ratioAdd = win.width / 21 / 14;
const ratioRemove = win.width / 20 / 16;
let taxObj = {};
let productLoaded = false;
let controller;

export default function Cart(props) {
  // const [cartItemShow, onCartItemShowChanged] = useStateIfMounted(true);
  // const [paymentMethodShow, onPaymentMethodShow] = useStateIfMounted(true);
  const [cartCount, onCartCountChanged] = useStateIfMounted(0);
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
  // const [picker, onPickerChanged] = useStateIfMounted(1);
  // const [cartHtml, onCartHtmlChanged] = useStateIfMounted(<View></View>);
  const [cartView, onCartViewChanged] = useStateIfMounted([]);
  // const [loaded, onLoaded] = useStateIfMounted(false);
  // const [subtotal, onSubTotalChanged] = useStateIfMounted(0);
  // const [shipping, onShippingChanged] = useStateIfMounted(0);
  // const [tax, onTaxChanged] = useStateIfMounted(0);
  const [user, onUserChanged] = useStateIfMounted({});
  let userId = 0;
  const isFocused = useIsFocused();
  // const [selected, onSelectedChanged] = useStateIfMounted("");
  // const [addressHtml, onAddressHtmlChanged] = useStateIfMounted([]);
  // const [dropDownPickerOpen, onDropDownPickerOpen] = useStateIfMounted(false);
  const cartItems = [];
  let shops = [];
  let tempCartView = [];
  let cartProducts = [];
  let selected = "";
  let addressHtml = [];

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
    shopUpdate(ids, is_store);
  }
  function processCartHtml(props, products, maps, is_store = false) {
    productLoaded = false;
    let tmpCartHtml = [];
    let isVis = [];
    for (i = 0; i < maps.length; i++) {
      let item = maps[i];
      let tmpProducts = products.filter((product) => {
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
          <TouchableWithoutFeedback key={product.name}>
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
                    ? taxObj ? format.separator(parseFloat(product.store_price) + parseFloat(product.store_price) * taxObj.tax_rate) : format.separator(product.store_price)
                    : taxObj ? format.separator(parseFloat(product.price) + parseFloat(product.price) * taxObj.tax_rate) : format.separator(product.price)}
                  円
                </Text>
                <Text style={styles.cartTabText}>{item.name}</Text>
                {/* <Text style={styles.cartTabText}>{product.shipping_fee}円</Text> */}
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
                        //isVis[j].close();
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
                        )
                        .then(() => {
                          db.collection("users")
                            .doc(userId.toString())
                            .collection("carts")
                            .get()
                            .then((querySnapShot) => {
                              let totalItemQty = 0
                              // onCartCountChanged(querySnapShot.size);
                              querySnapShot.forEach(documentSnapshot => {
                                totalItemQty += parseInt(documentSnapshot.data().quantity)
                              });
                              onCartCountChanged(querySnapShot.size ? totalItemQty : 0);
                            });
                        });
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
                                  return firebaseProduct.id != item.id;
                                }
                              );
                              let deleted_product_count = 0;
                              for (i = 0; i < maps.length; i++) {
                                if (maps[i].product_id == item.product_id) {
                                  deleted_product_count++;
                                }
                              }
                              let tmpIds;
                              if (deleted_product_count == 1) {
                                tmpIds = ids.filter((id) => {
                                  return id != product.id;
                                });
                                ids = tmpIds;
                              } else {
                                tmpIds = ids;
                              }
                              db.collection("users")
                                .doc(userId.toString())
                                .collection("carts")
                                .doc(item.varietyId.toString())
                                .delete().then(()=>{
                                  db
                                  .collection("users")
                                  .doc(userId.toString())
                                  .collection("carts")
                                  .get()
                                  .then((querySnapShot) => {
                                    let totalItemQty = 0
                                    // onCartCountChanged(querySnapShot.size);
                                    querySnapShot.forEach(documentSnapshot => {
                                      totalItemQty += parseInt(documentSnapshot.data().quantity)
                                      console.log(totalItemQty)
                                    });
                                    onCartCountChanged(querySnapShot.size ? totalItemQty : 0);
                                  });
                                })
                              shopUpdate(tmpIds, user.is_seller && user.is_approved);
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
    return tmpCartHtml;
  }

  function processCartView(props, shop, shopFirebaseProducts) {
    productLoaded = false;
    tempCartView.push(
      <View key={shop.seller}>
          <TouchableWithoutFeedback
            onPress={() => {
              shop.cartItemShow == true
                ? Animated.parallel([
                    Animated.timing(cartItemOpacity, {
                      toValue: heightPercentageToDP("0%"),
                      duration: 100,
                      useNativeDriver: false,
                    }),
                  ]).start(() => {}, shop.cartItemShow = false, onUpdate(ids, user.is_seller && user.is_approved))
                : Animated.parallel([
                    Animated.timing(cartItemOpacity, {
                      toValue: heightPercentageToDP("100%"),
                      duration: 30000,
                      useNativeDriver: false,
                    }),
                  ]).start(() => {}, shop.cartItemShow = true, onUpdate(ids, user.is_seller && user.is_approved));
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: Colors.D7CCA6,
                height: heightPercentageToDP("6%"),
                alignItems: "center",
                marginBottom: widthPercentageToDP("3%")
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(14),
                  color: "white",
                  marginLeft: widthPercentageToDP("4%"),
                }}
              >
                {shop.seller}
              </Text>
              {shop.cartItemShow == true ? (
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

          <Animated.View
              style={shop.cartItemShow == true ? styles.cartAnimation : styles.none}
            >
            <View>
              <View>{shop.shopHtml}</View>
            </View>
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
                    {format.separator(shop.subtotal)}円
                  </Text>
                  <Text style={styles.totalText}>
                    {format.separator(shop.tax)}円
                  </Text>
                  <Text style={styles.totalText}>
                    {format.separator(shop.shipping)}円
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
                {format.separator(shop.total)}円
              </Text>
            </View>

            <View style={styles.allTabsContainer}>
              <TouchableWithoutFeedback
                // onPress={() => onPaymentMethodShow(!paymentMethodShow)}
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

                </View>
              </TouchableWithoutFeedback>
              <View
                // style={paymentMethodShow == false ? styles.none : ""}
              >
                {addressHtml}
              </View>
            </View>
            <TouchableWithoutFeedback
              onPress={() => {
                if (shopFirebaseProducts.length > 0 && selected) {
                    // fetch(paymentUrl + 'create-checkout-session/', {
                    //   method: 'POST',
                    //   headers: {
                    //     'Accept': 'application/json',
                    //     'Content-Type': 'application/json'
                    //   },
                    //   body: JSON.stringify({
                    //     amount: shop.total,
                    //   })
                    // })
                    // .then(function(response) {
                    //   return response.json();
                    // })
                    // .then(function(session) {
                    //   let CHECKOUT_SESSION_ID = session.sessionId;
                    //   props.navigation.navigate("KinujoStripeCheckout", {
                    //     checkoutSessionId: CHECKOUT_SESSION_ID,
                    //     stripePublicKey: 'pk_test_51HKjPHIvJqFxVlDAE98cKW9H5ugaXDHTkuR18QPSw8yM3NOjYvX4V2SQzLzUb6MMqOmTTRUB2FCxjWeyv3hIUZa700ApA0gjSN',
                    //     products: shopFirebaseProducts,
                    //     address: selected,
                    //     tax: taxObj.id,
                    //     userId: userId,
                    //   });
                    // })
                    // .catch(function (error) {
                    //   console.log(error);
                    //   // onSpinnerChanged(false);
                    //   if (
                    //     error &&
                    //     error.response &&
                    //     error.response.data &&
                    //     Object.keys(error.response.data).length > 0
                    //   ) {
                    //     alert.warning(
                    //       error.response.data[
                    //         Object.keys(error.response.data)[0]
                    //       ][0]
                    //     );
                    //   }
                    // });
                    var params = 'amount=' + shop.total + '&address=' + selected + '&tax=' + taxObj.id + '&userId=' + userId;
                    params += '&products_len=' + shopFirebaseProducts.length;
                    for (var i=0; i < shopFirebaseProducts.length; i++) {
                      params += '&prod_' + i + 'id=' + shopFirebaseProducts[i].id;
                      params += '&prod_' + i + 'p_id=' + shopFirebaseProducts[i].product_id;
                      params += '&prod_' + i + 'v_id=' + shopFirebaseProducts[i].varietyId;
                      params += '&prod_' + i + 'name=' + shopFirebaseProducts[i].name;
                      params += '&prod_' + i + 'qty=' + shopFirebaseProducts[i].quantity;
                    }
                    const url = paymentUrl + 'pay?' + params;
                    console.log(url);
                    // const canOpen = Linking.canOpenURL(url)
                    // if (canOpen) {
                      Linking.openURL(url)
                    // }
                } else {
                  alert.warning(
                    Translate.t("must_have_item")
                  );
                }
              }}
            >
              <View style={{ paddingBottom: heightPercentageToDP("5%") }}>
                <View style={styles.orderConfirmButtonContainer}>
                  <Text style={styles.orderConfirmButtonText}>
                    {Translate.t("confirmOrder")}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    );

  }


  function shopUpdate(tmpIds, is_seller) {
    request
      .get("product/byIds/", {
        ids: tmpIds,
      })
      .then(function (response) {
        cartProducts = response.data.products;
        let prods = response.data.products;
        let tempShops = [];
        prods.forEach((prod) => {
          let t_shops = tempShops.filter((t_shop) => {
            let seller = prod.user.shop_name ? prod.user.shop_name : prod.user.real_name;
            return t_shop.seller == seller;
          })
          if (!t_shops.length) {
            tempShops.push({
              seller: prod.user.shop_name ? prod.user.shop_name : prod.user.real_name,
              total: 0,
              subtotal: 0,
              shipping: 0,
              tax: 0,
              shopHtml: [],
              cartItemShow: true
            })
          }
        })
        shops = tempShops;
        onUpdate(tmpIds, is_seller)
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

  function processCarts(is_store) {
      shops.forEach(shop => {
        let shopProducts = cartProducts.filter((element) => {
          let seller = element.user.shop_name ? element.user.shop_name : element.user.real_name;
          return shop.seller == seller;
        });
        let tmpProducts = shopProducts;

        subTotal = 0;
        tmpShipping = 0;
        let shopFirebaseProducts = [];
        firebaseProducts.filter((fbProduct) => {
          let quantity = fbProduct.quantity;
          let tmpProduct = tmpProducts.filter((product) => {
            if (product.id == fbProduct.product_id) {shopFirebaseProducts.push(fbProduct);}
            return (product.id == fbProduct.product_id);
          });
          if (tmpProduct && tmpProduct.length) {
            tmpProduct = tmpProduct[0];
            subTotal +=
              (is_store ? tmpProduct.store_price : tmpProduct.price) * quantity;
            if (parseInt(tmpProduct.shipping_fee) > parseInt(tmpShipping)) {
              tmpShipping = parseInt(tmpProduct.shipping_fee);
            }
          }
        });
        
        shop.shipping = tmpShipping;
        shop.subtotal = subTotal;
        let tax = taxObj ? taxObj.tax_rate * subTotal : 0;
        shop.tax = tax;
        shop.total = parseInt(tmpShipping) + parseInt(subTotal) + parseInt(tax);
        shop.shopHtml = processCartHtml(props, shopProducts, shopFirebaseProducts, is_store);
        processCartView(props, shop, shopFirebaseProducts);
    });
    productLoaded = true;
    onCartViewChanged(tempCartView);
  }

  function onUpdate(ids, is_store) {
    tempCartView = [];
    if (!cartProducts.length) {
      request
        .get("product/byIds/", {
          ids: ids,
        })
        .then(function (response) {
          cartProducts = response.data.products;
          processCarts(is_store);
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
    } else {
      
      processCarts(is_store);
    }
  }
  React.useEffect(() => {

    InteractionManager.runAfterInteractions(() => {
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

        AsyncStorage.getItem("defaultAddress").then((address) => {
          if (address != null) {
            request.get(address).then((response) => {
              // onAddressHtmlChanged(getAddressHtml(response.data, ""));
              // onSelectedChanged(response.data.id);
              addressHtml = getAddressHtml(response.data, "");
              selected = response.data.id;
            });
          } else {
            request
              .get("addressList/" + userId + "/")
              .then((response) => {
                if (response.data.addresses.length > 0) {
                  // onAddressHtmlChanged(
                  //   getAddressHtml(response.data.addresses[0], "")
                  // );
                  // onSelectedChanged(response.data.addresses[0].id);
                  addressHtml = getAddressHtml(response.data.addresses[0], "");
                  selected = response.data.addresses[0].id;
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
                  // onAddressHtmlChanged(tmpAddresses);
                  addressHtml = tmpAddresses;
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

        db.collection("users")
          .doc(userId)
          .collection("carts")
          .get()
          .then((querySnapshot) => {
            let tmpIds = [];
            let items = [];
            querySnapshot.forEach((documentSnapshot) => {
              tmpIds = tmpIds.concat(documentSnapshot.data().id);
              let tStamps = "";
              try{
                tStamps = documentSnapshot.data().timeStamp.toDate();
              } catch(e){
                console.log('ERROR', e);
              }
              items.push({
                product_id: documentSnapshot.data().id.toString(),
                id: documentSnapshot.id.toString(),
                quantity: documentSnapshot.data().quantity,
                varietyId: documentSnapshot.data().url,
                name: documentSnapshot.data().name,
                timeStamp: tStamps
              });
            });
            console.log('items', items);
            items.sort((a, b) => (a.timeStamp < b.timeStamp) ? 1 : -1);
            console.log('items', items);
            ids = tmpIds;
            firebaseProducts = items;

            request
              .get("product/byIds/", {
                ids: ids,
              })
              .then(function (response) {
                cartProducts = response.data.products;
                //empty cart for deleted products
                firebaseProducts = firebaseProducts.filter((fbProduct) => {
                  let tmpProduct = cartProducts.filter((product) => {
                    if (product.id == fbProduct.product_id) {
                      return product.productVarieties.map((productVariety) => {
                        if (!productVariety.is_hidden) {
                          return productVariety.productVarietySelections.map((productVarietySelection) => {
                              if (!productVarietySelection.is_hidden) {
                                if (!productVarietySelection.jancode_horizontal.is_hidden) {
                                  return productVarietySelection.jancode_horizontal.map((horizontal) => {
                                      if (!horizontal.is_hidden) {
                                        if (horizontal.id == fbProduct.id) {
                                          if (horizontal.stock >= fbProduct.quantity) {
                                            return true;
                                          }
                                        }
                                      }
                                    }
                                  );
                                }

                                if (!productVarietySelection.jancode_vertical.is_hidden) {
                                  return productVarietySelection.jancode_vertical.map((vertical) => {
                                      if (!vertical.is_hidden) {
                                        if (vertical.id == fbProduct.id) {
                                          if (vertical.stock >= fbProduct.quantity) {
                                            return true;
                                          }
                                        }
                                      }
                                    }
                                  );
                                }
                              }
                            }
                          );
                        }
                      });
                    }
                  });
                  console.log('tmpProduct', tmpProduct);
                  if (tmpProduct && tmpProduct.length) {
                    return true;
                  } else {
                    db.collection("users")
                      .doc(userId)
                      .collection("carts")
                      .doc(fbProduct.id)
                      .delete()
                      .then(() => {
                        db.collection("users")
                          .doc(userId.toString())
                          .collection("carts")
                          .get()
                          .then((querySnapShot) => {
                            let totalItemQty = 0
                            // onCartCountChanged(querySnapShot.size);
                            querySnapShot.forEach(documentSnapshot => {
                              totalItemQty += parseInt(documentSnapshot.data().quantity)
                            });
                            onCartCountChanged(querySnapShot.size ? totalItemQty : 0);
                          });
                      });
                  }
                });

                if (items && firebaseProducts.length < items.length) {
                  alert.warning(Translate.t('cartFilterMsg'));
                }
                
                let prods = response.data.products;
                let tempShops = [];
                prods.forEach((prod) => {
                  let t_shops = tempShops.filter((t_shop) => {
                    let seller = prod.user.shop_name ? prod.user.shop_name : prod.user.real_name;
                    return t_shop.seller == seller;
                  })
                  if (!t_shops.length) {
                    tempShops.push({
                      seller: prod.user.shop_name ? prod.user.shop_name : prod.user.real_name,
                      total: 0,
                      subtotal: 0,
                      shipping: 0,
                      tax: 0,
                      shopHtml: [],
                      cartItemShow: true
                    })
                  }
                })
                shops = tempShops;

                request
                  .get(url)
                  .then(function (response) {
                    onUserChanged(response.data);
                    onUpdate(tmpIds, response.data.is_seller && response.data.is_approved);
                  })
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
        <ScrollView>{firebaseProducts.length ? cartView : 
              <View style={{ paddingBottom: heightPercentageToDP("10%"), flexGrow: 1 }}>
                  <Text style={styles.emptyText}>{Translate.t("emptyCart")}</Text>
              </View>}
        </ScrollView>
        {/* <ScrollView>
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
                  (parseFloat(subtotal) +
                    (taxObj ? parseInt(taxObj.tax_rate * subtotal) : 0) +
                    parseFloat(shipping))
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
                  </Text> */}

                  {/* <UpArrowLogo
                    width={18}
                    height={18}
                    style={styles.upWhiteArrow}
                  /> */}
                {/* </View>
              </TouchableWithoutFeedback>
              <Animated.View
                style={paymentMethodShow == false ? styles.none : ""}
              >
                {addressHtml} */}
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
              {/* </Animated.View>
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
                    Translate.t("must_have_item")
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
        </ScrollView> */}
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
  emptyText: {
    fontSize: RFValue(25),
    paddingVertical: heightPercentageToDP(".3%"),
    paddingHorizontal: widthPercentageToDP("2%"),
    marginTop: heightPercentageToDP("10%"),
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
    marginRight: widthPercentageToDP("5%"),
    bottom: -5
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
  // removeIcon: {
  //   width: win.width / 20,
  //   height: 19 * ratioRemove,
  //   marginRight: widthPercentageToDP("3%"),
  // },
  checkBoxContainer: {
    position: "absolute",
    right: 0,
    alignSelf: "center",
  },
  cartAnimation: {
    // borderBottomWidth: 1,
    paddingBottom: heightPercentageToDP("5%"),
    // borderColor: Colors.deepGrey,
    marginHorizontal: widthPercentageToDP("5%"),
  },
  none: {
    display: "none",
  },
});
