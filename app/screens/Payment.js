import React from "react";
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
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { Colors } from "../assets/Colors.js";
import { RFValue } from "react-native-responsive-fontsize";
import CustomHeader from "../assets/CustomComponents/CustomHeaderWithBackArrow";
import StripeCheckout from 'react-native-stripe-checkout-webview';
import { WebView } from 'react-native-webview';
import stripe from 'tipsi-stripe'
import CustomAlert from "../lib/alert";
import Translate from "../assets/Translates/Translate";
import { CreditCardInput, LiteCreditCardInput } from "react-native-input-credit-card";
const alert = new CustomAlert();

async function card(){
  const params = {
    // mandatory
    number: '4242424242424242',
    expMonth: 11,
    expYear: 17,
    cvc: '223',
    // optional
    name: 'Test User',
    currency: 'usd',
    addressLine1: '123 Test Street',
    addressLine2: 'Apt. 5',
    addressCity: 'Test City',
    addressState: 'Test State',
    addressCountry: 'Test Country',
    addressZip: '55555',
  }
  
  const token = await stripe.createTokenWithCard(params)
  // alert.warning(token);
}
export default function Payment(props) {
  stripe.setOptions({
    publishableKey: 'pk_test_LhIqls6lfDYI60OM3UzpXPT6',
  })

  React.useEffect(() => {
  }, [])
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader
        onBack={() => {
          props.navigation.pop();
        }}
        onFavoritePress={() => props.navigation.navigate("Favorite")}
        onPress={() => {
          props.navigation.navigate("Cart");
        }}
        text={Translate.t("payment")}
      />
      <View>
        <CreditCardInput onChange={()=>{

        }} />
        <TouchableWithoutFeedback onPress={
            () => {
            }
          }>
          <View style={{ paddingBottom: heightPercentageToDP("10%") }}>
            <View style={styles.orderConfirmButtonContainer}>
              <Text style={styles.orderConfirmButtonText}>支払いを確認する</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
});
