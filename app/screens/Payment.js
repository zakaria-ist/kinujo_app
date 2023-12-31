import React from "react";
import { InteractionManager } from 'react-native';
// import { WebView } from 'react-native-webview';
// import StripeCheckout from 'react-native-stripe-checkout-webview';

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
import { useStateIfMounted } from "use-state-if-mounted";
import CachedImage from 'react-native-expo-cached-image';
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { Colors } from "../assets/Colors.js";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import CustomAlert from "../lib/alert";
import Translate from "../assets/Translates/Translate";
import {
  CreditCardInput,
  LiteCreditCardInput,
} from "react-native-input-credit-card";
import AsyncStorage from "@react-native-community/async-storage";
import Request from "../lib/request";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import "firebase/firestore";
import Spinner from "react-native-loading-spinner-overlay";
// import KinujoStripeCheckout from "./KinujoStripeCheckout";

const request = new Request();
const alert = new CustomAlert();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const paymentUrl = request.getPaymentUrl();

export default function Payment(props) {
  const [card, onCardChanged] = useStateIfMounted({});
  const [spinner, onSpinnerChanged] = useStateIfMounted(false);

  React.useEffect(() => {}, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Spinner
        visible={spinner}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <CustomHeader
        onBack={() => {
          props.navigation.goBack();
        }}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("payment")}
      />
      <TouchableWithoutFeedback
          onPress={() => {
              fetch(paymentUrl + 'create-checkout-session/', {
                method: 'POST',
              })
              
              .then(function(response) {
                return response.json();
              })
              .then(function(session) {
                let CHECKOUT_SESSION_ID = session.sessionId;
                props.navigation.navigate("KinujoStripeCheckout", {
                  checkoutSessionId: CHECKOUT_SESSION_ID,
                  stripePublicKey: 'pk_test_51INa46G0snPTYlWjPqYzBnU4XeWZhXLtduZx5F1A02YnShGIvAGqRuK0J6uPECj6DME62dKsNlUb3JXQlq9zaBf300Z1eNWPIP',
                });
              })
              .catch(function (error) {
                console.log(error);
                onSpinnerChanged(false);
                if (
                  error &&
                  error.response &&
                  error.response.data &&
                  Object.keys(error.response.data).length > 0
                ) {
                  alert.warning(
                    error.response.data[
                      Object.keys(error.response.data)[0]
                    ][0]
                  );
                }
              });
          }}
        >
          <View style={{ paddingBottom: heightPercentageToDP("10%") }}>
            <View style={styles.orderConfirmButtonContainer}>
              <Text style={styles.orderConfirmButtonText}>
                {Translate.t("confirmPayment")}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      {/* <WebView
        source={{ uri: paymentUrl + 'pay/' }}
        style={{ marginTop: 20, height: heightPercentageToDP("80%") }}
      /> */}
      {/* <View>
        <CreditCardInput
          onChange={(form) => {
            onCardChanged(form);
          }}
        />
        <TouchableWithoutFeedback
          onPress={() => {
            AsyncStorage.getItem("user").then((url) => {
              let urls = url.split("/");
              urls = urls.filter((url) => {
                return url;
              });
              userId = urls[urls.length - 1];
              // console.log(card.valid);
              if (card.valid) {
                if (card) {
                  onSpinnerChanged(true);
                  request
                    .post("pay/" + userId + "/", {
                      card: card.values,
                      products: props.route.params.products,
                      address: props.route.params.address,
                      tax: props.route.params.tax,
                    })
                    .then(function (response) {
                      onSpinnerChanged(false);
                      response = response.data;
                      if (response.success) {
                        let products = props.route.params.products;
                        db.collection("users")
                          .doc(userId)
                          .collection("carts")
                          .get()
                          .then((querySnapshot) => {
                            querySnapshot.forEach((documentSnapshot) => {
                              products.forEach(prod => {
                                if (prod.id == documentSnapshot.id) {
                                  db.collection("users")
                                    .doc(userId)
                                    .collection("carts")
                                    .doc(documentSnapshot.id)
                                    .delete()
                                    .then(() => {});
                                }
                              });
                              
                            });

                            db.collection("sellers")
                            .add({
                              sellers: response.sellers
                            }).then(() => {
                              props.navigation.navigate("PurchaseCompletion");
                            });
                          });
                      } else {
                        if (
                          response.errors &&
                          Object.keys(response.errors).length > 0
                        ) {
                          alert.warning(
                            response.errors[
                              Object.keys(response.errors)[0]
                            ][0] +
                              "(" +
                              Object.keys(response.errors)[0] +
                              ")"
                          );
                        } else if (response.error) {
                          alert.warning(response.error);
                        }
                      }
                    })
                    .catch(function (error) {
                      console.log(error);
                      onSpinnerChanged(false);
                      if (
                        error &&
                        error.response &&
                        error.response.data &&
                        Object.keys(error.response.data).length > 0
                      ) {
                        alert.warning(
                          error.response.data[
                            Object.keys(error.response.data)[0]
                          ][0]
                        );
                      }
                    });
                } else {
                  alert.warning(Translate.t("cardNotComplete"));
                }
              } else {
                alert.warning("Invalid Card Number");
              }
            });
          }}
        >
          <View style={{ paddingBottom: heightPercentageToDP("10%") }}>
            <View style={styles.orderConfirmButtonContainer}>
              <Text style={styles.orderConfirmButtonText}>
                {Translate.t("confirmPayment")}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View> */}
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
  spinnerTextStyle: {
    color: "#FFF",
  },
});
