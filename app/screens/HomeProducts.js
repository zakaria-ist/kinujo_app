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
import { useIsFocused } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";
import Format from "../lib/format";
import { firebaseConfig } from "../../firebaseConfig.js";
import firebase from "firebase/app";
import "firebase/firestore";
import CustomAlert from "../lib/alert";
import { Colors } from "../assets/Colors";
const alert = new CustomAlert();
const format = new Format();
const win = Dimensions.get("window");
const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");
const ratioFavorite = width / 29 / 14;
const ratioFavorited = width / 24 / 15;
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
  addFavourite,
  removeFavourite,
  productAuthorityID,
  onSellerNamePress,
  onProductNamePress,
}) {
  const isFocused = useIsFocused();
  const [favourite, setFavourite] = React.useState(false);
  const [favoriteGet, onFavorite] = React.useState("");
  const [favoriteText, showFavoriteText] = React.useState(false);
  const [state, setState] = React.useState(false);
  function checkFavourite(product) {
    AsyncStorage.getItem("user").then((url) => {
      let urls = url.split("/");
      urls = urls.filter((url) => {
        return url;
      });
      let userId = urls[urls.length - 1];
      db.collection("users")
        .doc(userId)
        .collection("favourite")
        .doc(product.toString())
        .get()
        .then(function (doc) {
          if (doc.exists) {
            setFavourite(true);
          }
        });
    });
  }
  // console.log(productAuthorityId);
  React.useEffect(() => {
    if (product_id) {
      checkFavourite(product_id);
    }
  }, [product_id, isFocused]);
  return (
    <SafeAreaView
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginBottom: heightPercentageToDP("5%"),
        // marginHorizontal: heightPercentageToDP("1%"),
        // backgroundColor: "orange",
      }}
    >
      <View style={idx % 2 == 0 ? styles.products_left : styles.products_right}>
        <TouchableWithoutFeedback onPress={onPress}>
          <ImageBackground
            style={styles.product_image}
            source={{
              uri: image,
            }}
            resizeMode="cover"
          >
            <TouchableWithoutFeedback
              onPress={() => {
                AsyncStorage.getItem("user").then((url) => {
                  let urls = url.split("/");
                  urls = urls.filter((url) => {
                    return url;
                  });
                  let userId = urls[urls.length - 1];

                  if (favourite) {
                    db.collection("users")
                      .doc(userId.toString())
                      .collection("favourite")
                      .doc(product_id.toString())
                      .delete();
                    setFavourite(false);
                    if (removeFavourite) {
                      removeFavourite("true");
                    }
                  } else {
                    db.collection("users")
                      .doc(userId.toString())
                      .collection("favourite")
                      .doc(product_id.toString())
                      .set({
                        status: "added",
                        type: productAuthorityID,
                      });
                    if (addFavourite) {
                      addFavourite("true");
                      setTimeout(
                        function () {
                          addFavourite("false");
                        }.bind(this),
                        2000
                      );
                    }

                    setFavourite(true);
                  }
                });
              }}
            >
              <Image
                source={
                  favourite
                    ? require("../assets/Images/favoriteLove.png")
                    : require("../assets/Images/productFavorite.png")
                }

                style={
                  favourite
                    ? styles.favoriteLoveIcon
                    : styles.productFavoriteIcon
                }
              />
            </TouchableWithoutFeedback>
          </ImageBackground>
        </TouchableWithoutFeedback>
        <Text style={styles.product_office}>{office}</Text>
        <TouchableWithoutFeedback onPress={onProductNamePress}>
          <Text style={styles.product_name}>{name}</Text>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={onSellerNamePress}>
          <Text style={styles.product_seller}>
            {Translate.t("seller")} : {seller}
          </Text>
        </TouchableWithoutFeedback>
        <Text style={styles.product_price}>
          {price}
          {Translate.t("taxNotIncluded")}
        </Text>
        <Text numberOfLines={2} style={styles.product_category}>
          {category}
        </Text>
        <Text style={styles.product_shipping}>{shipping}</Text>
      </View>
      {/* </TouchableWithoutFeedback> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  favoriteLoveIcon: {
    width: width / 14,
    height: 21 * ratioFavorited,
    position: "absolute",
    right: 10,
    bottom: 10,
    resizeMode: 'contain',
  },
  productFavoriteIcon: {
    width: width / 14,
    height: 26 * ratioFavorite,
    position: "absolute",
    right: 10,
    bottom: 10,
    resizeMode: 'contain',
  },
  products_left: {
    // alignItems: "center",
    paddingTop: 10,
    marginRight: 5,
    width: width / 2 - 22,
    // overflow: "hidden",
  },
  products_right: {
    // alignItems: "center",
    paddingTop: 10,
    marginLeft: 5,
    width: width / 2 - 22,
    // overflow: "hidden",
  },
  product_image: {
    width: width / 2 - 18,
    height: width / 2.4 - 18,
  },
  product_office: {
    fontSize: RFValue(10),
    width: "100%",
  },
  product_name: {
    fontSize: RFValue(11),
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
