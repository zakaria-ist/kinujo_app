import React from "react";
import {
  StyleSheet,
  Text,
  Button,
  Image,
  ImageBackground,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  SafeAreaView,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-community/async-storage";
import Translate from "../assets/Translates/Translate";
import { RFValue } from "react-native-responsive-fontsize";
import Format from "../lib/format";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import "firebase/firestore";
import CustomAlert from "../lib/alert";
const alert = new CustomAlert();
const format = new Format();
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const ratioFavorite = width / 29 / 14;

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

export default function HomeProducts({
  product_id,
  userId,
  onPress,
  idx,
  image,
  office,
  name,
  seller,
  price,
  category,
  shipping,
}) {
  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={idx % 2 == 0 ? styles.products_left : styles.products_right}
        >
          <ImageBackground
            style={styles.product_image}
            source={{
              uri: image,
            }}
            resizeMode="cover"
          >
            <TouchableWithoutFeedback onPress={
              ()=>{
                AsyncStorage.getItem("user").then( (url) => {
                  let urls = url.split("/");
                  urls = urls.filter((url) => {
                    return url;
                  });
                  let userId = urls[urls.length - 1];

                  db.collection("users")
                    .doc(userId.toString())
                    .collection("favourite")
                    .doc(product_id.toString()).set({
                      "status" : "added"
                    })
                  
                    alert.warning("Added to favourite");
                });
              }
            }>
              <Image
                source={require("../assets/Images/productFavorite.png")}
                style={{
                  width: width / 14,
                  height: 26 * ratioFavorite,
                  position: "absolute",
                  right: 7,
                  bottom: 7,
                }}
              />
            </TouchableWithoutFeedback>
          </ImageBackground>
          <Text style={styles.product_office}>{office}</Text>
          <Text style={styles.product_name}>{name}</Text>
          <Text style={styles.product_seller}>
            {Translate.t("seller")} : {seller}
          </Text>
          <Text style={styles.product_price}>
            {price}
            {Translate.t("taxNotIncluded")}
          </Text>
          <Text numberOfLines={2} style={styles.product_category}>
            {category}
          </Text>
          <Text style={styles.product_shipping}>{shipping}</Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  products_left: {
    paddingTop: 10,
    marginRight: 3,
    width: width / 2 - 18,
    overflow: "hidden",
  },
  products_right: {
    paddingTop: 10,
    marginLeft: 3,
    width: width / 2 - 18,
    overflow: "hidden",
  },
  product_image: {
    width: width / 2 - 18,
    height: width / 2.4 - 18,
  },
  product_office: {
    fontSize: RFValue(9),
    width: "100%",
  },
  product_name: {
    fontSize: RFValue(13),
    width: "100%",
  },
  product_seller: {
    fontSize: RFValue(9),
    width: "100%",
  },
  product_price: {
    fontSize: RFValue(9),
    width: "100%",
  },
  product_category: {
    fontSize: RFValue(9),
    width: "100%",
  },
  product_shipping: {
    fontSize: RFValue(9),
    width: "100%",
  },
});
