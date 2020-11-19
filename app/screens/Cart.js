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
import { useIsFocused } from '@react-navigation/native';
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import { Colors } from "../assets/Colors.js";
import { Picker } from "@react-native-picker/picker";
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

import CheckBox from "@react-native-community/checkbox";
const request = new Request();
const alert = new CustomAlert();
const { width } = Dimensions.get("window");
const ratioUpWhiteArrow = width / 24 / 15;
const ratioRemoveIcon = width / 19 / 16;
let firebaseProducts = [];
let ids = [];
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const win = Dimensions.get("window");
const ratioAdd = win.width / 21 / 14;
const ratioRemove = win.width / 20 / 16;
let taxObj = {};
export default function Cart(props) {
  const [cartItemShow, onCartItemShowChanged] = React.useState(true);
  const [paymentMethodShow, onPaymentMethodShow] = React.useState(true);
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

  function getAddressHtml(pAddresses, pSelected){
    let tmpAddresses = [];
    pAddresses.map((address) => {
      tmpAddresses.push(
        <TouchableWithoutFeedback key={address.id}>
          <View>
          <View style={styles.tabContainer}>
            <Text style={{ fontSize: RFValue(12) }}>{address.name}</Text>
            <Text style={styles.textInTabContainer}>{address.zip1}</Text>
            <Text style={styles.textInTabContainer}>
              {address.address1}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{
                  fontSize: RFValue(12),
                  marginTop: heightPercentageToDP(".5%"),
                }}
              >
                {address.prefecture.name}
              </Text>
            </View>
          </View>
          <View style={styles.checkBoxContainer}>
            <CheckBox
              color={Colors.E6DADE}
              uncheckedColor={Colors.E6DADE}
              disabled={false}
              value={pSelected == address['id']}
              onPress={() => {
                alert.warning("PRESS");
              }}
              onValueChange={(value) => {
                if(value){
                  onSelectedChanged(address['id'])
                  onAddressHtmlChanged(getAddressHtml(pAddresses, address['id']))
                }
              }}
            />
          </View>
          </View>
        </TouchableWithoutFeedback>
      );
    })
    return tmpAddresses;
  }
  
  function onValueChanged(id, itemValue, is_store) {
    firebaseProducts = firebaseProducts.map((product) => {
      if (product.product_id == id) {
        product.quantity = itemValue;
      }
      return product;
    });
    onUpdate(ids, firebaseProducts, is_store);
  }

  function processCartHtml(props, products, maps, is_store = false) {
    let tmpCartHtml = [];
    products.map((product) => {
      let item = maps.filter((tmp) => {
        return tmp.product_id == product.id;
      });
      item = item[0];
      tmpCartHtml.push(
        <View key={product.product_id} style={styles.cartFirstTabContainer}>
          <View>
            <Text style={styles.cartTabText}>{product.name}</Text>
            <Text style={styles.cartTabText}>
              {is_store ? product.store_price : product.price}円
            </Text>
          </View>
          <View style={styles.tabRightContainer}>
            <Text style={styles.cartTabText}>数量</Text>

            <Picker
              selectedValue={item.quantity}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) => {
                onValueChanged(product.product_id, itemValue, is_store);
              }}
              mode="dropdown"
            >
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
              <Picker.Item label="6" value="6" />
              <Picker.Item label="7" value="7" />
              <Picker.Item label="8" value="8" />
              <Picker.Item label="9" value="9" />
              <Picker.Item label="10" value="10" />
            </Picker>
            <View
              style={{
                flexDirection: "row-reverse",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableWithoutFeedback
                onPress={() => {
                  let tmpFirebaseProducts = firebaseProducts.filter(
                    (tmpProduct) => {
                      return product.product_id == tmpProduct.product_id;
                    }
                  );
                  let firebaseProduct = tmpFirebaseProducts[0];
                  db.collection("users")
                    .doc(userId)
                    .collection("carts")
                    .doc(product.product_id)
                    .set({
                      quantity: firebaseProduct.quantity,
                    });
                  alert.warning("Cart Updated.");
                }}
              >
                <Text style={styles.buttonText}>変更</Text>
              </TouchableWithoutFeedback>
              <Image
                source={require("../assets/icons/removeIcon.svg")}
                style={styles.removeIcon}
              />
            </View>
          </View>
        </View>
      );
    });
    return tmpCartHtml;
  }

  function onUpdate(ids, items, is_store) {
    request
      .get("product/byIds/", {
        ids: ids,
      })
      .then(function (response) {
        onCartHtmlChanged(
          processCartHtml(props, response.data.products, items, is_store)
        );

        let tmpProducts = response.data.products;
        ids.map((id) => {
          let tmpQuantities = firebaseProducts.filter((product) => {
            return (product.product_id = id);
          });
          let quantity = tmpQuantities[0].quantity;
          let tmpProduct = tmpProducts.filter((product) => {
            return (product.product_id = id);
          });
          tmpProduct = tmpProduct[0];
          onSubTotalChanged(
            (is_store ? tmpProduct.store_price : tmpProduct.price) * quantity
          );
        });
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
            tmpIds = tmpIds.concat(documentSnapshot.id);
            items.push({
              product_id: documentSnapshot.id.toString(),
              id: documentSnapshot.id.toString(),
              quantity: documentSnapshot.data().quantity,
            });
          });
          ids = tmpIds;
          firebaseProducts = items;
          onUpdate(tmpIds, items, false);
        });

        request
        .get("addressList/" + userId + "/")
        .then((response) => {
          onAddressHtmlChanged(getAddressHtml(response.data.addresses, ""))
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

        request
        .get("tax_rates/")
        .then((response) => {
          let taxes = response.data.filter((item)=>{
            let nowDate = new Date();
            if(item.start_date && item.end_date){
              if(nowDate >= new Date(item.start_date) && nowDate <= new Date(item.end_date)){
                return true;
              }
            } else if(item.start_date){
              if(nowDate >= new Date(item.start_date)){
                return true;
              }
            }
            return false;
          })

          if(taxes.length > 0){
            taxObj = taxes[0]
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
  }, []);

  return (
    <View style={{ paddingBottom: heightPercentageToDP("10%"), flexGrow: 1 }}>
      <CustomHeader
        onBack={() => {
          props.navigation.pop();
        }}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        text="カート"
      />
      <ScrollView>
        <TouchableWithoutFeedback
          onPress={() => {
            cartItemShow == true
              ? Animated.parallel([
                  Animated.timing(cartItemHeight, {
                    toValue: heightPercentageToDP("0%"),
                    duration: 500,
                    useNativeDriver: false,
                  }),
                  Animated.timing(cartItemOpacity, {
                    toValue: heightPercentageToDP("0%"),
                    duration: 100,
                    useNativeDriver: false,
                  }),
                ]).start(() => {}, onCartItemShowChanged(false))
              : Animated.parallel([
                  Animated.timing(cartItemHeight, {
                    toValue: heightPercentageToDP("50%"),
                    duration: 500,
                    useNativeDriver: false,
                  }),
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
            <Image
              source={require("../assets/icons/up_whiteArrow.svg")}
              style={styles.upWhiteArrow}
            />
          </View>
        </TouchableWithoutFeedback>

        <View style={{ marginHorizontal: widthPercentageToDP("5%") }}>
          <Animated.View
            style={{
              opacity: cartItemOpacity,
              borderBottomWidth: 1,
              paddingBottom: heightPercentageToDP("5%"),
              borderColor: Colors.deepGrey,
            }}
          >
            {cartHtml}
          </Animated.View>
          <View style={styles.allTabsContainer}>
            {addressHtml}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: heightPercentageToDP("2%"),
              }}
            >
              <Image
                style={{ width: win.width / 21, height: 14 * ratioAdd }}
                source={require("../assets/Images/addAddressIcon.png")}
              />
              <TouchableWithoutFeedback
                onPress={() => {
                  props.navigation.navigate("AdressManagement");
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(12),
                    marginLeft: widthPercentageToDP("2%"),
                  }}
                >
                  {Translate.t("registerNewAddress")}
                </Text>
              </TouchableWithoutFeedback>
            </View>
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
                <Text style={styles.totalText}>小計</Text>
                <Text style={styles.totalText}>消費税</Text>
                <Text style={styles.totalText}>送料</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.totalText}>{subtotal}円</Text>
                <Text style={styles.totalText}>{(taxObj ? parseInt(taxObj.tax_rate * subtotal) : 0)}円</Text>
                <Text style={styles.totalText}>{shipping}円</Text>
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
              小計
            </Text>
            <Text style={{ fontSize: RFValue(14) }}>
              {subtotal + (taxObj ? parseInt(taxObj.tax_rate * subtotal) : 0) + shipping}円
            </Text>
          </View>
          <TouchableWithoutFeedback
            onPress={() => {
              if(firebaseProducts.length > 0 && selected){
                props.navigation.navigate("Payment", {
                  products: firebaseProducts,
                  address: selected,
                  tax: taxObj.id
                });
              } else {
                alert.warning("You must have items in cart and select an address.");
              }
            }}
          >
            <View style={{ paddingBottom: heightPercentageToDP("10%") }}>
              <View style={styles.orderConfirmButtonContainer}>
                <Text style={styles.orderConfirmButtonText}>注文確定</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </View>
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
    backgroundColor: Colors.F0EEE9,
    height: heightPercentageToDP("12%"),
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
    justifyContent: "space-around",
    position: "absolute",
    height: heightPercentageToDP("17%"),
    flex: 1,
    right: 0,
    paddingRight: widthPercentageToDP("4%"),
    alignItems: "flex-end",
  },
  upWhiteArrow: {
    width: width / 24,
    height: 10 * ratioUpWhiteArrow,
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
  buttonText: {
    alignSelf: "center",
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
    fontSize: 12,
    backgroundColor: "white",
    marginTop: heightPercentageToDP("1%"),
    borderColor: "transparent",
  },

  textInTabContainer: {
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
  buttonContainer: {
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: Colors.deepGrey,
    justifyContent: "center",
    alignItems: "center",
    width: widthPercentageToDP("13%"),
    padding: widthPercentageToDP(".5%"),
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
});
