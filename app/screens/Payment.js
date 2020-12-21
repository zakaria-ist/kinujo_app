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

const request = new Request();
const alert = new CustomAlert();
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function Payment(props) {
  const [card, onCardChanged] = React.useState({});
  const [spinner, onSpinnerChanged] = React.useState(false);

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
      <View>
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

              if (card && card.valid) {
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
                      db.collection("users")
                        .doc(userId)
                        .collection("carts")
                        .get()
                        .then((querySnapshot) => {
                          querySnapshot.forEach((documentSnapshot) => {
                            db.collection("users")
                              .doc(userId)
                              .collection("carts")
                              .doc(documentSnapshot.id)
                              .delete()
                              .then(() => {});
                          });

                          props.navigation.navigate("PurchaseCompletion");
                        });
                    } else {
                      if (
                        response.errors &&
                        Object.keys(response.errors).length > 0
                      ) {
                        alert.warning(
                          response.errors[Object.keys(response.errors)[0]][0] +
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
  spinnerTextStyle: {
    color: "#FFF",
  },
});
