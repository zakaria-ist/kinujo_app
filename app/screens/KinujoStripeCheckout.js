import React from "react";
import StripeCheckout from 'react-native-stripe-checkout-webview';
import {
    StyleSheet,
    SafeAreaView,
  } from "react-native";
import { useStateIfMounted } from "use-state-if-mounted";
import {
    widthPercentageToDP,
    heightPercentageToDP,
} from "react-native-responsive-screen";
import { Colors } from "../assets/Colors.js";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import Translate from "../assets/Translates/Translate";
import Request from "../lib/request";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import "firebase/firestore";
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const DB = firebase.firestore();
const request = new Request();


export default function KinujoStripeCheckout(props) {
    const [cartCount, onCartCountChanged] = useStateIfMounted(0);
    const CHECKOUT_SESSION_ID = props.route.params.checkoutSessionId;
    const STRIPE_PUBLIC_KEY = props.route.params.stripePublicKey;
    const TAX = props.route.params.tax;
    const ADDRESS = props.route.params.address;
    const PRODUCTS = props.route.params.products;
    const USERID = props.route.params.userId;
    const APIURL = request.getApiUrl();
  
    React.useEffect(() => {}, []);

    const KinujoCheckout = ({ STRIPE_PUBLIC_KEY, CHECKOUT_SESSION_ID, PRODUCTS, ADDRESS, TAX, USERID, APIURL, DB}) => (
        <StripeCheckout
            stripePublicKey={STRIPE_PUBLIC_KEY}
            checkoutSessionInput={{
                sessionId: CHECKOUT_SESSION_ID,
            }}
            onSuccess={({ checkoutSessionId }) => {
                console.log(`Stripe checkout session succeeded. session id: ${checkoutSessionId}.`);
                let seller = '';
                fetch(APIURL + "pay/" + USERID + "/", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                            checkoutSessionId: CHECKOUT_SESSION_ID,
                            products: PRODUCTS,
                            address: ADDRESS,
                            tax: TAX,
                        })
                    })
                    .then(function(response) {
                        return response.json();
                    })
                    .then(function(response) {
                        console.log(response.success);
                        seller = response.sellers;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

                    DB.collection("users")
                    .doc(USERID)
                    .collection("carts")
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((documentSnapshot) => {
                            PRODUCTS.forEach(prod => {
                                if (prod.id == documentSnapshot.id) {
                                    DB.collection("users")
                                        .doc(USERID)
                                        .collection("carts")
                                        .doc(documentSnapshot.id)
                                        .delete()
                                        .then(() => {});
                                }
                            });
                        });

                        DB.collection("users")
                            .doc(USERID.toString())
                            .collection("carts")
                            .get()
                            .then((querySnapShot) => {
                                //onCartCountChanged(querySnapShot.size ? querySnapShot.size : 0);
                            });
                        if (seller != '') {
                            DB.collection("sellers")
                                .add({
                                    sellers: seller
                                })
                                .then(() => {
                                });
                        }
                    });
            }}
            onCancel={() => {
                console.log(`Stripe checkout session cancelled.`);
            }}
        />
    );
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CustomHeader
                onBack={() => {
                    props.navigation.goBack();
                }}
                onCartCount={(count) => {
                    onCartCountChanged(count);
                }}
                overrideCartCount={cartCount}
                onFavoritePress={() => props.navigation.navigate("Favorite")}
                onPress={() => {
                    props.navigation.navigate("Cart");
                }}
                text={Translate.t("payment")}
            />
            <KinujoCheckout
                STRIPE_PUBLIC_KEY={STRIPE_PUBLIC_KEY}
                CHECKOUT_SESSION_ID={CHECKOUT_SESSION_ID}
                PRODUCTS={PRODUCTS}
                ADDRESS={ADDRESS}
                TAX={TAX}
                USERID={USERID}
                APIURL={APIURL}
                DB={DB}
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