import React from "react";
import { WebView } from 'react-native-webview';
import StripeCheckout from 'react-native-stripe-checkout-webview';
import {
    StyleSheet,
    // Text,
    // Button,
    // Image,
    // View,
    // Dimensions,
    // TouchableWithoutFeedback,
    SafeAreaView,
    // Animated,
    // ScrollView,
  } from "react-native";
// import Spinner from "react-native-loading-spinner-overlay";
import {
    widthPercentageToDP,
    heightPercentageToDP,
} from "react-native-responsive-screen";
import { Colors } from "../assets/Colors.js";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
// import CustomAlert from "../lib/alert";
import Translate from "../assets/Translates/Translate";
import Request from "../lib/request";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import "firebase/firestore";
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();
const request = new Request();
const paymentUrl = request.getPaymentUrl();


export default function KinujoStripeCheckout(props) {
    const CHECKOUT_SESSION_ID = props.route.params.checkoutSessionId;
    const STRIPE_PUBLIC_KEY = props.route.params.stripePublicKey;
    const TAX = props.route.params.tax;
    const ADDRESS = props.route.params.address;
    const PRODUCTS = props.route.params.products;
    console.log('CHECKOUT_SESSION_ID', CHECKOUT_SESSION_ID);
  
    React.useEffect(() => {}, []);
    return (
        <SafeAreaView style={{ flex: 1 }}>
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
            <StripeCheckout
                stripePublicKey={STRIPE_PUBLIC_KEY}
                // successUrl={paymentUrl + 'success?sc_checkout=success&sc_sid=' + CHECKOUT_SESSION_ID}
                // cancelUrl={paymentUrl + 'cancelled?sc_checkout=cancel'}
                checkoutSessionInput={{
                    sessionId: CHECKOUT_SESSION_ID,
                }}
                onSuccess={({ checkoutSessionId }) => {
                    console.log(`Stripe checkout session succeeded. session id: ${checkoutSessionId}.`);
                    AsyncStorage.getItem("user").then((url) => {
                        let urls = url.split("/");
                        urls = urls.filter((url) => {
                          return url;
                        });
                        userId = urls[urls.length - 1];
                        request
                            .post("pay/" + userId + "/", {
                                checkoutSessionId: CHECKOUT_SESSION_ID,
                                products: PRODUCTS,
                                address: ADDRESS,
                                tax: TAX,
                            })
                            .then(function (response) {
                                response = response.data;
                                if (response.success) {
                                    let products = PRODUCTS;
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
                                        })
                                        .then(() => {
                                            props.navigation.navigate("PurchaseCompletion");
                                        });
                                    });
                                }
                            })
                      });
                }}
                onCancel={() => {
                    console.log(`Stripe checkout session cancelled.`);
                }}
            />
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